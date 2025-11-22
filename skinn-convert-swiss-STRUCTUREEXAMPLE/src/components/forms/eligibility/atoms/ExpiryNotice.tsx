'use client'

import React from 'react'
import { Clock, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ExpiryNoticeProps {
  daysRemaining: number
}

export function ExpiryNotice({ daysRemaining }: ExpiryNoticeProps) {
  const isUrgent = daysRemaining <= 2
  const Icon = isUrgent ? AlertCircle : Clock
  const variant = isUrgent ? 'destructive' : 'default'
  
  const message = isUrgent
    ? `Code expires in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}! Please visit your GP soon.`
    : `This code is valid for ${daysRemaining} days`

  return (
    <Alert variant={variant} className="flex items-center gap-2">
      <Icon className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}