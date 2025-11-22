# GP Referral System - How It Works

## Overview
The GP referral system allows patients to share their eligibility information with their doctor through a secure 6-character code system. The doctor can then upload the signed referral document using this code.

## System Architecture

### Patient Flow (After Stage 3A Completion)

1. **Code Generation**
   - System generates a unique 6-character alphanumeric code
   - Code is valid for 30 days from creation
   - Code is linked to the patient's form session

2. **Code Display**
   - Patient sees the code in large, readable format
   - QR code is generated for easy scanning
   - Download button for referral packet PDF
   - Share options (SMS/Email to doctor)

3. **Referral Packet Contents**
   - Cover letter with patient information
   - Instructions for the doctor
   - The 6-character referral code prominently displayed
   - QR code linking to upload portal
   - Blank referral form to sign

### Doctor Flow (Separate Portal)

1. **Access the Portal**
   - **URL:** `http://localhost:8080/referral`
   - No authentication required (code acts as authentication)
   - Mobile-responsive design for clinic use

2. **Upload Process**
   - **Step 1:** Enter the 6-character code
   - **Step 2:** Provide doctor details (name, clinic, HIN email, phone)
   - **Step 3:** Upload signed referral document (PDF/image)
   - **Step 4:** Confirmation screen

3. **Validation & Storage**
   - Code is validated (exists, not expired, not used)
   - Document stored securely in Supabase
   - Code marked as used (single-use only)
   - Confirmation emails sent to doctor and patient

## Current Implementation Status

### ✅ What's Working

1. **Service Layer** (`/src/services/referralService.ts`)
   ```typescript
   - generateReferralCode(sessionId, patientEmail)
   - verifyReferralCode(code)
   - uploadDoctorReferral(code, doctorDetails, file)
   - shareReferralCode(code, method, recipient)
   ```

2. **UI Components**
   - `ReferralCodeDisplay.tsx` - Shows code with QR
   - `DoctorUploadPortal.tsx` - 4-step upload wizard
   - `DoctorReferralUpload.tsx` - Page wrapper with route

3. **Route Configuration**
   - `/referral` route added to React Router
   - Accessible without authentication

### ❌ What's Not Connected

1. **Code Generation Trigger**
   - Service exists but not called after Stage 3A
   - Need to integrate in `InsuredReviewStage.tsx`

2. **Code Display**
   - Component exists but not shown in `CompletionStage.tsx`
   - Need to pass generated code to completion stage

3. **Database Integration**
   - Tables exist (`referral_codes`, `referrals`, `documents`)
   - Service layer uses mock data currently
   - Need to connect to actual Supabase

4. **Email Notifications**
   - Templates not created
   - Supabase Edge Functions not configured
   - RESEND_API_KEY not set

## How to Test the Current Implementation

### 1. Test the Doctor Portal UI
```bash
# Start the dev server (already running)
npm run dev

# Navigate to
http://localhost:8080/referral

# The portal shows:
- Step 1: Code entry field (try "ABC123")
- Step 2: Doctor details form
- Step 3: File upload area
- Step 4: Confirmation message
```

### 2. Test Code Generation (via Browser Console)
```javascript
// Open browser console at http://localhost:8080/eligibility
// Import and test the service

// Note: This will use mock data since DB not connected
const testCode = await window.referralService?.generateReferralCode?.(
  'test-session-id',
  'patient@example.com'
);
console.log('Generated code:', testCode);
```

### 3. Test the Upload Flow
- Navigate to http://localhost:8080/referral
- Enter any 6-character code (e.g., "TEST01")
- Fill in doctor details:
  - Name: Dr. Test
  - Clinic: Test Clinic
  - HIN Email: doctor@hin.ch
  - Phone: +41 79 123 4567
- Upload any PDF file
- See confirmation screen

## File Structure
```
/src
├── pages/
│   └── DoctorReferralUpload.tsx         # React Router page wrapper
├── components/forms/eligibility/
│   ├── ReferralCodeDisplay.tsx          # Patient code display
│   ├── DoctorUploadPortal.tsx          # Doctor upload wizard
│   ├── atoms/                          # Atomic components
│   │   ├── ReferralCodeQR.tsx          # QR code generator
│   │   ├── ReferralCodeText.tsx        # Code display
│   │   ├── ExpiryNotice.tsx            # Expiry countdown
│   │   └── ReferralCodeActions.tsx     # Action buttons
│   └── doctor-upload/                  # Upload steps
│       ├── CodeEntryStep.tsx           # Step 1
│       ├── DoctorDetailsStep.tsx       # Step 2
│       ├── DocumentUploadStep.tsx      # Step 3
│       └── ConfirmationStep.tsx        # Step 4
├── services/
│   └── referralService.ts              # Service layer (mock data)
└── routes/
    └── index.tsx                       # Route definition

/supabase/schemas/
├── eligibility_questionnaire.sql       # Contains referral tables
└── (referral_codes, referrals tables defined here)
```

## Integration Points Needed

### To Complete the Integration:

1. **In EligibilityFormContainer.tsx** (Line ~150)
   ```typescript
   // After Stage 3A completion
   if (currentStep === 3 && formData.pathway === 'insured') {
     const code = await referralService.generateReferralCode(
       sessionId,
       formData.email
     );
     setFormData(prev => ({ ...prev, referralCode: code }));
   }
   ```

2. **In CompletionStage.tsx** (Add component)
   ```typescript
   import { ReferralCodeDisplay } from '../ReferralCodeDisplay';
   
   // In the render
   {formData.referralCode && (
     <ReferralCodeDisplay
       code={formData.referralCode}
       patientEmail={formData.email}
       onDownload={handleDownloadPacket}
       onShare={handleShareCode}
     />
   )}
   ```

3. **In referralService.ts** (Replace mock with Supabase)
   ```typescript
   // Connect to actual database instead of mock
   const { data, error } = await supabase
     .rpc('generate_referral_code', {
       p_session_id: sessionId,
       p_patient_email: patientEmail
     });
   ```

## Required Configuration

### Environment Variables Needed
```bash
# Add to .env.local
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
RESEND_API_KEY=your-resend-key          # For email notifications
TWILIO_ACCOUNT_SID=your-sid            # Optional: SMS sharing
TWILIO_AUTH_TOKEN=your-token           # Optional: SMS sharing
```

### Database Setup
```sql
-- Tables already exist in /supabase/schemas/eligibility_questionnaire.sql
-- Need to run migration to create them:
supabase db push
```

## Security Considerations

1. **Code Security**
   - 6 alphanumeric characters = 2.2 billion combinations
   - 30-day expiry limits attack window
   - Single-use prevents replay attacks
   - Rate limiting planned (not implemented)

2. **Data Protection**
   - Files will be stored in Supabase storage (not implemented)
   - 7-year retention requirement (schema ready)
   - Audit logging planned (tables exist)
   - GDPR compliance (consent fields in schema)

3. **Access Control**
   - No authentication by design (code is the secret)
   - Doctor HIN email validation planned
   - Patient notification on upload planned

## Known Issues & Gaps

### Critical Gaps (P0)
1. **Not triggered after Stage 3A** - Code generation never happens
2. **Not shown to patient** - ReferralCodeDisplay not rendered
3. **Database not connected** - Using mock data only
4. **No file storage** - Uploads don't persist

### Important Gaps (P1)
1. **No email notifications** - Confirmation emails don't send
2. **No PDF generation** - Referral packet not created
3. **No expiry enforcement** - 30-day limit not checked
4. **No single-use enforcement** - Codes can be reused

### Nice to Have (P2)
1. **No SMS sharing** - Only email/download available
2. **No progress tracking** - Patient can't see upload status
3. **No reminder system** - No follow-up if not uploaded
4. **No admin dashboard** - Can't monitor system

## Troubleshooting Guide

### "The page doesn't load"
- Check if dev server is running: `npm run dev`
- Navigate to: http://localhost:8080/referral
- Check browser console for errors

### "Code entry doesn't work"
- Any 6-character code works currently (mock mode)
- Real validation requires database connection
- Check referralService.ts for mock implementation

### "File upload fails"
- Currently accepts any file (no real upload)
- 10MB limit will be enforced when connected
- Check console for mock success message

### "Where is the referral code shown?"
- Currently NOT shown anywhere to patients
- Component exists but not integrated
- Need to add to CompletionStage.tsx

## Summary

The GP referral system has all UI components built and a complete service layer, but lacks:

1. **Integration** - Components not connected in the flow
2. **Database** - Schema exists but not used
3. **Notifications** - Email system not configured
4. **Storage** - Files not actually saved

To make it fully functional, we need to:
1. Trigger code generation after Stage 3A
2. Display the code in completion stage
3. Connect to Supabase database
4. Configure email notifications
5. Implement file storage

**Estimated effort:** 2-3 days to complete all integrations and testing.