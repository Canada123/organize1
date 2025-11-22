import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { ReferralCodeQR } from './atoms/ReferralCodeQR'
import { ReferralCodeText } from './atoms/ReferralCodeText'
import { ExpiryNotice } from './atoms/ExpiryNotice'
import { ReferralCodeActions } from './atoms/ReferralCodeActions'

interface ReferralCodeDisplayProps {
  code: string
  expiresAt: Date
  patientName: string
  onDownload?: () => void
  onShare?: (method: 'sms' | 'email' | 'print') => void
}

export function ReferralCodeDisplay({
  code,
  expiresAt,
  patientName,
  onDownload,
  onShare
}: ReferralCodeDisplayProps) {
  const { toast } = useToast()

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    toast({
      title: 'Code copied!',
      description: 'Referral code copied to clipboard'
    })
  }

  const daysUntilExpiry = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Your GP Referral Code</CardTitle>
        <CardDescription>Share this code with your doctor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ReferralCodeQR code={code} />
        <ReferralCodeText code={code} onCopy={copyToClipboard} />
        <ExpiryNotice daysRemaining={daysUntilExpiry} />
        <ReferralCodeActions onDownload={onDownload} onShare={onShare} />
      </CardContent>
    </Card>
  )
}