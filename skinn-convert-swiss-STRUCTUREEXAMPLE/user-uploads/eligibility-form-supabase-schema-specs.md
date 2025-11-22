# Supabase Schema Specifications

**Overview**

The eligibility and referral workflow for the Swiss Holter‑monitoring platform consists of the following high‑level steps:

1. **Contact & Account (Step 0)** – The user provides basic contact details (email and date of birth) and consents to terms and privacy policy. An OTP is sent to verify the email. Only adults (≥18 years) can proceed.
2. **Eligibility Gate (Step 1)** – The user indicates whether they have Swiss health insurance and selects their insurance model. They answer contraindication questions (pregnancy/breastfeeding, pacemaker/ICD, recent heart attack) and choose any relevant symptoms from a list. Branching logic determines if the user is eligible and whether they proceed via an insured or self‑pay pathway.
3. **Detailed History (Step 2)** – Users provide optional medical history: symptom onset and frequency, severity ratings, prior arrhythmias/procedures, current medications and can upload relevant documents.
4. **Insured Path (Step 3A)** – Insured users reconfirm their insurance model, supply GP details, accept consents (data sharing, telemedicine) and complete the form. A referral package is generated for their GP.
5. **Self‑Pay Path (Step 3B)** – Self‑pay users verify their phone number via OTP, enter their shipping address, agree to the price (CHF 350), complete payment via Stripe and accept consents.
6. **Referral Package and Doctor Upload** – A unique six‑digit referral code is issued in the referral package. The doctor (or assistant) navigates to a dedicated upload page, enters the code, fills in their details and uploads the referral document. The system stores the referral file, links it to the patient’s session, and sends confirmation emails to both doctor and patient. The document is retained for seven years.

---

### Tables

The system uses the following tables; each entry shows columns, data types, constraints and purposes.

#### `user_profiles` – extends `auth.users`

| Column                      | Type        | Constraints                                                            | Purpose                                                      |
| --------------------------- | ----------- | ---------------------------------------------------------------------- | ------------------------------------------------------------ |
| `id`                        | UUID        | **PK**, FK → `auth.users(id)`, `ON DELETE CASCADE`                     | Links each profile to a Supabase auth user.                  |
| `phone`                     | TEXT        | —                                                                      | Optional phone number used for OTP when payment is required. |
| `date_of_birth`             | DATE        | NOT NULL, `CHECK (date_of_birth ≤ current_date - interval '18 years')` | Ensures patient is ≥18 years old.                            |
| `consent_given`             | BOOLEAN     | DEFAULT `false`                                                        | Tracks whether the user has granted GDPR consent.            |
| `consent_given_at`          | TIMESTAMPTZ | —                                                                      | Timestamp of when consent was granted.                       |
| `data_retention_until`      | TIMESTAMPTZ | DEFAULT `now() + interval '7 years'`                                   | Sets retention period for health data.                       |
| `deletion_requested_at`     | TIMESTAMPTZ | —                                                                      | Timestamp if the user requests deletion.                     |
| `otp_requests_count`        | INTEGER     | DEFAULT 0, `CHECK (otp_requests_count ≤ 3)`                            | Rate‑limits OTP requests.                                    |
| `otp_requests_reset_at`     | TIMESTAMPTZ | DEFAULT `now()`                                                        | When OTP count resets.                                       |
| `created_at` / `updated_at` | TIMESTAMPTZ | DEFAULT `now()`                                                        | Timestamps for record creation and updates.                  |

Indexes on `phone` and `date_of_birth` facilitate lookups; row‑level security ensures users access only their own profile.

#### `form_sessions` – unified form state

| Column                      | Type        | Constraints                                                                     | Purpose                                                          |
| --------------------------- | ----------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `id`                        | UUID        | **PK**, DEFAULT `gen_random_uuid()`                                             | Unique identifier for each form session.                         |
| `user_id`                   | UUID        | FK → `auth.users(id)`, `ON DELETE CASCADE`                                      | Associates a session with a user (nullable for anonymous start). |
| `form_data`                 | JSONB       | DEFAULT `'{}'`                                                                  | Stores multi‑step form answers (see JSONB structure below).      |
| `current_step`              | INTEGER     | DEFAULT 0                                                                       | Tracks which step of the form is active.                         |
| `status`                    | TEXT        | DEFAULT `'active'`; allowed values `'active','completed','expired','abandoned'` | Indicates session state.                                         |
| `eligibility_result`        | JSONB       | —                                                                               | Holds computed eligibility `{eligible, pathway, reason}`.        |
| `session_token`             | TEXT        | UNIQUE                                                                          | Token sent to users to resume the form.                          |
| `expires_at`                | TIMESTAMPTZ | DEFAULT `now() + interval '7 days'`                                             | Session expiry time.                                             |
| `last_activity_at`          | TIMESTAMPTZ | DEFAULT `now()`                                                                 | Last interaction timestamp.                                      |
| `submitted_at`              | TIMESTAMPTZ | —                                                                               | When the form was finally submitted.                             |
| `completion_time_seconds`   | INTEGER     | —                                                                               | Duration to complete the form.                                   |
| `created_at` / `updated_at` | TIMESTAMPTZ | DEFAULT `now()`                                                                 | Audit timestamps.                                                |

Indexes on `user_id`, `status`, `expires_at` and `session_token` speed up lookups; RLS restricts access to the owner’s sessions.

#### `payments` – Stripe integration

| Column                      | Type        | Constraints                                                                        | Purpose                                  |
| --------------------------- | ----------- | ---------------------------------------------------------------------------------- | ---------------------------------------- |
| `id`                        | UUID        | **PK**, DEFAULT `gen_random_uuid()`                                                | Payment record identifier.               |
| `user_id`                   | UUID        | FK → `auth.users(id)`, `ON DELETE CASCADE`                                         | User making the payment.                 |
| `form_session_id`           | UUID        | FK → `form_sessions(id)`, `ON DELETE CASCADE`                                      | The form session that required payment.  |
| `stripe_payment_intent_id`  | TEXT        | UNIQUE, NOT NULL                                                                   | Links to Stripe payment intent.          |
| `stripe_session_id`         | TEXT        | —                                                                                  | Optional Stripe session reference.       |
| `idempotency_key`           | TEXT        | UNIQUE, NOT NULL                                                                   | Prevents duplicate charging.             |
| `amount_cents`              | INTEGER     | NOT NULL, DEFAULT 35000                                                            | Stores CHF 350 as an integer (centimes). |
| `currency`                  | TEXT        | NOT NULL, DEFAULT `'CHF'`                                                          | Currency code.                           |
| `status`                    | TEXT        | NOT NULL, allowed values `'pending','processing','succeeded','failed','cancelled'` | Payment status tracking.                 |
| `billing_address`           | JSONB       | —                                                                                  | Stores Swiss billing address details.    |
| `vat_included`              | BOOLEAN     | DEFAULT `true`                                                                     | Whether VAT is included.                 |
| `invoice_number`            | TEXT        | UNIQUE                                                                             | Generated invoice identifier.            |
| `payment_method`            | TEXT        | —                                                                                  | e.g., `'card'` or `'bank_transfer'`.     |
| `processed_at`              | TIMESTAMPTZ | —                                                                                  | When the payment was finalised.          |
| `failure_reason`            | TEXT        | —                                                                                  | Explanation if payment fails.            |
| `created_at` / `updated_at` | TIMESTAMPTZ | DEFAULT `now()`                                                                    | Timestamps for auditing.                 |

#### `documents` – uploads and generated files

| Column                      | Type        | Constraints                                                | Purpose                                              |
| --------------------------- | ----------- | ---------------------------------------------------------- | ---------------------------------------------------- |
| `id`                        | UUID        | **PK**, DEFAULT `gen_random_uuid()`                        | Document identifier.                                 |
| `user_id`                   | UUID        | FK → `auth.users(id)`, `ON DELETE CASCADE`                 | Owner of the document.                               |
| `form_session_id`           | UUID        | FK → `form_sessions(id)`, `ON DELETE CASCADE`              | Related form session (optional for general uploads). |
| `filename`                  | TEXT        | NOT NULL                                                   | Original file name.                                  |
| `file_path`                 | TEXT        | NOT NULL                                                   | Path to Supabase storage location.                   |
| `file_size_bytes`           | INTEGER     | —                                                          | Size of the file in bytes.                           |
| `mime_type`                 | TEXT        | NOT NULL                                                   | MIME type (e.g., `application/pdf`).                 |
| `document_type`             | TEXT        | NOT NULL; allowed `'referral','invoice','report','upload'` | Categorises the document.                            |
| `template_used`             | TEXT        | —                                                          | Template name for generated documents.               |
| `generation_parameters`     | JSONB       | —                                                          | Stores parameters used to generate the document.     |
| `is_public`                 | BOOLEAN     | DEFAULT `false`                                            | Whether the file is publicly accessible.             |
| `access_expires_at`         | TIMESTAMPTZ | —                                                          | When public access ends.                             |
| `created_at` / `updated_at` | TIMESTAMPTZ | DEFAULT `now()`                                            | Metadata timestamps.                                 |

#### `audit_events` – immutable activity log

| Column                      | Type        | Constraints                                 | Purpose                                                            |
| --------------------------- | ----------- | ------------------------------------------- | ------------------------------------------------------------------ |
| `id`                        | UUID        | **PK**, DEFAULT `gen_random_uuid()`         | Unique event identifier.                                           |
| `user_id`                   | UUID        | FK → `auth.users(id)`, `ON DELETE SET NULL` | Whose action is logged (nullable for system events).               |
| `event_type`                | TEXT        | NOT NULL                                    | e.g., `'form_started','step_completed','payment_processed'`.       |
| `entity_type`               | TEXT        | NOT NULL                                    | Table/entity affected (`'user_profile','form_session','payment'`). |
| `entity_id`                 | UUID        | —                                           | ID of the affected entity.                                         |
| `event_data`                | JSONB       | NOT NULL DEFAULT `'{}'`                     | Stores event‑specific data.                                        |
| `old_values` / `new_values` | JSONB       | —                                           | Before/after snapshots for updates.                                |
| `ip_address`                | INET        | —                                           | Origin IP address.                                                 |
| `user_agent`                | TEXT        | —                                           | Client user agent string.                                          |
| `session_id`                | TEXT        | —                                           | Associated session token if available.                             |
| `created_at`                | TIMESTAMPTZ | DEFAULT `now()` NOT NULL                    | Time of the event.                                                 |

Indexes on `user_id`, `event_type`, `entity_type` and `created_at` speed audits; RLS allows users to read only their own events.

#### `referral_codes`

| Column            | Type        | Constraints                                   | Purpose                                                       |
| ----------------- | ----------- | --------------------------------------------- | ------------------------------------------------------------- |
| `id`              | UUID        | **PK**, DEFAULT `gen_random_uuid()`           | Unique record ID.                                             |
| `form_session_id` | UUID        | FK → `form_sessions(id)`, `ON DELETE CASCADE` | Associates code with a specific form session.                 |
| `code`            | TEXT        | UNIQUE NOT NULL                               | Six‑digit (or alphanumeric) code given to the doctor.         |
| `expires_at`      | TIMESTAMPTZ | NOT NULL                                      | When the code becomes invalid (e.g., 30 days after creation). |
| `used`            | BOOLEAN     | DEFAULT `false`                               | Flag to prevent reuse.                                        |
| `created_at`      | TIMESTAMPTZ | DEFAULT `now()`                               | Record timestamp.                                             |
| `used_at`         | TIMESTAMPTZ | —                                             | Set when the code is redeemed.                                |

An index on `code` speeds up lookups. A CHECK constraint should ensure `expires_at > now()` at insert time.

#### `referrals`

| Column                | Type        | Constraints                                                                              | Purpose                                                   |
| --------------------- | ----------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `id`                  | UUID        | **PK**, DEFAULT `gen_random_uuid()`                                                      | Unique referral ID.                                       |
| `form_session_id`     | UUID        | FK → `form_sessions(id)`, `ON DELETE CASCADE`                                            | Associates referral with the patient’s session.           |
| `document_id`         | UUID        | FK → `documents(id)`, `ON DELETE CASCADE`                                                | Points to the actual referral file stored in `documents`. |
| `doctor_name`         | TEXT        | NOT NULL                                                                                 | Name of the doctor completing the referral.               |
| `doctor_clinic`       | TEXT        | —                                                                                        | Clinic or practice name.                                  |
| `doctor_hin_email`    | TEXT        | NOT NULL                                                                                 | HIN email address used for confirmation.                  |
| `doctor_phone`        | TEXT        | —                                                                                        | Optional phone number for contact.                        |
| `status`              | TEXT        | DEFAULT `'uploaded'`, allowed values `'uploaded','pending_review','approved','rejected'` | For future workflows if review is needed.                 |
| `uploaded_at`         | TIMESTAMPTZ | DEFAULT `now()`                                                                          | Timestamp of referral submission.                         |
| `patient_notified_at` | TIMESTAMPTZ | —                                                                                        | Timestamp when patient notification was sent.             |
| `doctor_notified_at`  | TIMESTAMPTZ | —                                                                                        | Timestamp when doctor confirmation was sent.              |

A separate `status` field allows the referral to progress through additional review steps if needed.

---

### JSONB Content Structure in `form_sessions.form_data`

The `form_data` column stores the answers from each stage as nested JSON, with predictable keys per step:

| Step / Section                | Example Keys and Data Types                                                                                                                                                                                                                                                                                                        |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Contact & Account** (step0) | `{ "email": "user@example.ch", "date_of_birth": "1980-05-20", "accepted_terms": true, "accepted_privacy_policy": true }`                                                                                                                                                                                                           |
| **Eligibility Gate** (step1)  | `{ "insurance_status": true, "insurance_model": "hmo", "contraindications": { "pregnant": false, "pacemaker": false, "recent_heart_attack": false }, "symptoms": ["palpitations","fainting"], "fainting_details": { "episodes": 2 }, "chest_pain_details": { "severity": "moderate" }, "family_history": "uncle had arrhythmia" }` |
| **Detailed History** (step2)  | `{ "symptom_onset": "2025-01-15", "symptom_frequency": "weekly", "symptom_severity": 3, "arrhythmia_history": "none", "prior_procedures": "none", "medications": ["Beta‑blocker"], "uploads": ["document_id_123"] }`                                                                                                               |
| **Insured Path** (step3a)     | `{ "confirmed_insurance_model": "hmo", "gp_details": { "name": "Dr Müller", "clinic": "Zentrum Medizin", "phone": "+41 44 123 45 67" }, "telmed_call_reference": null, "consents": { "share_with_insurer": true, "telemedicine": true, "data_privacy": true } }`                                                                   |
| **Self‑Pay Path** (step3b)    | `{ "phone": "+41 79 123 45 67", "phone_verified": true, "shipping_address": { "street": "Hauptstrasse 5", "postal_code": "8805", "city": "Richterswil", "country": "CH" }, "payment_intent_id": "pi_abc123", "consents": { "self_pay_agreement": true, "data_privacy": true } }`                                                   |
| **Completion**                | `{ "confirmation": true, "additional_comments": "Looking forward to the test" }`                                                                                                                                                                                                                                                   |

The `eligibility_result` JSONB stores output from `check_eligibility()` in the form `{ "eligible": true, "pathway": "insured", "reason": "symptomatic insured user" }`.

---

