import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface ReferralQRCodeProps {
  referralCode: string;
  patientName?: string;
  className?: string;
}

export const ReferralQRCode: React.FC<ReferralQRCodeProps> = ({ 
  referralCode, 
  patientName,
  className 
}) => {
  // Generate QR code data with referral information
  const qrData = JSON.stringify({
    code: referralCode,
    patient: patientName || 'Anonymous',
    timestamp: new Date().toISOString(),
    portal: 'https://skiin.ch/referral'
  });

  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center p-6 space-y-4">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <QRCodeSVG
            value={qrData}
            size={200}
            bgColor="#ffffff"
            fgColor="#004C96"
            level="M"
            includeMargin={true}
          />
        </div>
        <div className="text-center space-y-2">
          <p className="text-2xl font-mono font-bold text-[#004C96]">
            {referralCode}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>Show this code to your GP</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};