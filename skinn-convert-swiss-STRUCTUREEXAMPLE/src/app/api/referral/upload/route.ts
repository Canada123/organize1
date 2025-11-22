import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const formData = await request.formData()
    
    // Extract form fields
    const referralCode = formData.get('referralCode') as string
    const doctorName = formData.get('doctorName') as string
    const doctorTitle = formData.get('doctorTitle') as string | null
    const clinicName = formData.get('clinicName') as string
    const doctorHinEmail = formData.get('doctorHinEmail') as string
    const doctorPhone = formData.get('doctorPhone') as string
    const gdprConsent = formData.get('gdprConsent') === 'true'
    const file = formData.get('referralDocument') as File

    // Validate required fields
    if (!referralCode || !doctorName || !clinicName || !doctorHinEmail || !doctorPhone || !file) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate HIN email
    if (!doctorHinEmail.endsWith('.hin.ch')) {
      return NextResponse.json(
        { error: 'Invalid HIN email address' },
        { status: 400 }
      )
    }

    // Validate file size and type
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and images are allowed' },
        { status: 400 }
      )
    }

    // Convert file to FormData for edge function
    const uploadFormData = new FormData()
    uploadFormData.append('referralDocument', file)
    uploadFormData.append('doctorInfo', JSON.stringify({
      referralCode,
      doctorName,
      doctorTitle,
      clinicName,
      doctorHinEmail,
      doctorPhone,
      gdprConsent
    }))

    // Call the edge function to handle upload
    const { data, error } = await supabase.functions.invoke('upload-doctor-referral', {
      body: uploadFormData
    })

    if (error) {
      console.error('Error uploading referral:', error)
      return NextResponse.json(
        { error: 'Failed to upload referral' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}