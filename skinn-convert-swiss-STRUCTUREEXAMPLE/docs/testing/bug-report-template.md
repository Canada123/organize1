# Bug Report Template - GP Referral Code System

## Bug Report ID: BUG-YYYY-MM-DD-XXX

### Bug Summary
**One-line description of the issue**

---

### Environment Information
- **Environment**: [ ] Development [ ] Staging [ ] Production
- **Browser**: Chrome / Firefox / Safari / Edge (Version: x.x.x)
- **Device**: Desktop / Mobile / Tablet (Specific model if mobile/tablet)
- **Operating System**: Windows / macOS / iOS / Android (Version: x.x)
- **Screen Resolution**: xxxx x xxxx
- **User Language**: EN / DE / FR / IT

### Component/Module Affected
- **System Component**: 
  - [ ] Referral Code Generation
  - [ ] Doctor Upload Portal  
  - [ ] Email Notifications
  - [ ] File Storage
  - [ ] Database Operations
  - [ ] API Endpoints
  - [ ] Frontend Components
  - [ ] Authentication/Security

- **Specific Component**: (e.g., ReferralCodeDisplay, DoctorUploadPortal, etc.)

---

### Bug Details

#### Severity Level
- [ ] **Critical**: System crash, data loss, security breach
- [ ] **High**: Major functionality broken, blocking user workflows  
- [ ] **Medium**: Functionality impaired but workarounds exist
- [ ] **Low**: Minor UI issues, cosmetic problems

#### Priority Level
- [ ] **P0**: Fix immediately - blocking release
- [ ] **P1**: Fix before next release
- [ ] **P2**: Fix in upcoming sprint
- [ ] **P3**: Fix when capacity allows

#### Bug Type
- [ ] Functional Bug
- [ ] Performance Issue
- [ ] Security Vulnerability
- [ ] Accessibility Issue
- [ ] UI/UX Issue
- [ ] Integration Issue
- [ ] Data Issue

---

### Detailed Description
**Provide a clear and concise description of what the bug is**



### Steps to Reproduce
**Provide step-by-step instructions to reproduce the issue**

1. 
2. 
3. 
4. 
5. 

### Expected Behavior
**Describe what should happen normally**



### Actual Behavior
**Describe what actually happens**



### Test Data Used
**Provide any specific test data that triggers the issue**

- **Referral Code**: (if applicable)
- **Patient Data**: (anonymized)
- **Doctor Data**: (anonymized)
- **File Details**: (size, type, name)
- **Form Inputs**: (specific values that cause issue)

---

### Evidence

#### Screenshots/Videos
**Attach screenshots or screen recordings**
- [ ] Screenshot attached
- [ ] Screen recording attached
- [ ] Browser console errors screenshot attached

#### Error Messages
**Copy exact error messages**
```
Paste error messages here
```

#### Console Logs
**Browser console errors/warnings**
```
Paste console logs here
```

#### Network Request Details
**If API-related, include request/response details**
```
Request URL: 
Request Method: 
Status Code: 
Response Body: 
```

---

### Technical Investigation

#### Database State
**If applicable, describe relevant database state**
- **Referral Codes**: Count, status distribution
- **Form Sessions**: Relevant session data
- **Doctor Referrals**: Upload status, file info

#### Server Logs
**Relevant server-side logs (if accessible)**
```
Paste server logs here
```

#### Edge Function Logs
**Supabase Edge Function logs (if applicable)**
```
Paste function logs here
```

---

### Impact Assessment

#### User Impact
- **Users Affected**: All users / Specific user group / Single user
- **Frequency**: Always / Intermittent / Rare
- **Blocking**: Completely blocks workflow / Partially blocks / Minor inconvenience

#### Business Impact
- [ ] Prevents referral code generation
- [ ] Blocks doctor uploads
- [ ] Affects email notifications
- [ ] Impacts data integrity
- [ ] Security risk
- [ ] Compliance violation

#### Related Features
**List any related features that might be affected**
- 
- 
- 

---

### Regression Information

#### First Observed
**When was this bug first noticed?**
- **Date**: YYYY-MM-DD
- **Version**: (if known)
- **Deployment**: (specific release/commit)

#### Previous Working Version
**Last known good version (if regression)**
- **Version**: 
- **Date**: 

#### Recent Changes
**Any recent changes that might be related**
- [ ] Code deployment
- [ ] Database migration  
- [ ] Configuration change
- [ ] Third-party service update

---

### Workaround
**Is there a temporary workaround?**

- [ ] Yes - workaround available
- [ ] No - no workaround available

**Workaround description:**



**Workaround limitations:**



---

### Testing Notes

#### Test Coverage
**How was this missed in testing?**
- [ ] Not covered by automated tests
- [ ] Edge case not considered
- [ ] Environment-specific issue
- [ ] Data-dependent issue
- [ ] Timing/concurrency issue

#### Suggested Tests
**What additional tests should be added to prevent regression?**
- 
- 
- 

---

### Fix Information (To be filled by developer)

#### Root Cause Analysis
**Technical analysis of why the bug occurred**



#### Proposed Solution
**How the bug will be fixed**



#### Code Changes Required
**Files/components that need modification**
- 
- 
- 

#### Testing Strategy for Fix
**How the fix will be validated**
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated  
- [ ] Manual testing performed
- [ ] Regression testing completed

---

### Swiss Healthcare Compliance Check

#### FADP Impact
- [ ] No impact on patient data protection
- [ ] Potential privacy issue - requires review
- [ ] Critical privacy violation - immediate fix required

#### Medical Data Handling
- [ ] No impact on medical data
- [ ] Affects medical data processing - compliance review needed
- [ ] Medical data at risk - urgent fix required

#### HIN Email System
- [ ] No impact on HIN integration
- [ ] HIN email functionality affected
- [ ] HIN security compromised

---

### Verification Criteria

#### Definition of Done for Fix
**Criteria to consider bug fixed:**
- [ ] Issue no longer reproducible in test environment
- [ ] All related functionality working correctly
- [ ] No new issues introduced
- [ ] Automated tests passing
- [ ] Code review completed
- [ ] Security review completed (if applicable)
- [ ] Accessibility review completed (if applicable)

#### Verification Steps
**Steps to verify the fix works:**
1. 
2. 
3. 
4. 

---

### Sign-offs

#### Reported By
**Name**: 
**Role**: 
**Date**: YYYY-MM-DD
**Contact**: 

#### Assigned To
**Developer**: 
**Date Assigned**: YYYY-MM-DD
**Expected Fix Date**: YYYY-MM-DD

#### Verified By
**QA Engineer**: 
**Date Verified**: YYYY-MM-DD
**Verification Notes**: 

#### Approved By
**QA Lead**: 
**Date Approved**: YYYY-MM-DD

---

### Related Issues
**Link to related bugs, user stories, or technical debt items**
- Related Bug: #XXX
- User Story: #XXX  
- Technical Debt: #XXX
- Documentation Update: #XXX

---

### Tags/Labels
**For GitHub issue tracking**
- `bug`
- `gp-referral-system` 
- `priority-high` / `priority-medium` / `priority-low`
- `frontend` / `backend` / `database` / `integration`
- `security` / `accessibility` / `performance`
- `swiss-compliance`

---

## Internal Notes
**For team communication - not for external reporting**

### Investigation Timeline
- **YYYY-MM-DD HH:MM**: Bug reported
- **YYYY-MM-DD HH:MM**: Initial triage
- **YYYY-MM-DD HH:MM**: Investigation started
- **YYYY-MM-DD HH:MM**: Root cause identified
- **YYYY-MM-DD HH:MM**: Fix implemented
- **YYYY-MM-DD HH:MM**: Testing completed
- **YYYY-MM-DD HH:MM**: Bug closed

### Team Discussion
**Key points from team discussions**
- 
- 
- 

---

*Template Version: 1.0*  
*Last Updated: August 25, 2025*  
*For GP Referral Code System Testing*