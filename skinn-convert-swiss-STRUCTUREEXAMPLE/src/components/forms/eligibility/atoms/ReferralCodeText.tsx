'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'

interface ReferralCodeTextProps {
  code: string
  onCopy: () => void
}

export function ReferralCodeText({ code, onCopy }: ReferralCodeTextProps) {
  const formattedCode = code.split('').map((char, i) => (
    <span
      key={i}
      className="inline-block mx-1 px-3 py-2 bg-white border-2 border-primary/20 rounded-md font-mono text-2xl font-bold text-primary"
    >
      {char}
    </span>
  ))

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-600 mb-3">Your Referral Code</p>
        <div className="flex justify-center items-center">
          <div>{formattedCode}</div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCopy}
            className="ml-4"
            aria-label="Copy referral code"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}