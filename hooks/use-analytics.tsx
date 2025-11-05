"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { trackPageView, trackEvent, identifyUser } from "@/lib/analytics"

export function useAnalytics() {
  const pathname = usePathname()
  // Note: useSearchParams requires a Suspense boundary in the parent component
  const searchParams = useSearchParams()

  // Track page views
  useEffect(() => {
    if (pathname) {
      // We need to handle the case where searchParams might not be available yet
      const url = searchParams ? `${pathname}${searchParams.size ? `?${searchParams.toString()}` : ""}` : pathname

      trackPageView(url)
    }
  }, [pathname, searchParams])

  return {
    trackEvent,
    identifyUser,
  }
}
