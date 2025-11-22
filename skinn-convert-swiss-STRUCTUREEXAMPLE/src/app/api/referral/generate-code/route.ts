import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { formSessionId, patientName, patientEmail, patientPhone } = await request.json()

    // Validate required fields
    if (!formSessionId || !patientName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Call the edge function to generate referral code
    const { data, error } = await supabase.functions.invoke('generate-referral-code', {
      body: {
        formSessionId,
        userId: user.id,
        patientName,
        patientEmail,
        patientPhone
      }
    })

    if (error) {
      console.error('Error generating referral code:', error)
      return NextResponse.json(
        { error: 'Failed to generate referral code' },
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