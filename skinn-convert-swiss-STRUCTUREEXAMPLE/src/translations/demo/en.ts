export const demoTranslations = {
  meta: {
    title: "Request a Demo - SKIIN Switzerland",
    description: "Experience the future of cardiac monitoring. Schedule a personalized demonstration of SKIIN's revolutionary heart monitoring system."
  },
  hero: {
    title: "Request a Demo",
    subtitle: "Experience the future of cardiac monitoring. Fill out the form below and our team will contact you within 24 hours to schedule a personalized demonstration.",
    backButton: "Back"
  },
  form: {
    title: "Contact Information",
    fields: {
      firstName: {
        label: "First Name *",
        placeholder: "John",
        error: "First name must be at least 2 characters"
      },
      lastName: {
        label: "Last Name *",
        placeholder: "Doe",
        error: "Last name must be at least 2 characters"
      },
      email: {
        label: "Email *",
        placeholder: "john.doe@example.com",
        error: "Invalid email address"
      },
      phone: {
        label: "Phone Number *",
        placeholder: "+41 XX XXX XX XX",
        error: "Phone number must be at least 10 digits"
      },
      organization: {
        label: "Organization/Practice *",
        placeholder: "Your organization name",
        error: "Organization name is required"
      },
      role: {
        label: "Your Role *",
        placeholder: "Select your role",
        error: "Please select your role",
        options: {
          physician: "Physician",
          cardiologist: "Cardiologist",
          practiceManager: "Practice Manager",
          hospitalAdmin: "Hospital Administrator",
          insurance: "Insurance Representative",
          other: "Other"
        }
      },
      message: {
        label: "Additional Information (Optional)",
        placeholder: "Tell us about your specific needs or questions..."
      },
      consent: {
        label: "I agree to the privacy policy and consent to be contacted regarding this demo request. *",
        error: "You must agree to the privacy policy",
        privacyLink: "privacy policy"
      }
    },
    submitButton: "Request Demo",
    successMessage: "Demo request submitted successfully! We will contact you within 24 hours.",
    errorMessage: "Failed to submit demo request. Please try again."
  },
  expectations: {
    title: "What to Expect",
    items: {
      quickResponse: {
        title: "Quick Response",
        description: "Our team will contact you within 24 hours to schedule your demo"
      },
      personalizedDemo: {
        title: "Personalized Demo",
        description: "30-minute video call tailored to your specific needs and use cases"
      },
      comprehensiveOverview: {
        title: "Comprehensive Overview",
        description: "Learn about features, reimbursement, implementation, and support"
      },
      qaSession: {
        title: "Q&A Session",
        description: "Get all your questions answered by our medical experts"
      }
    }
  },
  highlights: {
    title: "Demo Highlights",
    items: [
      "SKIIN smart textile technology overview",
      "Live ECG monitoring demonstration",
      "MVCP (Myant Virtual Clinic Portal) walkthrough",
      "Patient app features and reports",
      "Insurance reimbursement process",
      "Implementation timeline and support"
    ]
  }
};