wiss Holter‑Monitoring Eligibility Questionnaire**

## **Purpose and Design Principles**

The eligibility questionnaire is an interactive wizard used to determine whether a patient in Switzerland qualifies for a Holter‑monitoring study. It follows an **eligibility‑first** approach: the form collects basic contact details, quickly screens for contraindications and symptoms, confirms insurance status and then decides whether the user is likely to be reimbursed. Detailed medical history, payment and consents are deferred until the user has passed the initial gate, which reduces cognitive load and improves completion rates. The design uses **shadcn/ui** components and the project’s Tailwind theme to ensure consistency with the existing site. Copy is written in clear, plain language, emphasising benefits and safety messages.

## **High‑Level Journey**

### **Step 0 – Contact & Account**

The journey starts by capturing the user’s **email** and **date of birth**. An OTP is sent to the email to verify identity; the user cannot continue until the code is confirmed. Date of birth must indicate the user is at least 18 years old. **Phone numbers are deliberately not collected at this stage** to minimise friction; self‑pay users will provide a phone later. After successful verification, a partial record is stored and a “Save & continue later” link becomes available.

### **Step 1 – Eligibility Gate**

This step determines early eligibility. Users are asked whether they have Swiss health insurance; if yes they choose a model (**Standard/Flex, HMO/Hausarzt or Telmed**); if no, the system automatically assigns them to the **Self‑Pay** path. Three yes/no contraindication questions follow: current pregnancy, presence of a pacemaker or ICD and recent cardiac hospitalisation. A positive answer triggers a red alert advising the user to consult their GP or emergency services and halts the process. If all contraindications are negative, the user selects symptoms from a checklist (palpitations, dizziness, fainting, chest pain, shortness of breath, other, or **none of the above**). Selecting “fainting” or “chest pain” opens a dialog asking whether the episode caused injuries or severe pain; if yes, emergency advice is displayed and acknowledgement is required before continuing. Choosing “none of the above” disables all other symptom options. An optional family‑history switch asks whether a close relative has experienced sudden cardiac death or arrhythmia.

After completing these questions, the system makes an early decision:

1. **Contraindications present:** If any contraindication is answered “Yes,” the user is informed that they are **ineligible** and directed to seek medical advice.

2. **Insured with symptoms:** Users with insurance and at least one symptom receive a positive alert (“You may be eligible for reimbursement”) and proceed to the next stage.

3. **Insured without symptoms:** Users with insurance but no symptoms see a neutral message explaining that preventive screening is typically not reimbursed. They can either proceed as self‑pay or exit.

4. **Uninsured:** Users without Swiss insurance automatically continue on the self‑pay path.

### **Stage 2 – Detailed Information**

This stage collects more medical history **only for users who pass the eligibility gate or choose self‑pay**. The form uses collapsible sections to avoid overwhelming users. Fields include: onset date of symptoms, frequency (daily/weekly/monthly/sporadic) and severity (1–10 scale); prior arrhythmia diagnosis or cardiac procedure with follow‑up description; current medications; and optional file uploads (ECGs or referral letters up to 10 MB). All fields in this stage are optional.

### **Stage 3 – Review & Consents (Insured)**

Only users with valid insurance models reach this stage. The page summarises previous answers and allows editing. The user reconfirms the insurance model and receives guidance specific to the model: **Standard/Flex** users choose between their own GP or a partner GP (Medgate); **HMO/Hausarzt** users must use their assigned GP; **Telmed** users are instructed to call a triage hotline. If an own GP is selected, the form collects the GP’s name, practice, HIN email and phone number; upon submission, a referral packet (cover letter, info sheet and referral form) is generated for the user to deliver. Partner‑GP users are linked to the Medgate booking portal and teleconsultation generates the referral. Users must tick checkboxes confirming the truthfulness of their information, acknowledging that Holter monitoring is not a replacement for emergency care and consenting to telemedicine and data processing. After consenting, the final screen explains next steps: download referral packets or follow Telmed instructions.

### **Self‑Pay Stage 3 – Payment & Consents**

This path serves users without insurance or those who chose self‑pay after Step 1. At this stage a **phone number is requested for the first time**; it is verified with an OTP to ensure the user can receive SMS updates. The user enters their shipping address (street, postal code and city), reviews their previous answers and completes payment via a secure payment component. Consents identical to the insured flow are collected. After payment succeeds, the user is thanked and told their Holter kit will be shipped shortly.

### **Stage 4 – Doctor Referral Upload**

Once Stage 3 is complete, the system prepares a **referral package** for every user who requires a physician to authorise Holter monitoring. The package includes a cover letter, an information sheet and a referral form. Crucially, it also contains a short referral code (six characters) that uniquely links back to the patient’s session. The patient is instructed to share this code with their GP or to scan an optional QR code that pre‑fills the code on an upload page. On the dedicated referral page (e.g. referral.domain.ch), the doctor or medical assistant enters the code, provides their name, practice and HIN email and uploads the signed referral document. Upon submission, the code is marked as used, the document is stored securely for seven years and confirmation emails are sent to both doctor and patient.

### **Completion**

All pathways converge on a completion screen that summarises the user’s next steps and provides contact information for support. Cards with icons and clear headings are used to present information and maintain a friendly tone. For users who need a referral, this page also reminds them to share their referral code with their doctor and outlines how the upload process works.

## **Conditional Paths**

The form’s logic branches based on contraindications, symptom presence and insurance status. An insured user with symptoms follows the **insured pathway**; an insured user with no symptoms can choose between self‑pay or exiting; uninsured users always follow the **self‑pay pathway**. A “Yes” response to any contraindication stops the process and displays emergency advice. Selecting “fainting” or “chest pain” triggers follow‑up questions and potential emergency alerts. Optional family history does not influence eligibility.

## **Design and User Experience**

The interface uses the **Stepper** component to show the five steps (“Contact,” “Eligibility Gate,” “Details,” “Review/Consents,” “Complete”). Each step is wrapped in a **Card** with a header and content section; navigation buttons (Back, Continue) appear in the footer. Consistent spacing (space‑y‑4 between sections, space‑y‑2 between fields) and Tailwind colours inherited from the site help readability. Emergency messages use red Alerts, while eligibility messages use green or neutral colours. All inputs are labelled, support keyboard navigation and meet accessibility standards. The language avoids medical jargon, provides tooltips when needed and clearly explains why information is collected.

For the doctor referral upload, the design aims to minimise friction: the referral page presents a single input for the six‑digit code, followed by short fields for practice details and a file upload. A progress indicator confirms that the code is valid and that the file has been received. Clear instructions reassure clinicians that their upload is secure and that they will receive confirmation via their HIN email, while patients are notified when their referral has been added.

## **Trade‑Offs and Design Choices**

1. **Delayed Phone Collection:** Collecting the phone number only in the self‑pay stage reduces friction in earlier steps but requires a second OTP verification later. This balances user convenience with the need for reliable contact information and minimises drop‑off for insured users who may not need a phone number.

2. **Symptom Requirement for Insurance:** Requiring at least one symptom for insured reimbursement ensures fair use of health system resources, but it may exclude preventive screening. Users without symptoms can choose to self‑pay or exit, giving them autonomy.

3. **Immediate Stop on Contraindications:** Flagging pregnancy, pacemakers or recent hospitalisation triggers an ineligibility message to protect patient safety. While overly cautious, this prevents remote monitoring in high‑risk scenarios and instructs users to seek in‑person care.

## **Perspectives and Self‑Check**

When designing the flow it is important to consider perspectives from different stakeholders:

* **Patients:** The form must be easy to follow, respect privacy and provide clear guidance when emergency signs are present. Optional questions and the ability to exit ensure agency.

* **Clinicians:** Early identification of high‑risk users reduces liability. Collecting GP details and generating referral packets helps integrate with standard care pathways.

* **Developers:** Using a unified schema (JSONB for form sessions) and state machine reduces complexity and makes the app maintainable.

* **Regulators:** The flow must comply with GDPR and Swiss DPA requirements; row‑level security restricts access to each user’s data, and audit events track every action.

## **Test Scenarios**

| Scenario | Expected Outcome |
| :---- | :---- |
| **Pregnant user with insurance and symptoms** | Contraindication triggers a red alert; user is advised to consult a GP or emergency services and cannot continue. |
| **Insured user with one symptom and no contraindications** | System displays a positive eligibility message and routes the user to Stage 2 and then to the insured Stage 3. |
| **Insured user with no symptoms and no contraindications** | Neutral message explains that screening is not reimbursed; user can choose self‑pay (proceeds) or exit (form ends). |
| **Uninsured user** | Automatically assigned to the self‑pay pathway and proceeds to Stage 2. |
| **Self‑pay user reaches Stage 3** | Phone number is collected and verified via OTP; shipping address and payment details are entered; consents are collected and a confirmation message is displayed. |
| **Doctor uploads referral** | After receiving the referral code, a doctor enters the code on the referral page, provides their details and uploads the referral document. The system stores the file, marks the code as used and sends confirmation emails to the doctor and patient. |

These test cases confirm that the branching logic and validation rules operate as intended.
