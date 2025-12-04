'use client'

import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  text?: string
}

/**
 * Professional Loading Spinner Component
 * Displays a centered, animated loading indicator
 * Can be used for page loads, data fetching, or full-screen overlays
 */
export function LoadingSpinner({ size = 'md', fullScreen = false, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Outer rotating ring */}
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-4 border-muted-foreground/20 border-t-primary animate-spin`} />
        {/* Optional: Inner accent ring for visual depth */}
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-primary/50 animate-spin" style={{ animationDirection: 'reverse' }} />
      </div>

      {/* Loading text */}
      {text && (
        <div className="text-center">
          <p className="text-muted-foreground text-sm font-medium">{text}</p>
          <div className="flex gap-1 justify-center mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.15s' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.3s' }} />
          </div>
        </div>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinnerContent}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      {spinnerContent}
    </div>
  )
}

/**
 * Compact Loading Spinner
 * For inline loading states (buttons, small sections)
 */
export function LoadingSpinnerCompact() {
  return (
    <div className="inline-block">
      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/20 border-t-primary animate-spin" />
    </div>
  )
}
