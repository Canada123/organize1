# Database Architecture

## Overview
Supabase (PostgreSQL) database with 14 tables supporting Swiss healthcare eligibility screening, user management, and multi-language content.

## Core Tables

### User Management
- `users` - Core user data with Swiss compliance fields
- `sessions` - Secure session management
- `otp_verifications` - Rate-limited OTP tracking

### Business Logic
- `insurance_providers` - 9 Swiss insurance companies
- `eligibility_submissions` - Form responses with scoring
- `eligibility_questions` - Dynamic questionnaire configuration
- `cantons` - Swiss canton validation data

### Supporting Tables
- `user_consents` - GDPR compliance tracking
- `analytics_events` - User behavior tracking
- `support_tickets` - Customer support integration

## Security

### Row-Level Security (RLS)
All tables have RLS policies enforcing:
- User can only access their own data
- Admin role for support operations
- Public read for reference data (cantons, insurance)

### Authentication
- OTP verification with bcrypt hashing
- Rate limiting: 5 attempts per 10 minutes
- Secure session tokens with httpOnly cookies

## Migrations

Current migration files:
- `001_initial_schema.sql` - Base tables
- `007_core_user_tables.sql` - User management
- `009_schema_v2_consolidation.sql` - Schema improvements
- `010_business_logic_functions.sql` - Stored procedures
- `011_otp_functions.sql` - OTP verification logic
- `011_otp_security_hardening.sql` - Security enhancements

## Edge Functions

### Authentication
- `send-otp-email` - Email OTP delivery
- `otp-security-handler` - Rate limiting enforcement
- `session-management` - Cookie handling

### Business Logic
- `eligibility-calculator` - Score calculation
- `insurance-validator` - Provider verification

## Performance Optimizations

### Indexes
- User lookups: `idx_users_email`
- Session validation: `idx_sessions_token`
- OTP verification: `idx_otp_phone_created`

### Partitioning
- `analytics_events` partitioned by month
- `eligibility_submissions` partitioned by year

## Backup & Recovery
- Daily automated backups
- Point-in-time recovery (7 days)
- Cross-region replication for DR

## Monitoring
- Query performance tracking
- Slow query alerts (>100ms)
- Connection pool monitoring