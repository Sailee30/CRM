// Data sync and consistency management
export interface SyncOperation {
  id: string
  type: "fetch" | "update" | "delete" | "create"
  resource: string
  status: "pending" | "in-progress" | "completed" | "failed"
  retries: number
  maxRetries: number
  lastAttempt?: Date
  error?: string
}

export class DataSyncManager {
  private queue: Map<string, SyncOperation> = new Map()
  private cache: Map<string, { data: any; timestamp: Date }> = new Map()
  private syncInterval = 5000 // 5 seconds
  private isSyncing = false

  async queueOperation(operation: Omit<SyncOperation, "id" | "status" | "retries">): Promise<string> {
    const id = `sync-${Date.now()}-${Math.random()}`
    const syncOp: SyncOperation = {
      ...operation,
      id,
      status: "pending",
      retries: 0,
    }

    this.queue.set(id, syncOp)
    return id
  }

  // Process queued operations
  async processQueue(): Promise<void> {
    if (this.isSyncing) return

    this.isSyncing = true

    try {
      for (const [, operation] of this.queue) {
        if (operation.status === "pending") {
          await this.executeOperation(operation)
        }
      }
    } finally {
      this.isSyncing = false
    }
  }

  private async executeOperation(operation: SyncOperation): Promise<void> {
    if (operation.retries >= operation.maxRetries) {
      operation.status = "failed"
      return
    }

    operation.status = "in-progress"
    operation.lastAttempt = new Date()

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Check for errors
      if (Math.random() > 0.95) {
        throw new Error("Simulated sync error")
      }

      operation.status = "completed"
      this.cache.set(operation.id, { data: null, timestamp: new Date() })
    } catch (error) {
      operation.retries++
      operation.error = String(error)

      if (operation.retries < operation.maxRetries) {
        operation.status = "pending"
      } else {
        operation.status = "failed"
      }
    }
  }

  // Get sync status
  getQueueStatus() {
    const pending = Array.from(this.queue.values()).filter((op) => op.status === "pending").length
    const failed = Array.from(this.queue.values()).filter((op) => op.status === "failed").length
    const completed = Array.from(this.queue.values()).filter((op) => op.status === "completed").length

    return { pending, failed, completed, total: this.queue.size }
  }

  // Clear completed operations
  clearCompleted(): void {
    for (const [id, op] of this.queue) {
      if (op.status === "completed") {
        this.queue.delete(id)
      }
    }
  }

  // Start auto-sync
  startAutoSync(): void {
    setInterval(() => {
      this.processQueue()
      this.clearCompleted()
    }, this.syncInterval)
  }

  // Cache management
  getCached(key: string): any {
    return this.cache.get(key)?.data
  }

  setCached(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: new Date() })
  }

  invalidateCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear()
    } else {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key)
        }
      }
    }
  }
}

export const dataSyncManager = new DataSyncManager()
