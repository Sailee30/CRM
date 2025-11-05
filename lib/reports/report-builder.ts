// Report builder engine with filters, grouping, and custom templates
export type ReportType = "sales_pipeline" | "lead_conversion" | "activity_log" | "customer_segmentation" | "sla_metrics"

export interface FilterCondition {
  field: string
  operator: "eq" | "gt" | "lt" | "contains" | "between" | "in"
  value: any
}

export interface ReportConfig {
  id: string
  name: string
  type: ReportType
  description?: string
  filters: FilterCondition[]
  groupBy?: string
  timeRange: {
    start: Date
    end: Date
  }
  metrics: string[]
  visualization: "table" | "bar" | "line" | "pie" | "pivot"
  createdAt: Date
  updatedAt: Date
  isTemplate: boolean
}

export interface ReportData {
  config: ReportConfig
  data: Record<string, any>[]
  summary: Record<string, any>
  generatedAt: Date
}

// Data aggregation engine
export class ReportBuilder {
  private templates: Map<string, ReportConfig> = new Map()

  constructor() {
    this.initializeDefaultTemplates()
  }

  private initializeDefaultTemplates() {
    // Sales Pipeline Report Template
    this.templates.set("sales_pipeline_template", {
      id: "sales_pipeline_template",
      name: "Sales Pipeline Overview",
      type: "sales_pipeline",
      filters: [],
      groupBy: "stage",
      timeRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
      metrics: ["count", "total_value", "average_value", "win_rate"],
      visualization: "bar",
      createdAt: new Date(),
      updatedAt: new Date(),
      isTemplate: true,
    })

    // Lead Conversion Report Template
    this.templates.set("lead_conversion_template", {
      id: "lead_conversion_template",
      name: "Lead Conversion Analysis",
      type: "lead_conversion",
      filters: [],
      groupBy: "source",
      timeRange: {
        start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
      metrics: ["leads_generated", "leads_converted", "conversion_rate", "time_to_conversion"],
      visualization: "line",
      createdAt: new Date(),
      updatedAt: new Date(),
      isTemplate: true,
    })

    // Customer Segmentation Report Template
    this.templates.set("customer_segmentation_template", {
      id: "customer_segmentation_template",
      name: "Customer Segmentation",
      type: "customer_segmentation",
      filters: [],
      groupBy: "segment",
      timeRange: {
        start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
      metrics: ["segment_size", "revenue", "lifetime_value", "churn_rate"],
      visualization: "pie",
      createdAt: new Date(),
      updatedAt: new Date(),
      isTemplate: true,
    })

    // SLA Metrics Report Template
    this.templates.set("sla_metrics_template", {
      id: "sla_metrics_template",
      name: "SLA & Response Times",
      type: "sla_metrics",
      filters: [],
      groupBy: "team",
      timeRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
      metrics: ["avg_response_time", "avg_resolution_time", "sla_compliance", "ticket_count"],
      visualization: "table",
      createdAt: new Date(),
      updatedAt: new Date(),
      isTemplate: true,
    })
  }

  getTemplate(templateId: string): ReportConfig | undefined {
    return this.templates.get(templateId)
  }

  getAllTemplates(): ReportConfig[] {
    return Array.from(this.templates.values())
  }

  saveCustomTemplate(config: ReportConfig): void {
    this.templates.set(config.id, config)
  }

  applyFilters(data: Record<string, any>[], filters: FilterCondition[]): Record<string, any>[] {
    return data.filter((item) => {
      return filters.every((filter) => {
        const value = item[filter.field]

        switch (filter.operator) {
          case "eq":
            return value === filter.value
          case "gt":
            return value > filter.value
          case "lt":
            return value < filter.value
          case "contains":
            return String(value).includes(String(filter.value))
          case "between":
            return value >= filter.value[0] && value <= filter.value[1]
          case "in":
            return filter.value.includes(value)
          default:
            return true
        }
      })
    })
  }

  groupData(data: Record<string, any>[], groupBy: string): Map<string, Record<string, any>[]> {
    const grouped = new Map<string, Record<string, any>[]>()

    for (const item of data) {
      const key = String(item[groupBy])
      if (!grouped.has(key)) {
        grouped.set(key, [])
      }
      grouped.get(key)!.push(item)
    }

    return grouped
  }

  calculateMetrics(data: Record<string, any>[], metrics: string[]): Record<string, any> {
    const result: Record<string, any> = {}

    for (const metric of metrics) {
      switch (metric) {
        case "count":
          result.count = data.length
          break
        case "total_value":
          result.total_value = data.reduce((sum, item) => sum + (item.value || 0), 0)
          break
        case "average_value":
          result.average_value = data.length > 0 ? result.total_value / data.length : 0
          break
        case "min_value":
          result.min_value = Math.min(...data.map((item) => item.value || 0))
          break
        case "max_value":
          result.max_value = Math.max(...data.map((item) => item.value || 0))
          break
        case "conversion_rate":
          const converted = data.filter((item) => item.converted).length
          result.conversion_rate = data.length > 0 ? (converted / data.length) * 100 : 0
          break
        case "sla_compliance":
          const compliant = data.filter((item) => item.sla_met).length
          result.sla_compliance = data.length > 0 ? (compliant / data.length) * 100 : 0
          break
      }
    }

    return result
  }

  buildReport(sampleData: Record<string, any>[], config: ReportConfig): ReportData {
    // Apply filters
    let filtered = this.applyFilters(sampleData, config.filters)

    // Calculate summary metrics
    const summary = this.calculateMetrics(filtered, config.metrics)

    // Group if specified
    if (config.groupBy) {
      const grouped = this.groupData(filtered, config.groupBy)
      filtered = Array.from(grouped.entries()).map(([group, items]) => ({
        group,
        ...this.calculateMetrics(items, config.metrics),
      }))
    }

    return {
      config,
      data: filtered,
      summary,
      generatedAt: new Date(),
    }
  }
}
