# Eligibility Form Gap Analysis Report

## Executive Summary

This document provides a comprehensive gap analysis between the current eligibility form implementation and the specified requirements from:
- User Journey Specifications
- Technical Specifications  
- Supabase Schema Specifications

**Overall Status:** The implementation has significant gaps that need to be addressed to meet requirements.

## 1. Stage 0 - Contact & Account

### ✅ Implemented Correctly
- Email input with OTP verification
- Date of birth with 18+ age validation
- Development bypass for testing

### ❌ Critical Gaps
| Requirement | Current Implementation | Gap |
|------------|------------------------|-----|
| **Save & Continue Later** | Not implemented | No save/resume link generation after OTP verification |
| **Terms & Privacy Consent** | Missing | Requirements specify explicit consent checkboxes |
| **Session Token Generation** | Missing | No session token for anonymous users |

## 2. Stage 1 - Eligibility Gate

### ❌ Major Implementation Issues
| Requirement | Current Implementation | Gap |
|------------|------------------------|-----|
| **Insurance Model Selection** | Prop mismatch causing blank page | Component expects wrong props |
| **Contraindication Questions** | Unknown implementation | Need to verify 3 specific questions |
| **Emergency Dialogs** | Not implemented | Fainting/chest pain should trigger emergency advice |
| **Symptom Checklist** | Basic implementation | Missing "none of the above" logic |
| **Eligibility Determination** | Not visible | Should show green/neutral/red alerts |

### Required Contraindication Questions:
1. Current pregnancy/breastfeeding
2. Pacemaker or ICD presence
3. Recent cardiac hospitalization

### Required Emergency Triggers:
- Fainting → "Did it cause injuries?"
- Chest pain → "Was it severe?"

## 3. Stage 2 - Detailed Information

### ❌ Completely Missing Features
| Requirement | Status | Notes |
|------------|--------|-------|
| **Collapsible Sections** | Not implemented | Should avoid overwhelming users |
| **Symptom Onset Date** | Missing | Required field |
| **Frequency Selection** | Missing | Daily/Weekly/Monthly/Sporadic |
| **Severity Scale** | Missing | 1-10 slider |
| **File Upload** | Missing | ECGs, referral letters (10MB limit) |
| **Optional Fields** | Not marked | All Stage 2 fields should be optional |

## 4. Stage 3A - Insured Review

### ❌ Critical Missing Components
| Requirement | Status | Impact |
|------------|--------|--------|
| **GP Choice Logic** | Not implemented | Standard/Flex users need own/partner GP choice |
| **HMO Restrictions** | Missing | HMO users must use assigned GP only |
| **Telmed Instructions** | Missing | Call hotline instructions |
| **GP Details Collection** | Missing | Name, practice, HIN email, phone |
| **Referral Packet Generation** | Partially implemented | PDF generation not connected |

## 5. Stage 3B - Self-Pay

### ⚠️ Partial Implementation
| Requirement | Current | Gap |
|------------|---------|-----|
| **Phone Collection** | Implemented | ✅ Correctly delayed until Stage 3B |
| **Phone OTP** | Implemented | ✅ Working |
| **Address Collection** | Basic implementation | Missing proper validation |
| **Payment Amount** | CHF 499 | ❌ Should be CHF 350 |
| **Stripe Integration** | Mock only | ❌ TODO comment, not integrated |

## 6. Stage 4 - Doctor Referral Upload

### ⚠️ Partial Implementation
| Feature | Status | Notes |
|---------|--------|-------|
| **Referral Code Generation** | Service exists | Not connected to completion flow |
| **6-Character Code** | Implemented | ✅ Working in service |
| **QR Code Display** | Component exists | Not shown to users |
| **Doctor Portal Route** | `/referral` created | Basic implementation |
| **File Upload** | UI exists | Backend integration unclear |
| **Email Notifications** | Not implemented | Should notify doctor and patient |
| **7-Year Retention** | Schema exists | Not enforced in code |

### How Doctor Referral Currently Works:
1. **Patient Side:** After Stage 3A completion, should generate a 6-character code
2. **Code Display:** ReferralCodeDisplay component shows code + QR
3. **Doctor Access:** Navigate to `http://localhost:8080/referral`
4. **Upload Process:** 
   - Enter 6-character code
   - Provide doctor details (name, clinic, HIN email)
   - Upload signed referral PDF
   - System validates and stores document

## 7. Database Schema Alignment

### ✅ Schema Correctly Defined
- All required tables exist in `/supabase/schemas/`
- Proper constraints and relationships

### ❌ Not Connected to Frontend
| Table | Usage Status |
|-------|-------------|
| `form_sessions` | Not used for save/resume |
| `referral_codes` | Service exists but not integrated |
| `referrals` | Upload portal not saving here |
| `documents` | File storage not implemented |
| `audit_events` | No audit logging in frontend |

## 8. User Experience Issues

### Critical UX Problems
1. **Blank Page After Stage 0** - Fixed but needs testing
2. **Text Collisions** - UI integration issues persist
3. **No Progress Indicator** - Users don't know where they are
4. **No Back Navigation** - Can't correct mistakes
5. **No Save Progress** - Users lose data on refresh

## 9. Compliance & Security Gaps

### ❌ Missing Compliance Features
- GDPR consent collection
- Data retention policies not enforced
- No audit trail logging
- Missing age verification in database
- No session expiry handling

## 10. Development Priority Matrix

### P0 - Critical (Blocking Users)
1. Fix Stage 1 component props and rendering
2. Implement contraindication questions with emergency dialogs
3. Connect referral code generation to completion flow
4. Fix payment amount (CHF 350 not 499)

### P1 - High Priority (Core Functionality)
1. Implement save & continue later
2. Add GP choice logic for insurance models
3. Implement file upload for medical documents
4. Add progress indicator UI
5. Connect to Supabase for data persistence

### P2 - Medium Priority (Compliance)
1. Add GDPR consent checkboxes
2. Implement audit logging
3. Add session expiry handling
4. Implement email notifications

### P3 - Nice to Have
1. Improve UI/UX with animations
2. Add form field validation feedback
3. Implement data export for GDPR

## Recommendations

### Immediate Actions Required:
1. **Fix Stage 1** - Correct the prop structure to match component expectations
2. **Implement Emergency Flows** - Add dialogs for high-risk symptoms
3. **Complete Stage 2** - Add all missing medical history fields
4. **Connect Database** - Use Supabase for persistence, not just local state
5. **Test E2E Flow** - Verify with Puppeteer after each fix

### Architecture Improvements Needed:
1. Implement proper state persistence with Supabase
2. Add error boundaries for graceful failures
3. Implement proper loading states
4. Add comprehensive form validation
5. Create reusable atomic components for form fields

### Testing Requirements:
- Unit tests for each stage component
- Integration tests for state management
- E2E tests for complete user journeys
- Visual regression tests for UI consistency
- Accessibility tests for WCAG compliance

## Conclusion

The current implementation has the foundation in place but lacks critical features required by the specifications. The most pressing issues are:

1. **Broken user flow** - Stage transitions not working properly
2. **Missing business logic** - Insurance models, contraindications, emergency handling
3. **Incomplete data collection** - Many required fields missing
4. **No persistence** - Database schema exists but not connected
5. **Poor UX** - No progress indication, save/resume, or proper navigation

Estimated effort to close all gaps: **3-4 weeks** of focused development with proper testing.