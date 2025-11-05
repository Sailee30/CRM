"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Function to check if viewport width is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // 1024px is the lg breakpoint in Tailwind
    }

    // Initial check
    checkMobile()

    // Listen for window resize events
    window.addEventListener("resize", checkMobile)

    // Clean up event listener
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}
