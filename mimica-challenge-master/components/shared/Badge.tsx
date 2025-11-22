import React from 'react'
import { badgeVariants } from '@/lib/design-tokens'

interface BadgeProps {
  variant: 'ease' | 'automatability'
  value: string
}

export function Badge({ variant, value }: BadgeProps) {
  const config = badgeVariants[variant][value as keyof typeof badgeVariants[typeof variant]]
  
  if (!config) {
    return null
  }
  
  return (
    <span
      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
      style={{
        backgroundColor: config.bg,
        color: config.text,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: config.text }} />
      {value}
    </span>
  )
}