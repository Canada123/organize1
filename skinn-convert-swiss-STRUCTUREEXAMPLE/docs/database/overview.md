# Architecture Overview v2.0 - Europe Eligibility Form

## System Architecture

The Europe Eligibility Form is built as a modern, serverless web application using Next.js App Router with React Server Components for optimal performance and SEO. Version 2.0 introduces a significantly simplified database architecture with 75% fewer tables while maintaining full functionality.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Browser                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Next.js React Application               │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │   │
│  │  │   Pages  │  │   Forms  │  │  UI Components   │  │   │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │   Forms  │  │ Payments │  │   Email  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │ Supabase │   │  Stripe  │   │  Email   │
        │   (DB)   │   │    API   │   │  Service │
        └──────────┘   └──────────┘   └──────────┘
```

## Core Components

### 1. Frontend Layer

**Next.js App Router**
- Server Components for initial render
- Client Components for interactivity
- Progressive enhancement approach
- Optimistic UI updates

**Form Management**
- Multi-step wizard with state persistence
- Conditional rendering based on responses
- Real-time validation with Zod
- Auto-save functionality

**UI Components**
- shadcn/ui for consistent design
- Tailwind CSS for styling
- Responsive and accessible by default
- Dark mode support

### 2. API Layer

**Authentication**
- Supabase Auth with OTP
- OTP verification for email/phone
- Session management with cookies
- JWT token refresh in middleware

**Form Processing**
- RESTful API endpoints
- Server-side validation
- Database transactions
- Idempotent operations

**Payment Processing**
- Stripe integration for self-pay
- Webhook handling for payment events
- PCI-compliant card processing
- Refund capabilities

### 3. Data Layer

**Supabase (PostgreSQL) v2.0**
- **5 Core Tables**: user_profiles, form_sessions, payments, documents, audit_events
- **75% Schema Reduction**: Simplified from 20+ tables to 5 optimized tables
- **JSONB Form Storage**: Flexible form data in form_sessions.form_data
- **Built-in Auth Integration**: Properly extends auth.users table
- Row-Level Security on all tables
- Database functions for business logic
- Complete audit trails for compliance

**Data Model v2.0**
- **Unified Form Management**: Active and completed forms in single table
- **Flexible JSONB Storage**: Dynamic form data without schema constraints
- **Integrated Payments**: Stripe integration with idempotency protection
- **Document Management**: File uploads and generated referrals
- **Comprehensive Auditing**: All events tracked for GDPR compliance

## Security Architecture

### Authentication & Authorization
- Multi-factor authentication via OTP
- Role-based access control
- Session timeout management
- Secure cookie handling

### Data Protection
- Encryption at rest (Supabase)
- TLS 1.3 for data in transit
- Input sanitization
- SQL injection prevention via parameterized queries

### Compliance
- GDPR data handling
- Right to deletion
- Data portability
- Audit logging

## Performance Optimization

### Frontend
- Code splitting per route
- Dynamic imports for heavy components
- Image optimization with Next.js Image
- Font optimization
- CSS purging in production

### Backend
- Database query optimization
- Connection pooling
- Caching strategies
- CDN for static assets

### Monitoring
- Error tracking with structured logging
- Performance monitoring
- User analytics (privacy-compliant)
- Uptime monitoring

## Scalability Considerations

### Horizontal Scaling
- Stateless application design
- Database connection pooling
- Serverless functions
- CDN distribution

### Vertical Scaling
- Database read replicas (future)
- Query optimization
- Indexed columns
- Materialized views for reports

## Deployment Architecture

### Production Environment
- Vercel for application hosting
- Supabase cloud for database
- Stripe for payments
- SendGrid/Resend for emails

### Development/Staging
- Preview deployments per PR
- Staging database
- Test Stripe account
- Email sandbox

## Integration Points

### External Services
1. **Supabase v2.0**: Database (5 tables), Auth (auth.users), Storage
2. **Stripe**: Payment processing with CHF 350 pricing and idempotency
3. **Email Service**: Transactional emails and notifications
4. **Document Generation**: PDF referrals and invoices
5. **Partner GP API**: Booking integration (future)

### Database Schema v2.0
```
auth.users (Supabase built-in)
├── user_profiles (extends auth.users)
├── form_sessions (unified form state)
├── payments (Stripe integration)
├── documents (files and referrals)
└── audit_events (compliance trail)
```

### Webhook Endpoints
- Stripe payment events
- Email delivery status
- Form submission notifications

## Error Handling

### Client-Side
- Error boundaries for graceful degradation
- User-friendly error messages
- Retry mechanisms
- Offline support (future)

### Server-Side
- Structured error logging
- Error categorization
- Alerting for critical errors
- Graceful fallbacks

## Future Enhancements

### Planned Features
- Real-time collaboration
- Mobile app (React Native)
- Multi-language support
- Advanced analytics dashboard
- AI-powered symptom assessment

### Technical Improvements
- GraphQL API (optional)
- WebSocket for real-time updates
- Service worker for offline
- Edge computing for global distribution

## Schema v2.0 Benefits

### Performance Improvements
- **75% Fewer Tables**: Reduced complexity improves query performance
- **JSONB Efficiency**: Single table queries for form data retrieval
- **Optimized Indexes**: Targeted indexes for common query patterns
- **Unified Sessions**: No joins required for form state management

### Operational Benefits
- **Simplified Maintenance**: 5 tables vs 20+ reduces operational overhead
- **Better Monitoring**: Clear data flow and relationships
- **Easier Scaling**: Simplified schema scales more predictably
- **Reduced Storage**: Elimination of redundant data structures

### Compliance Advantages
- **Enhanced GDPR Support**: Centralized audit trail and data export
- **Swiss DPA Compliance**: Proper data classification and retention
- **Audit Trail Integrity**: Immutable audit_events table
- **Data Minimization**: Simplified schema reduces data exposure

## Conclusion

The v2.0 architecture is designed to be:
- **Scalable**: Can handle growth in users and data with 75% fewer tables
- **Maintainable**: Dramatically simplified with clear data relationships
- **Secure**: Enhanced security with comprehensive audit trails
- **Performant**: Optimized for speed with JSONB storage and better indexes
- **Reliable**: Fault-tolerant with simpler failure modes
- **Compliant**: Full GDPR and Swiss DPA compliance built-in

This architecture provides a robust, simplified foundation for the Europe Eligibility Form while maintaining all functionality and improving performance, maintainability, and compliance.
