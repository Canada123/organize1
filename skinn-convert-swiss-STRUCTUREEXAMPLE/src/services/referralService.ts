import { supabase } from '@/lib/supabase/client'

export interface ReferralCode {
  id: string
  code: string
  expiresAt: Date
  status: 'active' | 'used' | 'expired'
  patientName: string
  patientEmail?: string
}

export interface DoctorUploadData {
  referralCode: string
  doctorName: string
  doctorTitle?: string
  clinicName: string
  doctorHinEmail: string
  doctorPhone: string
  referralDocument: File
  gdprConsent: boolean
}

export class ReferralService {
  /**
   * Generate a new referral code for a patient
   */
  static async generateReferralCode(
    formSessionId: string,
    patientName: string,
    patientEmail?: string,
    patientPhone?: string
  ): Promise<ReferralCode> {
    const response = await fetch('/api/referral/generate-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formSessionId,
        patientName,
        patientEmail,
        patientPhone,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to generate referral code')
    }

    const data = await response.json()
    return {
      id: data.referral_id,
      code: data.code,
      expiresAt: new Date(data.expires_at),
      status: 'active',
      patientName,
      patientEmail,
    }
  }

  /**
   * Verify a referral code
   */
  static async verifyReferralCode(code: string): Promise<{
    valid: boolean
    patientName?: string
    eligibilityScore?: number
    expiresAt?: Date
  }> {
    const response = await fetch('/api/referral/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })

    if (!response.ok) {
      if (response.status === 404) {
        return { valid: false }
      }
      const error = await response.json()
      throw new Error(error.error || 'Failed to verify referral code')
    }

    const data = await response.json()
    return {
      valid: data.valid,
      patientName: data.patientName,
      eligibilityScore: data.eligibilityScore,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    }
  }

  /**
   * Upload doctor referral
   */
  static async uploadDoctorReferral(data: DoctorUploadData): Promise<{
    success: boolean
    referralId?: string
    message?: string
  }> {
    const formData = new FormData()
    formData.append('referralCode', data.referralCode)
    formData.append('doctorName', data.doctorName)
    if (data.doctorTitle) {
      formData.append('doctorTitle', data.doctorTitle)
    }
    formData.append('clinicName', data.clinicName)
    formData.append('doctorHinEmail', data.doctorHinEmail)
    formData.append('doctorPhone', data.doctorPhone)
    formData.append('referralDocument', data.referralDocument)
    formData.append('gdprConsent', data.gdprConsent.toString())

    const response = await fetch('/api/referral/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to upload referral')
    }

    const result = await response.json()
    return {
      success: result.success,
      referralId: result.referralId,
      message: result.message,
    }
  }

  /**
   * Download referral packet PDF
   */
  static async downloadReferralPacket(referralCode: string): Promise<Blob> {
    // Generate PDF with referral code and instructions
    const pdfContent = await this.generateReferralPDF(referralCode)
    return new Blob([pdfContent], { type: 'application/pdf' })
  }

  /**
   * Generate referral PDF content
   */
  private static async generateReferralPDF(code: string): Promise<ArrayBuffer> {
    // This would integrate with a PDF generation library like jsPDF
    // For now, return a placeholder
    const encoder = new TextEncoder()
    return encoder.encode(`
      SKIIN Switzerland GP Referral
      
      Referral Code: ${code}
      
      Instructions for your GP:
      1. Visit https://skiin.ch/referral
      2. Enter the referral code: ${code}
      3. Upload the signed referral document
      
      This code expires in 30 days.
    `).buffer
  }

  /**
   * Share referral code via SMS or email
   */
  static async shareReferralCode(
    code: string,
    method: 'sms' | 'email',
    recipient: string
  ): Promise<boolean> {
    // This would integrate with a messaging service
    // For now, use native sharing if available
    if (method === 'sms' && navigator.share) {
      try {
        await navigator.share({
          title: 'SKIIN Referral Code',
          text: `Your SKIIN referral code is: ${code}\n\nShare this with your GP to upload the referral.`,
        })
        return true
      } catch (error) {
        console.error('Share failed:', error)
        return false
      }
    }

    if (method === 'email') {
      const subject = encodeURIComponent('SKIIN Referral Code')
      const body = encodeURIComponent(
        `Your SKIIN referral code is: ${code}\n\nShare this with your GP to upload the referral at: https://skiin.ch/referral`
      )
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`
      return true
    }

    return false
  }
}