'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, ArrowLeft } from 'lucide-react'

const schema = z.object({
  doctorName: z.string().min(2, 'Name is required'),
  doctorTitle: z.string().optional(),
  clinicName: z.string().min(2, 'Clinic name is required'),
  doctorHinEmail: z.string()
    .email('Invalid email')
    .refine(email => email.endsWith('.hin.ch'), 'Must be a valid HIN email'),
  doctorPhone: z.string().min(10, 'Valid phone number required')
})

interface DoctorDetailsStepProps {
  formData: Record<string, unknown>
  onNext: (data: any) => void
  onBack: () => void
}

export function DoctorDetailsStep({ formData, onNext, onBack }: DoctorDetailsStepProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: formData
  })

  const onSubmit = (data: any) => {
    onNext(data)
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Doctor Information</CardTitle>
        <CardDescription>
          Please provide your professional details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="doctorName">Full Name *</Label>
              <Input
                id="doctorName"
                {...register('doctorName')}
                placeholder="Dr. John Smith"
              />
              {errors.doctorName && (
                <p className="text-sm text-red-500 mt-1">{errors.doctorName.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="doctorTitle">Title</Label>
              <Input
                id="doctorTitle"
                {...register('doctorTitle')}
                placeholder="MD, PhD"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="clinicName">Clinic/Practice Name *</Label>
            <Input
              id="clinicName"
              {...register('clinicName')}
              placeholder="Zentrum Medizin Zurich"
            />
            {errors.clinicName && (
              <p className="text-sm text-red-500 mt-1">{errors.clinicName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="doctorHinEmail">HIN Email Address *</Label>
            <Input
              id="doctorHinEmail"
              type="email"
              {...register('doctorHinEmail')}
              placeholder="doctor@practice.hin.ch"
            />
            {errors.doctorHinEmail && (
              <p className="text-sm text-red-500 mt-1">{errors.doctorHinEmail.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="doctorPhone">Phone Number *</Label>
            <Input
              id="doctorPhone"
              type="tel"
              {...register('doctorPhone')}
              placeholder="+41 44 123 45 67"
            />
            {errors.doctorPhone && (
              <p className="text-sm text-red-500 mt-1">{errors.doctorPhone.message}</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button type="submit" className="flex-1">
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </>
  )
}