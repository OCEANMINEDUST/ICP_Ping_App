import { Actor, HttpAgent } from "@dfinity/agent"
import type { Principal } from "@dfinity/principal"

// ICP Integration Layer for Ping App
export interface ICPUser {
  id: Principal
  walletAddress: string
  jetTokens: bigint
  totalScans: bigint
  totalRecycled: bigint
  level: string
  createdAt: bigint
}

export interface ICPProduct {
  id: string
  name: string
  brand: string
  qrCode: string
  isAuthentic: boolean
  rewardAmount: bigint
}

export interface ICPRecyclingPoint {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  bottlesCollected: bigint
  isActive: boolean
}

export interface ICPTransaction {
  id: string
  userId: Principal
  transactionType: string
  amount: bigint
  timestamp: bigint
  description: string
  metadata: string
}

// IDL Interface Definition
export const idlFactory = ({ IDL }: any) => {
  const User = IDL.Record({
    id: IDL.Principal,
    walletAddress: IDL.Text,
    jetTokens: IDL.Nat,
    totalScans: IDL.Nat,
    totalRecycled: IDL.Nat,
    level: IDL.Text,
    createdAt: IDL.Int,
  })

  const Product = IDL.Record({
    id: IDL.Text,
    name: IDL.Text,
    brand: IDL.Text,
    qrCode: IDL.Text,
    isAuthentic: IDL.Bool,
    rewardAmount: IDL.Nat,
  })

  const RecyclingPoint = IDL.Record({
    id: IDL.Text,
    name: IDL.Text,
    address: IDL.Text,
    latitude: IDL.Float64,
    longitude: IDL.Float64,
    bottlesCollected: IDL.Nat,
    isActive: IDL.Bool,
  })

  const Transaction = IDL.Record({
    id: IDL.Text,
    userId: IDL.Principal,
    transactionType: IDL.Text,
    amount: IDL.Int,
    timestamp: IDL.Int,
    description: IDL.Text,
    metadata: IDL.Text,
  })

  const ScanResult = IDL.Record({
    success: IDL.Bool,
    product: IDL.Opt(Product),
    tokensEarned: IDL.Nat,
    message: IDL.Text,
  })

  const RecycleResult = IDL.Record({
    success: IDL.Bool,
    tokensEarned: IDL.Nat,
    bottleCount: IDL.Nat,
    message: IDL.Text,
  })

  return IDL.Service({
    registerUser: IDL.Func([IDL.Text], [IDL.Variant({ ok: User, err: IDL.Text })], []),
    getUser: IDL.Func([IDL.Principal], [IDL.Opt(User)], ["query"]),
    getCurrentUser: IDL.Func([], [IDL.Opt(User)], ["query"]),
    scanProduct: IDL.Func([IDL.Text, IDL.Opt(IDL.Text)], [IDL.Variant({ ok: ScanResult, err: IDL.Text })], []),
    recycleBottles: IDL.Func([IDL.Text, IDL.Nat, IDL.Text], [IDL.Variant({ ok: RecycleResult, err: IDL.Text })], []),
    redeemTokens: IDL.Func([IDL.Nat, IDL.Text], [IDL.Variant({ ok: IDL.Text, err: IDL.Text })], []),
    getRecyclingPoints: IDL.Func([], [IDL.Vec(RecyclingPoint)], ["query"]),
    getUserTransactions: IDL.Func([IDL.Principal], [IDL.Vec(Transaction)], ["query"]),
    getLeaderboard: IDL.Func([IDL.Nat], [IDL.Vec(User)], ["query"]),
    addProduct: IDL.Func([Product], [IDL.Variant({ ok: IDL.Null, err: IDL.Text })], []),
    addRecyclingPoint: IDL.Func([RecyclingPoint], [IDL.Variant({ ok: IDL.Null, err: IDL.Text })], []),
    getGlobalStats: IDL.Func(
      [],
      [
        IDL.Record({
          totalUsers: IDL.Nat,
          totalScans: IDL.Nat,
          totalBottlesRecycled: IDL.Nat,
          totalTokensInCirculation: IDL.Nat,
        }),
      ],
      ["query"],
    ),
  })
}

// ICP Service Class
export class PingICPService {
  private actor: any
  private agent: HttpAgent

  constructor(canisterId: string, host?: string) {
    this.agent = new HttpAgent({ host: host || "https://ic0.app" })

    // In development, fetch root key
    if (process.env.NODE_ENV === "development") {
      this.agent.fetchRootKey()
    }

    this.actor = Actor.createActor(idlFactory, {
      agent: this.agent,
      canisterId,
    })
  }

  async registerUser(walletAddress: string): Promise<ICPUser | string> {
    try {
      const result = await this.actor.registerUser(walletAddress)
      if ("ok" in result) {
        return this.convertUser(result.ok)
      } else {
        return result.err
      }
    } catch (error) {
      throw new Error(`Registration failed: ${error}`)
    }
  }

  async getCurrentUser(): Promise<ICPUser | null> {
    try {
      const result = await this.actor.getCurrentUser()
      return result ? this.convertUser(result) : null
    } catch (error) {
      console.error("Failed to get current user:", error)
      return null
    }
  }

  async scanProduct(qrCode: string, geolocation?: string): Promise<any> {
    try {
      const result = await this.actor.scanProduct(qrCode, geolocation ? [geolocation] : [])
      if ("ok" in result) {
        return {
          success: result.ok.success,
          product: result.ok.product ? this.convertProduct(result.ok.product) : null,
          tokensEarned: Number(result.ok.tokensEarned),
          message: result.ok.message,
        }
      } else {
        throw new Error(result.err)
      }
    } catch (error) {
      throw new Error(`Scan failed: ${error}`)
    }
  }

  async recycleBottles(recyclingPointId: string, bottleCount: number, geolocation: string): Promise<any> {
    try {
      const result = await this.actor.recycleBottles(recyclingPointId, bottleCount, geolocation)
      if ("ok" in result) {
        return {
          success: result.ok.success,
          tokensEarned: Number(result.ok.tokensEarned),
          bottleCount: Number(result.ok.bottleCount),
          message: result.ok.message,
        }
      } else {
        throw new Error(result.err)
      }
    } catch (error) {
      throw new Error(`Recycling failed: ${error}`)
    }
  }

  async getRecyclingPoints(): Promise<ICPRecyclingPoint[]> {
    try {
      const points = await this.actor.getRecyclingPoints()
      return points.map(this.convertRecyclingPoint)
    } catch (error) {
      console.error("Failed to get recycling points:", error)
      return []
    }
  }

  async getUserTransactions(userId: Principal): Promise<ICPTransaction[]> {
    try {
      const transactions = await this.actor.getUserTransactions(userId)
      return transactions.map(this.convertTransaction)
    } catch (error) {
      console.error("Failed to get user transactions:", error)
      return []
    }
  }

  async getGlobalStats(): Promise<any> {
    try {
      const stats = await this.actor.getGlobalStats()
      return {
        totalUsers: Number(stats.totalUsers),
        totalScans: Number(stats.totalScans),
        totalBottlesRecycled: Number(stats.totalBottlesRecycled),
        totalTokensInCirculation: Number(stats.totalTokensInCirculation),
      }
    } catch (error) {
      console.error("Failed to get global stats:", error)
      return null
    }
  }

  // Helper conversion methods
  private convertUser(user: any): ICPUser {
    return {
      id: user.id,
      walletAddress: user.walletAddress,
      jetTokens: user.jetTokens,
      totalScans: user.totalScans,
      totalRecycled: user.totalRecycled,
      level: user.level,
      createdAt: user.createdAt,
    }
  }

  private convertProduct(product: any): ICPProduct {
    return {
      id: product.id,
      name: product.name,
      brand: product.brand,
      qrCode: product.qrCode,
      isAuthentic: product.isAuthentic,
      rewardAmount: product.rewardAmount,
    }
  }

  private convertRecyclingPoint(point: any): ICPRecyclingPoint {
    return {
      id: point.id,
      name: point.name,
      address: point.address,
      latitude: point.latitude,
      longitude: point.longitude,
      bottlesCollected: point.bottlesCollected,
      isActive: point.isActive,
    }
  }

  private convertTransaction(tx: any): ICPTransaction {
    return {
      id: tx.id,
      userId: tx.userId,
      transactionType: tx.transactionType,
      amount: tx.amount,
      timestamp: tx.timestamp,
      description: tx.description,
      metadata: tx.metadata,
    }
  }
}

// Environment configuration
export const getCanisterId = (): string => {
  return process.env.NEXT_PUBLIC_PING_CANISTER_ID || "rrkah-fqaaa-aaaaa-aaaaq-cai"
}

export const getICPHost = (): string => {
  return process.env.NODE_ENV === "development" ? "http://localhost:8000" : "https://ic0.app"
}

// Initialize service
export const pingService = new PingICPService(getCanisterId(), getICPHost())
