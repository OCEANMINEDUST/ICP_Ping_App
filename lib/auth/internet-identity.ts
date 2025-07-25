import { AuthClient } from "@dfinity/auth-client"
import type { Identity } from "@dfinity/agent"
import type { Principal } from "@dfinity/principal"

export interface InternetIdentityUser {
  principal: Principal
  identity: Identity
  isAuthenticated: boolean
}

export class InternetIdentityService {
  private authClient: AuthClient | null = null
  private identity: Identity | null = null

  async init(): Promise<void> {
    this.authClient = await AuthClient.create({
      idleOptions: {
        idleTimeout: 1000 * 60 * 30, // 30 minutes
        disableDefaultIdleCallback: true,
      },
    })

    if (await this.authClient.isAuthenticated()) {
      this.identity = this.authClient.getIdentity()
    }
  }

  async login(): Promise<InternetIdentityUser | null> {
    if (!this.authClient) {
      await this.init()
    }

    return new Promise((resolve) => {
      this.authClient!.login({
        identityProvider:
          process.env.NODE_ENV === "development"
            ? `http://localhost:8000/?canisterId=${process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID}`
            : "https://identity.ic0.app",
        onSuccess: () => {
          this.identity = this.authClient!.getIdentity()
          const principal = this.identity.getPrincipal()

          resolve({
            principal,
            identity: this.identity,
            isAuthenticated: true,
          })
        },
        onError: (error) => {
          console.error("Internet Identity login failed:", error)
          resolve(null)
        },
      })
    })
  }

  async logout(): Promise<void> {
    if (this.authClient) {
      await this.authClient.logout()
      this.identity = null
    }
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.authClient) {
      await this.init()
    }
    return this.authClient!.isAuthenticated()
  }

  getIdentity(): Identity | null {
    return this.identity
  }

  getPrincipal(): Principal | null {
    return this.identity?.getPrincipal() || null
  }

  getPrincipalText(): string | null {
    const principal = this.getPrincipal()
    return principal ? principal.toString() : null
  }
}

export const internetIdentityService = new InternetIdentityService()
