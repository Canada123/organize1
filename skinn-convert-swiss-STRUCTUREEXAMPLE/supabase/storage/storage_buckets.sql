-- ==========================================
-- SUPABASE STORAGE CONFIGURATION
-- ==========================================
-- VERSION: 1.0
-- CREATED: 2025-08-19
-- PURPOSE: Storage bucket configuration for file uploads
--          with security policies and GDPR compliance
-- ==========================================

-- ==========================================
-- 1. STORAGE BUCKETS
-- ==========================================

-- User documents bucket (private, encrypted)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'user-documents',
    'user-documents',
    false, -- Private bucket
    10485760, -- 10MB limit per file
    ARRAY[
        'application/pdf',
        'image/jpeg',
        'image/png', 
        'image/tiff',
        'application/dicom', -- Medical imaging format
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
);

-- GP referral documents (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'gp-referrals',
    'gp-referrals',
    false, -- Private bucket
    5242880, -- 5MB limit per file
    ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
);

-- Temporary uploads (for processing before moving to permanent storage)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'temp-uploads',
    'temp-uploads',
    false, -- Private bucket
    20971520, -- 20MB limit for temporary files
    ARRAY[
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/tiff',
        'application/dicom',
        'text/plain'
    ]
);

-- Public assets (for generated documents that can be shared)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'public-assets',
    'public-assets',
    true, -- Public bucket
    2097152, -- 2MB limit per file
    ARRAY[
        'application/pdf',
        'image/jpeg',
        'image/png'
    ]
);

-- ==========================================
-- 2. STORAGE POLICIES FOR USER DOCUMENTS
-- ==========================================

-- Users can upload their own documents
CREATE POLICY "Users can upload own documents" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'user-documents' AND
    (auth.uid()::text) = (storage.foldername(name))[1]
);

-- Users can view their own documents
CREATE POLICY "Users can view own documents" ON storage.objects
FOR SELECT USING (
    bucket_id = 'user-documents' AND
    (auth.uid()::text) = (storage.foldername(name))[1]
);

-- Users can update their own documents
CREATE POLICY "Users can update own documents" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'user-documents' AND
    (auth.uid()::text) = (storage.foldername(name))[1]
);

-- Users can delete their own documents
CREATE POLICY "Users can delete own documents" ON storage.objects
FOR DELETE USING (
    bucket_id = 'user-documents' AND
    (auth.uid()::text) = (storage.foldername(name))[1]
);

-- Healthcare providers can access shared documents
CREATE POLICY "Healthcare providers can access shared documents" ON storage.objects
FOR SELECT USING (
    bucket_id = 'user-documents' AND
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'healthcare_provider' AND
    EXISTS (
        SELECT 1 FROM public.user_documents ud
        WHERE ud.file_path = name 
        AND ud.access_level IN ('shared_with_gp', 'shared_with_provider')
    )
);

-- ==========================================
-- 3. STORAGE POLICIES FOR GP REFERRALS
-- ==========================================

-- System can create GP referral documents
CREATE POLICY "System can create GP referrals" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'gp-referrals' AND
    (auth.jwt() ->> 'role')::text = 'service_role'
);

-- Users can view their own GP referrals
CREATE POLICY "Users can view own GP referrals" ON storage.objects
FOR SELECT USING (
    bucket_id = 'gp-referrals' AND
    (auth.uid()::text) = (storage.foldername(name))[1]
);

-- Healthcare providers can access referrals directed to them
CREATE POLICY "GPs can access directed referrals" ON storage.objects
FOR SELECT USING (
    bucket_id = 'gp-referrals' AND
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'healthcare_provider' AND
    EXISTS (
        SELECT 1 FROM public.gp_referrals gr
        WHERE gr.referral_letter_path = name 
        OR gr.patient_summary_path = name
        AND gr.gp_email = auth.jwt() ->> 'email'
    )
);

-- ==========================================
-- 4. STORAGE POLICIES FOR TEMPORARY UPLOADS
-- ==========================================

-- Users can upload to temp folder (for processing)
CREATE POLICY "Users can upload to temp" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'temp-uploads' AND
    (auth.uid()::text) = (storage.foldername(name))[1]
);

-- Users can access their temp uploads
CREATE POLICY "Users can access own temp uploads" ON storage.objects
FOR SELECT USING (
    bucket_id = 'temp-uploads' AND
    (auth.uid()::text) = (storage.foldername(name))[1]
);

-- System can manage temp uploads (for processing)
CREATE POLICY "System can manage temp uploads" ON storage.objects
FOR ALL USING (
    bucket_id = 'temp-uploads' AND
    (auth.jwt() ->> 'role')::text = 'service_role'
);

-- Auto-delete temp files after 24 hours (handled by cron job)

-- ==========================================
-- 5. STORAGE POLICIES FOR PUBLIC ASSETS
-- ==========================================

-- Public assets are readable by anyone
CREATE POLICY "Public assets are readable" ON storage.objects
FOR SELECT USING (bucket_id = 'public-assets');

-- Only system can create public assets
CREATE POLICY "System can create public assets" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'public-assets' AND
    (auth.jwt() ->> 'role')::text = 'service_role'
);

-- ==========================================
-- 6. HELPER FUNCTIONS FOR FILE MANAGEMENT
-- ==========================================

-- Function to get user's storage quota usage
CREATE OR REPLACE FUNCTION public.get_user_storage_usage(user_uuid UUID DEFAULT auth.uid())
RETURNS TABLE(
    total_files BIGINT,
    total_size BIGINT,
    quota_limit BIGINT,
    usage_percentage DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_files,
        COALESCE(SUM(metadata->>'size')::BIGINT, 0) as total_size,
        104857600::BIGINT as quota_limit, -- 100MB default quota
        CASE 
            WHEN COALESCE(SUM(metadata->>'size')::BIGINT, 0) > 0 
            THEN ROUND(
                (COALESCE(SUM(metadata->>'size')::BIGINT, 0)::DECIMAL / 104857600::DECIMAL) * 100, 
                2
            )
            ELSE 0::DECIMAL
        END as usage_percentage
    FROM storage.objects 
    WHERE bucket_id IN ('user-documents', 'temp-uploads') 
    AND (storage.foldername(name))[1] = user_uuid::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired temporary files
CREATE OR REPLACE FUNCTION public.cleanup_expired_temp_files()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
    file_record RECORD;
BEGIN
    -- Delete temp files older than 24 hours
    FOR file_record IN 
        SELECT name, id 
        FROM storage.objects 
        WHERE bucket_id = 'temp-uploads' 
        AND created_at < NOW() - INTERVAL '24 hours'
    LOOP
        DELETE FROM storage.objects WHERE id = file_record.id;
        deleted_count := deleted_count + 1;
    END LOOP;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to move file from temp to permanent storage
CREATE OR REPLACE FUNCTION public.move_temp_to_permanent(
    temp_path TEXT,
    permanent_bucket TEXT,
    permanent_path TEXT,
    user_uuid UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN AS $$
DECLARE
    temp_object RECORD;
BEGIN
    -- Verify user owns the temp file
    SELECT * INTO temp_object
    FROM storage.objects
    WHERE bucket_id = 'temp-uploads'
    AND name = temp_path
    AND (storage.foldername(name))[1] = user_uuid::text;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Temporary file not found or access denied';
    END IF;
    
    -- Copy to permanent location
    INSERT INTO storage.objects (
        id, bucket_id, name, owner, created_at, updated_at, 
        last_accessed_at, metadata
    ) VALUES (
        gen_random_uuid(), permanent_bucket, permanent_path, temp_object.owner,
        NOW(), NOW(), NOW(), temp_object.metadata
    );
    
    -- Delete from temp storage
    DELETE FROM storage.objects WHERE id = temp_object.id;
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate secure file path
CREATE OR REPLACE FUNCTION public.generate_secure_file_path(
    user_uuid UUID,
    file_extension TEXT,
    document_type TEXT DEFAULT 'general'
)
RETURNS TEXT AS $$
BEGIN
    RETURN format(
        '%s/%s/%s_%s.%s',
        user_uuid::text,
        document_type,
        document_type,
        extract(epoch from now())::bigint,
        file_extension
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 7. FILE VALIDATION FUNCTIONS
-- ==========================================

-- Function to validate file upload
CREATE OR REPLACE FUNCTION public.validate_file_upload(
    file_size BIGINT,
    mime_type TEXT,
    bucket_name TEXT
)
RETURNS TABLE(
    is_valid BOOLEAN,
    error_message TEXT,
    max_size BIGINT,
    allowed_types TEXT[]
) AS $$
DECLARE
    bucket_config RECORD;
BEGIN
    -- Get bucket configuration
    SELECT file_size_limit, allowed_mime_types 
    INTO bucket_config
    FROM storage.buckets 
    WHERE id = bucket_name;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'Invalid bucket', 0::BIGINT, ARRAY[]::TEXT[];
        RETURN;
    END IF;
    
    -- Validate file size
    IF file_size > bucket_config.file_size_limit THEN
        RETURN QUERY SELECT 
            FALSE, 
            format('File size %s exceeds limit of %s bytes', file_size, bucket_config.file_size_limit),
            bucket_config.file_size_limit,
            bucket_config.allowed_mime_types;
        RETURN;
    END IF;
    
    -- Validate MIME type
    IF mime_type != ANY(bucket_config.allowed_mime_types) THEN
        RETURN QUERY SELECT 
            FALSE,
            format('MIME type %s not allowed', mime_type),
            bucket_config.file_size_limit,
            bucket_config.allowed_mime_types;
        RETURN;
    END IF;
    
    -- All validations passed
    RETURN QUERY SELECT 
        TRUE,
        'File validation passed'::TEXT,
        bucket_config.file_size_limit,
        bucket_config.allowed_mime_types;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 8. GDPR COMPLIANCE FUNCTIONS
-- ==========================================

-- Function to delete all user files (for GDPR erasure)
CREATE OR REPLACE FUNCTION public.delete_user_files(user_uuid UUID)
RETURNS TABLE(
    bucket TEXT,
    files_deleted INTEGER,
    success BOOLEAN
) AS $$
DECLARE
    bucket_name TEXT;
    deleted_count INTEGER;
    user_folder TEXT;
BEGIN
    user_folder := user_uuid::text;
    
    -- Delete from each bucket
    FOR bucket_name IN SELECT unnest(ARRAY['user-documents', 'gp-referrals', 'temp-uploads']) LOOP
        DELETE FROM storage.objects 
        WHERE bucket_id = bucket_name 
        AND (storage.foldername(name))[1] = user_folder;
        
        GET DIAGNOSTICS deleted_count = ROW_COUNT;
        
        RETURN QUERY SELECT bucket_name, deleted_count, TRUE;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to list all user files (for GDPR data export)
CREATE OR REPLACE FUNCTION public.list_user_files(user_uuid UUID)
RETURNS TABLE(
    bucket TEXT,
    file_path TEXT,
    file_size BIGINT,
    mime_type TEXT,
    created_at TIMESTAMPTZ,
    metadata JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        so.bucket_id as bucket,
        so.name as file_path,
        (so.metadata->>'size')::BIGINT as file_size,
        so.metadata->>'mimetype' as mime_type,
        so.created_at,
        so.metadata
    FROM storage.objects so
    WHERE so.bucket_id IN ('user-documents', 'gp-referrals', 'temp-uploads')
    AND (storage.foldername(so.name))[1] = user_uuid::text
    ORDER BY so.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 9. SCHEDULED CLEANUP JOBS (CRON)
-- ==========================================

-- Note: These would be set up in Supabase dashboard or via pg_cron extension

-- Clean up expired temp files (daily)
-- SELECT cron.schedule('cleanup-temp-files', '0 2 * * *', 'SELECT public.cleanup_expired_temp_files();');

-- Clean up expired OTP records (hourly)
-- SELECT cron.schedule('cleanup-expired-otp', '0 * * * *', 'DELETE FROM public.otp_verifications WHERE otp_expires_at < NOW();');

-- Clean up expired sessions (daily)
-- SELECT cron.schedule('cleanup-expired-sessions', '0 3 * * *', 'UPDATE public.questionnaire_sessions SET status = $$expired$$ WHERE expires_at < NOW() AND status = $$in_progress$$;');

-- ==========================================
-- COMMENTS FOR DOCUMENTATION
-- ==========================================

COMMENT ON FUNCTION public.get_user_storage_usage(UUID) IS 
'Returns storage usage statistics for a user including total files, size, and quota percentage';

COMMENT ON FUNCTION public.cleanup_expired_temp_files() IS 
'Removes temporary files older than 24 hours to prevent storage bloat';

COMMENT ON FUNCTION public.move_temp_to_permanent(TEXT, TEXT, TEXT, UUID) IS 
'Securely moves a file from temporary storage to permanent storage with validation';

COMMENT ON FUNCTION public.validate_file_upload(BIGINT, TEXT, TEXT) IS 
'Validates file uploads against bucket size limits and allowed MIME types';

COMMENT ON FUNCTION public.delete_user_files(UUID) IS 
'GDPR compliance function to delete all files associated with a user';

COMMENT ON FUNCTION public.list_user_files(UUID) IS 
'GDPR compliance function to list all files associated with a user for data export';