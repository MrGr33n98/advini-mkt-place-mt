"use client"

import { ReactNode, useEffect, useState } from 'react'

interface ScreenReaderAnnouncementProps {
  children: ReactNode
  message?: string
  priority?: 'polite' | 'assertive'
}

export function ScreenReaderAnnouncement({ 
  children, 
  message, 
  priority = 'polite' 
}: ScreenReaderAnnouncementProps) {
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    if (message) {
      setAnnouncement(message)
      // Clear the announcement after a short delay to allow screen readers to read it
      const timer = setTimeout(() => setAnnouncement(''), 1000)
      return () => clearTimeout(timer)
    }
  }, [message])

  return (
    <>
      {/* Screen reader announcement */}
      <div
        aria-live={priority}
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
      {children}
    </>
  )
}