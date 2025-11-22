'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Upload, FileText, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react'

interface DocumentUploadStepProps {
  formData: Record<string, unknown>
  onNext: (data: any) => void
  onBack: () => void
}

export function DocumentUploadStep({ formData, onNext, onBack }: DocumentUploadStepProps) {
  const [file, setFile] = useState<File | null>(null)
  const [gdprConsent, setGdprConsent] = useState(false)
  const [error, setError] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }
      setFile(file)
      setError('')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  })

  const handleSubmit = async () => {
    if (!file) {
      setError('Please upload a referral document')
      return
    }
    if (!gdprConsent) {
      setError('Please confirm GDPR consent')
      return
    }

    setIsUploading(true)
    // TODO: Upload file to backend
    // For now, simulate upload
    setTimeout(() => {
      onNext({ referralDocument: file, gdprConsent })
    }, 2000)
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Upload Referral Document</CardTitle>
        <CardDescription>
          Upload the signed GP referral document
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
            ${file ? 'bg-green-50 border-green-300' : ''}`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="space-y-2">
              <FileText className="h-12 w-12 mx-auto text-green-600" />
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-600">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setFile(null)
                }}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-12 w-12 mx-auto text-gray-400" />
              <p className="font-medium">
                {isDragActive ? 'Drop the file here' : 'Drag & drop your referral document'}
              </p>
              <p className="text-sm text-gray-600">
                or click to browse (PDF or images, max 10MB)
              </p>
            </div>
          )}
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="gdpr"
            checked={gdprConsent}
            onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
          />
          <Label htmlFor="gdpr" className="text-sm">
            I confirm that I have patient consent to upload this document and agree to
            SKIIN's data processing terms
          </Label>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onBack} disabled={isUploading}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!file || !gdprConsent || isUploading}
            className="flex-1"
          >
            {isUploading ? 'Uploading...' : 'Submit Referral'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </>
  )
}