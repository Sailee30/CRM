"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { errorHandler } from "@/lib/error-handler"

interface SessionManagerProps {
  warningTimeMs?: number
  logoutTimeMs?: number
}

export function SessionManager({
  warningTimeMs = 15 * 60 * 1000, // 15 minutes
  logoutTimeMs = 30 * 60 * 1000, // 30 minutes
}: SessionManagerProps) {
  const router = useRouter()
  const [showWarning, setShowWarning] = useState(false)
  const [sessionExpiring, setSessionExpiring] = useState(false)
  const lastActivityRef = React.useRef(Date.now())

  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now()
      setShowWarning(false)
    }

    // Track user activity
    const events = ["mousedown", "keydown", "scroll", "touchstart"]
    events.forEach((event) => {
      document.addEventListener(event, handleActivity)
    })

    // Check session status
    const sessionInterval = setInterval(() => {
      const inactiveTime = Date.now() - lastActivityRef.current

      if (inactiveTime >= logoutTimeMs) {
        setSessionExpiring(true)
        handleLogout()
      } else if (inactiveTime >= warningTimeMs) {
        setShowWarning(true)
      } else {
        setShowWarning(false)
      }
    }, 60000) // Check every minute

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity)
      })
      clearInterval(sessionInterval)
    }
  }, [logoutTimeMs, warningTimeMs])

  const handleLogout = () => {
    errorHandler.logError("SESSION_EXPIRED", "Your session has expired.", "high")
    router.push("/login")
  }

  const handleExtendSession = () => {
    lastActivityRef.current = Date.now()
    setShowWarning(false)
  }

  return (
    <Dialog open={showWarning}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session Expiring Soon</DialogTitle>
          <DialogDescription>
            Your session will expire in 15 minutes due to inactivity. Do you want to continue?
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleLogout} className="flex-1 bg-transparent">
            Logout
          </Button>
          <Button onClick={handleExtendSession} className="flex-1">
            Continue Session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
