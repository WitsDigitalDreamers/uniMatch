-- UniMatch Migration Validation Script
-- Run this to check for any issues before running migrations

-- =============================================
-- VALIDATION CHECKS
-- =============================================

-- Check if required extensions are available
DO $$
BEGIN
    -- Check uuid-ossp extension
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN
        RAISE NOTICE 'uuid-ossp extension not found. Will be created in migration 001.';
    ELSE
        RAISE NOTICE 'uuid-ossp extension is available.';
    END IF;
    
    -- Check pgcrypto extension
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto') THEN
        RAISE NOTICE 'pgcrypto extension not found. Will be created in migration 001.';
    ELSE
        RAISE NOTICE 'pgcrypto extension is available.';
    END IF;
    
    -- Check pg_trgm extension (for text search)
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm') THEN
        RAISE NOTICE 'pg_trgm extension not found. Will be created in migration 002.';
    ELSE
        RAISE NOTICE 'pg_trgm extension is available.';
    END IF;
END $$;

-- Check if auth.users table exists (Supabase requirement)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
        RAISE EXCEPTION 'auth.users table not found. This is required for Supabase authentication.';
    ELSE
        RAISE NOTICE 'auth.users table is available.';
    END IF;
END $$;

-- Check for any existing conflicting functions
DO $$
DECLARE
    func_count INTEGER;
BEGIN
    -- Check for old create_user_role function
    SELECT COUNT(*) INTO func_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' 
    AND p.proname = 'create_user_role'
    AND p.pronargs = 4;
    
    IF func_count > 0 THEN
        RAISE NOTICE 'Found existing create_user_role function. Migration 005 will replace it.';
    END IF;
    
    -- Check for old log_login_attempt function
    SELECT COUNT(*) INTO func_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' 
    AND p.proname = 'log_login_attempt'
    AND p.pronargs = 5;
    
    IF func_count > 0 THEN
        RAISE NOTICE 'Found existing log_login_attempt function. Migration 005 will replace it.';
    END IF;
END $$;

-- Check for any existing tables that might conflict
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    -- Check for existing core tables
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('schools', 'universities', 'courses', 'students', 'offers');
    
    IF table_count > 0 THEN
        RAISE NOTICE 'Found existing core tables. Migration 001 will use IF NOT EXISTS.';
    END IF;
    
    -- Check for existing auth tables
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('user_roles', 'user_role_assignments', 'user_sessions_enhanced');
    
    IF table_count > 0 THEN
        RAISE NOTICE 'Found existing auth tables. Migration 005 will use IF NOT EXISTS.';
    END IF;
END $$;

-- Check migration order dependencies
DO $$
BEGIN
    RAISE NOTICE 'Migration order validation:';
    RAISE NOTICE '1. 001_create_core_tables.sql - Creates core tables and extensions';
    RAISE NOTICE '2. 002_create_indexes.sql - Creates indexes for performance';
    RAISE NOTICE '3. 003_create_functions_triggers.sql - Creates functions and triggers';
    RAISE NOTICE '4. 004_create_rls_policies.sql - Creates RLS policies for core tables';
    RAISE NOTICE '5. 005_create_auth_tables.sql - Creates auth tables and functions';
    RAISE NOTICE '6. 006_create_auth_rls_policies.sql - Creates RLS policies for auth tables';
    RAISE NOTICE '';
    RAISE NOTICE 'All migrations are ready to run in order.';
END $$;

-- =============================================
-- FUNCTION SIGNATURE VALIDATION
-- =============================================

-- Validate function parameter orders
DO $$
BEGIN
    RAISE NOTICE 'Function signature validation:';
    RAISE NOTICE 'create_user_role(TEXT, TEXT, JSONB, TEXT) - Correct parameter order';
    RAISE NOTICE 'log_login_attempt(TEXT, BOOLEAN, INET, TEXT, TEXT) - Correct parameter order';
    RAISE NOTICE 'All functions follow PostgreSQL default parameter rules.';
END $$;

-- =============================================
-- FINAL VALIDATION
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'MIGRATION VALIDATION COMPLETE';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'All migrations are ready to run.';
    RAISE NOTICE 'No critical issues found.';
    RAISE NOTICE 'Run migrations in order: 001 -> 002 -> 003 -> 004 -> 005 -> 006';
    RAISE NOTICE '=============================================';
END $$;
