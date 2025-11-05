// Job scheduling and model retraining pipeline
export type JobStatus = "pending" | "running" | "completed" | "failed"

export interface ScheduledJob {
  id: string
  name: string
  type: "clustering" | "lead_scoring" | "data_sync"
  schedule: string // cron expression or interval
  lastRun?: Date
  nextRun?: Date
  status: JobStatus
  retries: number
  maxRetries: number
}

export interface ModelVersion {
  id: string
  modelType: "kmeans" | "lead_scoring"
  version: number
  trainedAt: Date
  accuracy?: number
  sampleSize: number
  active: boolean
}

// Simple job scheduler
export class JobScheduler {
  private jobs: Map<string, ScheduledJob> = new Map()
  private modelVersions: Map<string, ModelVersion[]> = new Map()
  private activeJobs: Set<string> = new Set()

  addJob(job: ScheduledJob): void {
    this.jobs.set(job.id, job)
  }

  getJob(jobId: string): ScheduledJob | undefined {
    return this.jobs.get(jobId)
  }

  getAllJobs(): ScheduledJob[] {
    return Array.from(this.jobs.values())
  }

  updateJobStatus(jobId: string, status: JobStatus): void {
    const job = this.jobs.get(jobId)
    if (job) {
      job.status = status
      job.lastRun = new Date()

      // Calculate next run based on schedule
      if (status === "completed") {
        if (job.schedule.includes("daily")) {
          job.nextRun = new Date(Date.now() + 24 * 60 * 60 * 1000)
        } else if (job.schedule.includes("hourly")) {
          job.nextRun = new Date(Date.now() + 60 * 60 * 1000)
        } else if (job.schedule.includes("weekly")) {
          job.nextRun = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      }
    }
  }

  recordJobFailure(jobId: string): boolean {
    const job = this.jobs.get(jobId)
    if (job) {
      job.retries++
      if (job.retries >= job.maxRetries) {
        job.status = "failed"
        return false
      } else {
        job.status = "pending"
        return true
      }
    }
    return false
  }

  // Model versioning
  recordModelVersion(modelVersion: ModelVersion): void {
    const versions = this.modelVersions.get(modelVersion.modelType) || []
    versions.push(modelVersion)

    // Deactivate other versions
    for (const v of versions) {
      if (v.id !== modelVersion.id) {
        v.active = false
      }
    }

    this.modelVersions.set(modelVersion.modelType, versions)
  }

  getActiveModel(modelType: string): ModelVersion | undefined {
    const versions = this.modelVersions.get(modelType) || []
    return versions.find((v) => v.active)
  }

  getModelVersions(modelType: string): ModelVersion[] {
    return this.modelVersions.get(modelType) || []
  }

  rollbackModelVersion(modelType: string, version: number): boolean {
    const versions = this.modelVersions.get(modelType) || []
    const targetVersion = versions.find((v) => v.version === version)

    if (targetVersion) {
      // Deactivate all
      for (const v of versions) {
        v.active = false
      }

      // Activate target
      targetVersion.active = true
      return true
    }

    return false
  }

  isJobActive(jobId: string): boolean {
    return this.activeJobs.has(jobId)
  }

  setJobActive(jobId: string, active: boolean): void {
    if (active) {
      this.activeJobs.add(jobId)
    } else {
      this.activeJobs.delete(jobId)
    }
  }
}

// Export singleton instance
export const jobScheduler = new JobScheduler()
