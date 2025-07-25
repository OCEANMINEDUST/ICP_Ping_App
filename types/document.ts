export interface Document {
  id: string
  url: string
  title: string
  content: string
  timestamp: number
  preview: string
}

export interface DocumentMetadata {
  id: string
  title: string
  url: string
  timestamp: number
  contentLength: number
}

// Motoko-equivalent types for reference
export interface MotokoDocument {
  id: string
  url: string
  content: string
  timestamp: number
  metadata: {
    title: string
    author?: string
    lastModified?: number
  }
}
