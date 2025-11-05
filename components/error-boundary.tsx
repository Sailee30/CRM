"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, RotateCw } from "lucide-react"
import { errorHandler } from "@/lib/error-handler"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    errorHandler.handleUIError("ErrorBoundary", error)
    console.error("Error caught by boundary:", errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <Card className="m-4 border-destructive">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle>Something went wrong</CardTitle>
              </div>
              <CardDescription>An unexpected error occurred. Please try refreshing the page.</CardDescription>
            </CardHeader>
            <CardContent>
              <details className="mb-4 text-sm">
                <summary className="cursor-pointer font-medium">Error details</summary>
                <pre className="mt-2 whitespace-pre-wrap break-words bg-muted p-2 rounded text-xs">
                  {this.state.error?.message}
                </pre>
              </details>
              <Button onClick={() => window.location.reload()} className="w-full">
                <RotateCw className="mr-2 h-4 w-4" />
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        )
      )
    }

    return this.props.children
  }
}
