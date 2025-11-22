// ==========================================
// SUPABASE EDGE FUNCTION: SEND OTP EMAIL
// ==========================================
// VERSION: 1.0
// CREATED: 2025-08-19
// PURPOSE: Send OTP verification emails via SendGrid/AWS SES
// RUNTIME: Deno Deploy

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

interface EmailRequest {
  email: string
  otp_code: string
  language?: string
  session_id: string
}

interface EmailResponse {
  success: boolean
  message: string
  message_id?: string
}

// Email templates by language
const EMAIL_TEMPLATES = {
  de: {
    subject: "Ihr SKIIN Verifizierungscode",
    html: (otp: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #5298F2 0%, #004C96 100%); padding: 30px; text-align: center;">
          <img src="https://skiin.ch/logo-white.png" alt="SKIIN" style="height: 40px; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0;">Verifizierung Ihrer E-Mail-Adresse</h1>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #004C96; margin-bottom: 20px;">Ihr Verifizierungscode</h2>
          
          <div style="background: #f8f9fa; padding: 30px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <div style="font-size: 36px; font-weight: bold; color: #004C96; letter-spacing: 8px; font-family: monospace;">
              ${otp}
            </div>
          </div>
          
          <p style="color: #475259; line-height: 1.6; margin-bottom: 20px;">
            Verwenden Sie diesen 6-stelligen Code, um Ihre E-Mail-Adresse für Ihr SKIIN Herz-Screening zu verifizieren.
          </p>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Wichtig:</strong> Dieser Code läuft in 10 Minuten ab. Geben Sie ihn niemals an Dritte weiter.
            </p>
          </div>
          
          <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
            Falls Sie diese E-Mail nicht angefordert haben, können Sie sie ignorieren.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            <p style="color: #6c757d; font-size: 12px; margin: 0;">
              SKIIN Switzerland - Zertifiziertes Medizinprodukt für EKG-Monitoring zu Hause<br>
              Diese E-Mail wurde automatisch gesendet. Bitte antworten Sie nicht auf diese E-Mail.
            </p>
          </div>
        </div>
      </div>
    `
  },
  
  fr: {
    subject: "Votre code de vérification SKIIN",
    html: (otp: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #5298F2 0%, #004C96 100%); padding: 30px; text-align: center;">
          <img src="https://skiin.ch/logo-white.png" alt="SKIIN" style="height: 40px; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0;">Vérification de votre adresse e-mail</h1>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #004C96; margin-bottom: 20px;">Votre code de vérification</h2>
          
          <div style="background: #f8f9fa; padding: 30px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <div style="font-size: 36px; font-weight: bold; color: #004C96; letter-spacing: 8px; font-family: monospace;">
              ${otp}
            </div>
          </div>
          
          <p style="color: #475259; line-height: 1.6; margin-bottom: 20px;">
            Utilisez ce code à 6 chiffres pour vérifier votre adresse e-mail pour votre dépistage cardiaque SKIIN.
          </p>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Important:</strong> Ce code expire dans 10 minutes. Ne le partagez jamais avec des tiers.
            </p>
          </div>
          
          <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
            Si vous n'avez pas demandé cet e-mail, vous pouvez l'ignorer.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            <p style="color: #6c757d; font-size: 12px; margin: 0;">
              SKIIN Switzerland - Dispositif médical certifié pour la surveillance ECG à domicile<br>
              Cet e-mail a été envoyé automatiquement. Veuillez ne pas répondre à cet e-mail.
            </p>
          </div>
        </div>
      </div>
    `
  },
  
  it: {
    subject: "Il tuo codice di verifica SKIIN",
    html: (otp: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #5298F2 0%, #004C96 100%); padding: 30px; text-align: center;">
          <img src="https://skiin.ch/logo-white.png" alt="SKIIN" style="height: 40px; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0;">Verifica del tuo indirizzo e-mail</h1>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #004C96; margin-bottom: 20px;">Il tuo codice di verifica</h2>
          
          <div style="background: #f8f9fa; padding: 30px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <div style="font-size: 36px; font-weight: bold; color: #004C96; letter-spacing: 8px; font-family: monospace;">
              ${otp}
            </div>
          </div>
          
          <p style="color: #475259; line-height: 1.6; margin-bottom: 20px;">
            Usa questo codice a 6 cifre per verificare il tuo indirizzo e-mail per lo screening cardiaco SKIIN.
          </p>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Importante:</strong> Questo codice scade tra 10 minuti. Non condividerlo mai con terzi.
            </p>
          </div>
          
          <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
            Se non hai richiesto questa e-mail, puoi ignorarla.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            <p style="color: #6c757d; font-size: 12px; margin: 0;">
              SKIIN Switzerland - Dispositivo medico certificato per il monitoraggio ECG a casa<br>
              Questa e-mail è stata inviata automaticamente. Non rispondere a questa e-mail.
            </p>
          </div>
        </div>
      </div>
    `
  },
  
  en: {
    subject: "Your SKIIN Verification Code",
    html: (otp: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #5298F2 0%, #004C96 100%); padding: 30px; text-align: center;">
          <img src="https://skiin.ch/logo-white.png" alt="SKIIN" style="height: 40px; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0;">Verify Your Email Address</h1>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #004C96; margin-bottom: 20px;">Your Verification Code</h2>
          
          <div style="background: #f8f9fa; padding: 30px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <div style="font-size: 36px; font-weight: bold; color: #004C96; letter-spacing: 8px; font-family: monospace;">
              ${otp}
            </div>
          </div>
          
          <p style="color: #475259; line-height: 1.6; margin-bottom: 20px;">
            Use this 6-digit code to verify your email address for your SKIIN heart screening.
          </p>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Important:</strong> This code expires in 10 minutes. Never share it with others.
            </p>
          </div>
          
          <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
            If you didn't request this email, you can safely ignore it.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            <p style="color: #6c757d; font-size: 12px; margin: 0;">
              SKIIN Switzerland - Certified Medical Device for Home ECG Monitoring<br>
              This email was sent automatically. Please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Verify request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, message: 'Method not allowed' }),
        { 
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse request body
    const { email, otp_code, language = 'en', session_id }: EmailRequest = await req.json()

    // Validate required fields
    if (!email || !otp_code || !session_id) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Missing required fields: email, otp_code, session_id' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid email format' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Get template for language
    const template = EMAIL_TEMPLATES[language as keyof typeof EMAIL_TEMPLATES] || EMAIL_TEMPLATES.en

    // Email configuration (using SendGrid as example)
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'noreply@skiin.ch'
    const FROM_NAME = 'SKIIN Switzerland'

    if (!SENDGRID_API_KEY) {
      console.error('SendGrid API key not configured')
      
      // For development/testing, log the OTP instead of sending email
      if (Deno.env.get('ENVIRONMENT') === 'development') {
        console.log(`DEV MODE - OTP for ${email}: ${otp_code}`)
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'OTP logged to console (development mode)',
            message_id: `dev_${session_id}`
          }),
          { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
      
      return new Response(
        JSON.stringify({ success: false, message: 'Email service not configured' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Send email via SendGrid
    const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email, name: email.split('@')[0] }],
          subject: template.subject
        }],
        from: {
          email: FROM_EMAIL,
          name: FROM_NAME
        },
        content: [
          {
            type: 'text/html',
            value: template.html(otp_code)
          },
          {
            type: 'text/plain',
            value: `Your SKIIN verification code is: ${otp_code}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`
          }
        ],
        categories: ['otp-verification'],
        custom_args: {
          session_id,
          language,
          environment: Deno.env.get('ENVIRONMENT') || 'production'
        }
      })
    })

    if (!sendGridResponse.ok) {
      const error = await sendGridResponse.text()
      console.error('SendGrid error:', error)
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Failed to send email'
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Get SendGrid message ID from response headers
    const messageId = sendGridResponse.headers.get('X-Message-Id') || `sg_${Date.now()}`

    // Log successful email send to audit table
    await supabase
      .from('audit_logs')
      .insert({
        action: 'otp_email_sent',
        table_name: 'otp_verifications',
        record_id: session_id,
        old_values: null,
        new_values: {
          email,
          language,
          message_id: messageId,
          provider: 'sendgrid'
        },
        source: 'edge_function'
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP email sent successfully',
        message_id: messageId
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Internal server error'
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})

/* To deploy this edge function:

supabase functions deploy send-otp-email --project-ref your-project-ref

Environment variables to set:
- SENDGRID_API_KEY: Your SendGrid API key
- FROM_EMAIL: Sender email address (e.g., noreply@skiin.ch)  
- ENVIRONMENT: 'development' or 'production'

Usage from client:
const { data, error } = await supabase.functions.invoke('send-otp-email', {
  body: {
    email: 'user@example.com',
    otp_code: '123456',
    language: 'de',
    session_id: 'uuid-here'
  }
})

*/