'use client'

import React from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface ReferralCodeQRProps {
  code: string
  size?: number
}

export function ReferralCodeQR({ code, size = 200 }: ReferralCodeQRProps) {
  const qrValue = `SKIIN-REF:${code}`
  
  return (
    <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <QRCodeSVG 
          value={qrValue}
          size={size}
          level="M"
          includeMargin={true}
          imageSettings={{
            src: '/assets/logos/skiin-icon.svg',
            height: 24,
            width: 24,
            excavate: true
          }}
        />
      </div>
    </div>
  )
}