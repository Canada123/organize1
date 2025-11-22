import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { code } = await request.json()

    // Validate code format
    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: 'Invalid referral code format' },
        { status: 400 }
      )
    }

    // Verify the code exists and is active
    const { data: referralCode, error } = await supabase
      .from('referral_codes')
      .select('*, form_sessions(form_data)')
      .eq('code', code.toUpperCase())
      .eq('status', 'active')
      .single()

    if (error || !referralCode) {
      return NextResponse.json(
        { error: 'Invalid or expired referral code' },
        { status: 404 }
      )
    }

    // Check if code has expired
    const expiresAt = new Date(referralCode.expires_at)
    if (expiresAt < new Date()) {
      // Update status to expired
      await supabase
        .from('referral_codes')
        .update({ status: 'expired' })
        .eq('id', referralCode.id)

      return NextResponse.json(
        { error: 'Referral code has expired' },
        { status: 410 }
      )
    }

    // Return patient information (sanitized)
    return NextResponse.json({
      valid: true,
      patientName: referralCode.patient_name,
      eligibilityScore: referralCode.eligibility_score,
      eligibilityPathway: referralCode.eligibility_pathway,
      expiresAt: referralCode.expires_at
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}