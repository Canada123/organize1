import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeEntryStep } from './doctor-upload/CodeEntryStep'
import { DoctorDetailsStep } from './doctor-upload/DoctorDetailsStep'
import { DocumentUploadStep } from './doctor-upload/DocumentUploadStep'
import { ConfirmationStep } from './doctor-upload/ConfirmationStep'
import { Progress } from '@/components/ui/progress'

type Step = 'code' | 'details' | 'upload' | 'confirmation'

interface FormData {
  referralCode: string
  doctorName: string
  doctorTitle?: string
  clinicName: string
  doctorHinEmail: string
  doctorPhone: string
  referralDocument?: File
  gdprConsent: boolean
}

export function DoctorUploadPortal() {
  const [currentStep, setCurrentStep] = useState<Step>('code')
  const [formData, setFormData] = useState<FormData>({
    referralCode: '',
    doctorName: '',
    clinicName: '',
    doctorHinEmail: '',
    doctorPhone: '',
    gdprConsent: false
  })

  const steps = ['code', 'details', 'upload', 'confirmation'] as const
  const progress = ((steps.indexOf(currentStep) + 1) / steps.length) * 100

  const handleNext = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <DoctorPortalHeader />
        <Progress value={progress} className="mb-6" />
        <Card>
          {currentStep === 'code' && (
            <CodeEntryStep onNext={handleNext} />
          )}
          {currentStep === 'details' && (
            <DoctorDetailsStep formData={formData} onNext={handleNext} onBack={handleBack} />
          )}
          {currentStep === 'upload' && (
            <DocumentUploadStep formData={formData} onNext={handleNext} onBack={handleBack} />
          )}
          {currentStep === 'confirmation' && (
            <ConfirmationStep formData={formData} />
          )}
        </Card>
      </div>
    </div>
  )
}

function DoctorPortalHeader() {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center items-center gap-4 mb-4">
        <img src="/assets/logos/skiin-logo.svg" alt="SKIIN" className="h-8" />
        <div className="h-8 w-px bg-gray-300" />
        <img src="/assets/logos/fmh-logo.svg" alt="FMH Approved" className="h-8" />
      </div>
      <h1 className="text-2xl font-semibold text-primary">
        GP Referral Upload Portal
      </h1>
      <p className="text-gray-600 mt-2">
        Secure document upload for healthcare providers
      </p>
    </div>
  )
}