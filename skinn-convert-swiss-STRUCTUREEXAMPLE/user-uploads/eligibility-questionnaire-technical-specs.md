# **Technical Specification: Swiss Holter Monitoring Eligibility Questionnaire**

## **Purpose and Scope**

This document describes the technical design of the Swiss Holter monitoring eligibility system. It defines a multi‑step wizard that determines user eligibility for Holter monitoring, collects necessary medical details, processes payment when needed and produces a referral package for a general practitioner. After the wizard, doctors or assistants can upload the signed referral using a short code provided to the patient. The implementation uses Next.js (App Router) and React 18 for the frontend, shadcn/ui components for UI, Supabase for authentication and data storage, and Stripe for payment processing. All data operations are constrained by GDPR and Swiss DPA requirements; row‑level security (RLS) ensures users can only access their own records. Additional tables store referral codes and doctor uploads with seven‑year retention, and edge functions send notifications to clinicians and patients.

## **Form Steps and Field Definitions**

### **Step 0 – Contact & Account**

| Field | Data type | UI component | Required? | Validation & notes |
| :---- | :---- | :---- | :---- | :---- |
| email | string (RFC 5322 format) | Input \+ OTP | yes | Send OTP; user must enter correct code before proceeding. Rate limited via /api/auth/request-otp. |
| dateOfBirth | date | Input (date picker) | yes | Must represent ≥18 years old. Age check is enforced in the database schema via a CHECK constraint. |
| saveAndContinue | boolean (internal) | link/button | n/a | After successful verification, a save‑and‑resume link is generated and emailed. |

### **Step 1 – Eligibility Gate**

| Field | Data type | UI component | Required? | Notes |
| :---- | :---- | :---- | :---- | :---- |
| hasInsurance | boolean | RadioGroup | yes | Options: Yes/No; if No, set insuranceModel to SelfPay. |
| insuranceModel | enum Standard, HMO, Telmed, SelfPay | Select | conditional | Displayed only when hasInsurance \= true. |
| contraindications.pregnant | boolean | RadioGroup | yes | If any contraindication is true, halt flow and show emergency advice. |
| contraindications.pacemakerOrICD | boolean | RadioGroup | yes | Same behaviour as above. |
| contraindications.recentHospitalisation | boolean | RadioGroup | yes | Same behaviour as above. |
| symptoms | string\[\] | Checkbox list within Card | at least one or “none” | Options: palpitations, dizziness, fainting, chest pain, shortness of breath, other. Selecting **fainting** or **chest pain** triggers a modal asking follow‑up questions and may display emergency advice. Selecting “none of the above” disables other options. |
| symptoms.otherDescription | string | Textarea | conditional | Shown when “Other” checkbox is selected. |
| familyHistory | boolean | Switch or RadioGroup | optional | Asks whether a close relative had sudden cardiac death or arrhythmia; does not affect eligibility. |

### **Stage 2 – Detailed Information**

This stage appears when the user has insurance with symptoms or when they opt for self‑pay.

| Field | Data type | UI component | Required? | Notes |
| :---- | :---- | :---- | :---- | :---- |
| symptomOnset | date | Input (date) | optional | Shown if the user selected at least one symptom. |
| symptomFrequency | enum Daily, Weekly, Monthly, Sporadic | Select | optional | — |
| symptomSeverity | integer (1–10) | Slider | optional | Slider labelled 1 (minimal) to 10 (unbearable). |
| hasArrhythmiaOrProcedure | boolean | RadioGroup | optional | If true, display a Textarea for description and date of diagnosis or procedure. |
| medications | string | Textarea | optional | Encourages listing medication names and doses. |
| attachments | file\[\] | FileUpload | optional | Accepts PDFs, JPG or PNG up to 10 MB each. |

### **Stage 3A – Review & Consents (Insured)**

| Field | Data type | UI component | Required? | Notes |
| :---- | :---- | :---- | :---- | :---- |
| confirmedInsuranceModel | enum | Select/text | yes | Reconfirm model; determines branch-specific logic. |
| gpChoice | enum own, partner | RadioGroup | conditional | Only for Standard/Flex users; choose own GP or partner (Medgate). |
| gp.name | string | Input | conditional | Own GP only: collects GP name. |
| gp.practice | string | Input | conditional | Practice name. |
| gp.hinEmail | string | Input | conditional | HIN‑compliant email. |
| gp.phone | string | Input | conditional | GP phone number. |
| telmedHotlineAcknowledged | boolean | Checkbox | Telmed only | Users must read and acknowledge hotline instructions. |
| consents.truthfulness | boolean | Checkbox | yes | “I confirm that the information provided is accurate and complete”. |
| consents.emergency | boolean | Checkbox | yes | Acknowledges that Holter monitoring does not replace emergency care. |
| consents.telemedicine | boolean | Checkbox | yes | Agreement to telemedicine services and privacy policy. |

Upon submission, system actions depend on the model:

* **Standard/Flex (own GP):** Generate a referral packet (PDF) and instruct the user to deliver it to their GP. The Holter kit is shipped once a signed referral is received.

* **Standard/Flex (partner GP):** Redirect to the Medgate booking portal; the teleconsultation generates the referral.

* **HMO/Hausarzt:** Same as own GP; partner GPs are not allowed.

* **Telmed:** Provide a hotline number; the Telmed clinician triages and issues a referral.

### **Stage 3B – Payment & Consents (Self‑Pay)**

| Field | Data type | UI component | Required? | Notes |
| :---- | :---- | :---- | :---- | :---- |
| phone | string | Input \+ OTP | yes | First time the phone is collected; used for SMS notifications. Rate limited similar to email OTP. |
| address.street | string | Input | yes | User’s shipping street. |
| address.postalCode | string | Input | yes | Swiss postal code. |
| address.city | string | Input | yes | City/town. |
| payment | object | PaymentForm | yes | Uses Stripe Payment Intents to collect CHF 350 payment. |
| consents.truthfulness | boolean | Checkbox | yes | Same as insured path. |
| consents.emergency | boolean | Checkbox | yes | Same as insured path. |
| consents.telemedicine | boolean | Checkbox | yes | Same as insured path. |

After successful payment, the user sees a confirmation and shipping instructions.

### **Stage 4 – Doctor Referral Upload**

This stage occurs outside of the patient wizard but is critical for insured users: once Stage 3A is complete and a referral package has been generated, the system creates a six‑character referral code. The patient delivers this code (or the accompanying QR code) to their doctor. On the dedicated referral upload page, the doctor or medical assistant enters the code and completes a short form:

| Field | Data type | UI component | Required? | Validation & notes |
| :---- | :---- | :---- | :---- | :---- |
| referralCode | string | Input | yes | Six‑character code provided in the package; validated server‑side against referral\_codes. |
| doctorName | string | Input | yes | Full name of the doctor signing the referral. |
| doctorClinic | string | Input | optional | Practice or clinic name. |
| doctorHinEmail | string | Input | yes | HIN‑compliant email; used for confirmation notifications. |
| doctorPhone | string | Input | optional | Contact phone number for the doctor. |
| referralDocument | file | FileUpload | yes | PDF or scanned image of the signed referral; size limit (e.g. 10 MB). Stored in the documents table. |

Upon submission, the backend verifies the code (unexpired and unused), stores the uploaded file in Supabase Storage, creates a record in referrals, marks the code as used in referral\_codes, sends confirmation emails to the doctor and patient via Supabase Edge Functions using Resend, and logs an audit\_events entry.

### **Completion Screen**

The final screen summarises next steps for all users and includes support contact details. Use Card components with icons and descriptive text.

## **Conditional Logic Mapping**

The eligibility logic is a pure function that evaluates insurance status, symptoms and contraindications. Once a user reaches Stage 3A with insurance, the system generates a referral code and instructs the user to share it with their doctor. The core eligibility function remains unchanged and is shown below:

function determineEligibility(hasInsurance: boolean, hasSymptoms: boolean, hasContra: boolean): 'ineligible' | 'insured' | 'selfPay' | 'screeningNotCovered' {  
  if (hasContra) return 'ineligible';  
  if (hasInsurance && hasSymptoms) return 'insured';  
  if (hasInsurance && \!hasSymptoms) return 'screeningNotCovered';  
  return 'selfPay';  
}

This logic is mirrored in the database function check\_eligibility() and on the client. Additional rules apply: answering Yes to any contraindication halts the flow; selecting no symptoms while insured prompts a modal asking whether the user wishes to self‑pay; selecting fainting or chest pain triggers emergency dialogs; and the insurance model selected determines which branch of Stage 3 is presented.

## **Backend and API Interactions**

The frontend communicates with Supabase and Stripe via REST endpoints:

1. **Authentication (Step 0):**

2. POST /api/auth/request-otp sends an email OTP and returns rate‑limit info.

3. POST /api/auth/verify-otp verifies the OTP, creates or updates user\_profiles (recording date of birth and consent) and returns a JWT.

4. **Form Sessions:**

5. POST /api/forms/session creates a new form\_sessions record, returning a session ID and token.

6. PUT /api/forms/session/{sessionId} updates the current step and merges JSONB data into form\_sessions.form\_data.

7. GET /api/forms/session/{sessionId}?token=… retrieves session state for resuming.

8. **Eligibility Assessment:**

9. POST /api/eligibility/assess calls the check\_eligibility() function, stores the result in form\_sessions.eligibility\_result and returns a recommendation and next steps.

10. GET /api/eligibility/status/{sessionId} fetches the stored result.

11. **Payments:**

12. POST /api/payments/create-intent generates a Stripe Payment Intent for CHF 350 (default price) and returns a client secret and invoice number. The payments table stores the intent ID, user ID, amount, currency and status.

13. POST /api/payments/webhook processes Stripe webhooks, updates payments.status and triggers form completion when payment succeeds.

14. GET /api/payments/status/{paymentId} returns current payment status and metadata.

15. **Form Submission:**

16. POST /api/forms/submit finalises the form, writes a record to form\_sessions.submitted\_at and generates referral or invoice documents.

17. **Document Management:**

18. POST /api/documents/generate creates referral packets or invoices and stores metadata in the documents table.

19. GET /api/documents/{documentId} retrieves document metadata and signed download URLs.

20. **GDPR Compliance:**

21. GET /api/gdpr/export exports all user data across profiles, sessions, payments and documents.

22. POST /api/gdpr/delete-request schedules data deletion and records the request in audit\_events.

API endpoints implement rate limiting (e.g., three OTP requests per 15 minutes) and return standard error formats.

## **Data Models and Database Schema**

### **user\_profiles**

Extends Supabase auth.users with phone, date of birth and GDPR fields. A CHECK constraint ensures users are at least 18 years old. Rate‑limit counters (otp\_requests\_count, otp\_requests\_reset\_at) prevent abuse.

### **form\_sessions**

Stores form progress and results in a single table. Key columns include id (UUID), user\_id (FK to auth.users), form\_data (JSONB), current\_step, status ('active', 'completed', 'expired', 'abandoned'), eligibility\_result (JSONB), session\_token, expiration timestamps and completion metrics. JSONB allows flexible storage of all step data. Sessions expire after seven days and are purged via a maintenance function.

### **payments**

Stores payment intent and invoice details. Columns include user\_id, form\_session\_id, stripe\_payment\_intent\_id, idempotency\_key, amount\_cents (default 35000 CHF), currency (CHF), status (pending, processing, succeeded, failed, cancelled), billing\_address (JSONB), vat\_included, invoice\_number, and timestamps. Idempotency keys ensure safe retries.

### **documents**

Tracks uploaded files and generated documents. Each record has filename, file\_path (Supabase storage path), file\_size\_bytes, mime\_type, document\_type (referral, invoice, report, upload), optional template\_used and generation\_parameters, and access control fields. Documents can be public or private and include expiration times.

### **audit\_events**

Provides an immutable audit trail for compliance. Columns capture event\_type, entity\_type, entity\_id, event\_data, previous and new values, IP address, user agent and timestamps. Audit logs record all OTP requests, form actions, payments and document generation.

### **referral\_codes**

Stores short codes that link a patient’s form session to a doctor referral. Columns include id (UUID, primary key), form\_session\_id (FK to form\_sessions), code (unique string), expires\_at (timestamp when the code becomes invalid), used (boolean default false), created\_at and used\_at. An index on code enables fast lookups, and a CHECK constraint ensures expires\_at is in the future when created. Codes are single‑use: once a referral is uploaded, the record is marked as used.

### **referrals**

Captures referral uploads and doctor metadata. Key columns are id (UUID, primary key), form\_session\_id (FK to form\_sessions), document\_id (FK to documents containing the uploaded file), doctor\_name, doctor\_clinic, doctor\_hin\_email, doctor\_phone, status (default uploaded, values uploaded, pending\_review, approved, rejected), uploaded\_at (timestamp), patient\_notified\_at and doctor\_notified\_at. These fields enable auditing, status tracking and notifications. A seven‑year retention policy applies to these records and their documents.

### **Helper Functions**

The database defines several helper functions:

| Function | Purpose |
| :---- | :---- |
| check\_eligibility(form\_data\_input JSONB) | Evaluates insurance status, symptoms and contraindications to determine eligibility; returns a JSONB object with eligible, pathway and reason. |
| save\_form\_progress(session\_id UUID, step INT, data JSONB) | Merges new step data into form\_sessions.form\_data, updates current\_step and logs an audit event. |
| complete\_form\_submission(session\_id UUID) | Marks the session as completed, generates documents and consents, and logs events. |
| link\_phone\_to\_account(user\_id UUID, phone TEXT) | Links a validated phone number to the user profile, used for self‑pay users. |
| export\_user\_data(user\_id UUID) | Returns all data belonging to a user across tables for GDPR requests. |
| cleanup\_expired\_sessions() e | Purges sessions where expires\_at is arlier than the current timestamp. |
| generate\_referral\_code(form\_session\_id UUID) i e | Creates a unique six‑character referral code, nserts it into referral\_codes with an xpiry timestamp and returns the code. |
| store\_referral\_upload(form\_session\_id UUID, doctor JSONB, document\_id UUID) \` a | Validates the referral code, inserts a row into referrals\`, marks the code as used and logs an udit event. |
| send\_referral\_notifications(referral\_id UUID) s p | Edge function triggered after a referral upload; ends confirmation emails to the doctor and atient and updates notification timestamps. |

### **Row‑Level Security (RLS)**

RLS policies ensure users can only access their own data. For each table, policies are defined as follows:

| Table | Policy (simplified) | Source |
| :---- | :---- | :---- |
| user\_profiles | FOR ALL USING (auth.uid() \= id) | Users can read and update their profile. |
| form\_sessions | FOR ALL USING (auth.uid() \= user\_id) | Users manage their own sessions. |
| payments | FOR SELECT USING (auth.uid() \= user\_id) | Users view their own payments. |
| documents | FOR ALL USING (auth.uid() \= user\_id) | Users access their own documents. |
| audit\_events | FOR SELECT USING (auth.uid() \= user\_id) | Users read their audit events. |
| referral\_codes | \`FOR ALL USING (auth.uid() \= (select user\_id Doc loo ent | from form\_sessions where id \= form\_session\_id))\` tors do not access referral codes directly; kup is performed server‑side when a code is ered. |
| referrals | \`FOR ALL USING (auth.uid() \= (select user\_id Pat ses rou | from form\_sessions where id \= form\_session\_id))\` ients can view referrals linked to their sions; doctors access via a public upload te with code validation. |

## **Supabase Best Practices**

### **Declarative Schema Management**

All database entities (tables, views, functions) must be defined in .sql files under supabase/schemas/; migrations are generated by diffing these files against the current database state. Never edit migration files manually; instead update the schema files and run supabase db diff. Name files lexicographically to control execution order and append new columns to the end of definitions.

### **Row Level Security & Functions**

When writing RLS policies, use auth.uid() rather than current\_user, define separate policies for select, insert, update and delete, and wrap SQL code in markdown fences. Policies should be permissive by default, with detailed descriptive names. Helper functions like auth.uid() and auth.jwt() can be used to implement team‑based access controls. Always add indexes on columns used in RLS predicates to maintain performance.

### **Edge Functions**

Supabase Edge Functions must be written in Deno/TypeScript. Use web APIs and Deno built‑ins instead of Node packages; if external dependencies are required, import them via npm: or jsr: with explicit versions. Place shared utilities in supabase/functions/\_shared and avoid cross‑function dependencies. Use Deno.serve instead of the old std/http/server.ts and rely on built‑in environment variables (SUPABASE\_URL, SUPABASE\_ANON\_KEY, etc.). Long‑running tasks should be scheduled with EdgeRuntime.waitUntil().

### **Next.js Authentication**

When integrating Supabase Auth in Next.js, create separate browser and server clients using the @supabase/ssr package. Use cookie helpers getAll and setAll rather than deprecated get, set or remove functions. Never import from @supabase/auth-helpers-nextjs; instead, call createBrowserClient and createServerClient as shown in the official pattern. Middleware should refresh tokens and return the same cookie store to avoid session desynchronisation.

## **Test Scenarios**

The following test cases verify conditional branches:

| Scenario | Expected behaviour |
| :---- | :---- |
| Pregnant user (any insurance or symptoms) | contraindications.pregnant \= true triggers ineligibility; the form stops and displays emergency advice. |
| Insured user with a symptom | hasInsurance \= true and at least one symptom leads to eligible\_insured; Stage 2 and insured Stage 3 are displayed. |
| Insured user with no symptoms | User sees a neutral message; can choose self‑pay (proceeds) or exit. |
| Uninsured user | The form sets insuranceModel \= 'SelfPay' and directs the user to Stage 2 and self‑pay Stage 3. |
| Self‑pay user completes payment | Phone OTP verification succeeds; payment intent created; on successful webhook, form marked completed and invoice document generated. |
| Doctor uploads referral | Doctor enters a valid referral code on the upload page, provides their practice details and uploads the signed referral document. The system verifies the code is unused, stores the file, creates a referrals record, marks the code as used and triggers email notifications to the doctor and patient. |

These scenarios should be covered in unit and integration tests to ensure accurate branching and state transitions.
