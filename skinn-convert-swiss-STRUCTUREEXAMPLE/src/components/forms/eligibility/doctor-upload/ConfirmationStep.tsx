'use client'

import React from 'react'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Mail, Phone, FileText } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ConfirmationStepProps {
  formData: Record<string, unknown>
}

export function ConfirmationStep({ formData }: ConfirmationStepProps) {
  return (
    <>
      <CardHeader>
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        <CardTitle className="text-center text-green-600">
          Referral Uploaded Successfully!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            The referral has been successfully uploaded and linked to the patient's record.
            Both you and the patient will receive confirmation emails shortly.
          </AlertDescription>
        </Alert>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-600">
            Upload Summary
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                Referral Code: <strong>{formData.referralCode}</strong>
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                Confirmation sent to: <strong>{formData.doctorHinEmail}</strong>
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                Contact: <strong>{formData.doctorPhone}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">What happens next?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              The patient has been notified of your referral submission
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              The Holter monitoring kit will be shipped to the patient
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              You will receive the monitoring results once completed
            </li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => window.print()}
          >
            Print Confirmation
          </Button>
          <Button
            className="flex-1"
            onClick={() => window.location.href = '/'}
          >
            Upload Another
          </Button>
        </div>
      </CardContent>
    </>
  )
}