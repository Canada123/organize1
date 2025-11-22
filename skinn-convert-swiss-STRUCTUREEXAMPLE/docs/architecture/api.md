# API Documentation

## Overview
RESTful API built with Supabase Edge Functions providing authentication, eligibility processing, and data management endpoints.

## Authentication Endpoints

### POST /auth/otp/send
Send OTP to email or phone
```json
{
  "type": "email|phone",
  "value": "user@example.com"
}
```

### POST /auth/otp/verify
Verify OTP code
```json
{
  "code": "123456",
  "session_id": "uuid"
}
```

### POST /auth/logout
Terminate user session

## Eligibility Endpoints

### POST /eligibility/submit
Submit eligibility questionnaire
```json
{
  "answers": {},
  "user_id": "uuid",
  "language": "en"
}
```

### GET /eligibility/status/:id
Get submission status and score

### GET /eligibility/questions
Get dynamic questionnaire configuration

## User Management

### GET /user/profile
Get authenticated user profile

### PUT /user/profile
Update user information

### POST /user/consent
Record GDPR consent

## Reference Data

### GET /reference/cantons
List Swiss cantons

### GET /reference/insurance
List insurance providers

### GET /reference/translations/:lang
Get UI translations

## Error Handling

Standard error response:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

## Rate Limiting
- OTP endpoints: 5 requests/10 minutes
- API endpoints: 100 requests/minute
- Bulk operations: 10 requests/minute

## Security Headers
- `X-Request-Id`: Trace request through system
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Reset timestamp

## Response Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `429` - Too Many Requests
- `500` - Server Error