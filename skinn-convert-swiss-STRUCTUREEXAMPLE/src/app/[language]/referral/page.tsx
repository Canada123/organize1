import { Metadata } from 'next'
import { DoctorUploadPortal } from '@/components/forms/eligibility/DoctorUploadPortal'

export const metadata: Metadata = {
  title: 'GP Referral Upload | SKIIN Switzerland',
  description: 'Secure document upload portal for healthcare providers',
}

export default function ReferralUploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <DoctorUploadPortal />
    </div>
  )
}