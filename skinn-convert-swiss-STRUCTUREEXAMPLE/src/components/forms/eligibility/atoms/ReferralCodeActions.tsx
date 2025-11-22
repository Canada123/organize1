'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Download, MessageSquare, Mail, Printer } from 'lucide-react'

interface ReferralCodeActionsProps {
  onDownload?: () => void
  onShare?: (method: 'sms' | 'email' | 'print') => void
}

export function ReferralCodeActions({ onDownload, onShare }: ReferralCodeActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 pt-4">
      <Button
        onClick={onDownload}
        variant="default"
        className="w-full"
      >
        <Download className="h-4 w-4 mr-2" />
        Download PDF
      </Button>
      
      <Button
        onClick={() => onShare?.('print')}
        variant="outline"
        className="w-full"
      >
        <Printer className="h-4 w-4 mr-2" />
        Print
      </Button>
      
      <Button
        onClick={() => onShare?.('sms')}
        variant="outline"
        className="w-full"
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        SMS Code
      </Button>
      
      <Button
        onClick={() => onShare?.('email')}
        variant="outline"
        className="w-full"
      >
        <Mail className="h-4 w-4 mr-2" />
        Email Code
      </Button>
    </div>
  )
}