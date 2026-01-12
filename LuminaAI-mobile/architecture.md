# LuminaAI Architecture & Database Schema

## Overview
LuminaAI is a career intelligence platform built with React Native (Expo) and Supabase. It uses specialized AI agents to analyze job opportunities and provide real-value assessments.

## Database Schema (Supabase)

### Tables

#### 1. `public.profiles`
Stores user preferences and profile information.
- `id`: `uuid` (Primary Key, references `auth.users.id`)
- `job_title`: `text`
- `location`: `text`
- `experience_level`: `text` (Entry, Mid, Senior, Executive)
- `salary_min`: `integer`
- `salary_max`: `integer`
- `work_mode`: `text` (Remote, Hybrid, On-site)
- `employment_type`: `text` (Full-time, Contract, Freelance)
- `key_skills`: `text`
- `enable_intelligence`: `boolean`
- `enable_resume_tailoring`: `boolean`
- `resume_path`: `text` (Path to file in `resumes` storage bucket)
- `updated_at`: `timestamp with time zone`

**RLS Policies:**
- **View own profile**: `(select auth.uid()) = id`
- **Insert own profile**: `(select auth.uid()) = id`
- **Update own profile**: `(select auth.uid()) = id`

---

#### 2. `public.saved_jobs`
Stores jobs that users have bookmarked for later.
- `id`: `bigint` (Primary Key, Identity)
- `user_id`: `uuid` (references `auth.users.id`)
- `job_id`: `text` (External ID from job source)
- `title`: `text`
- `company`: `text`
- `location`: `text`
- `salary`: `text`
- `posted_date`: `text`
- `platform`: `text`
- `match_score`: `integer`
- `description`: `text`
- `requirements`: `text[]` (Array of strings)
- `url`: `text`
- `market_intelligence`: `jsonb` (Cached analysis)
- `saved_at`: `timestamp with time zone`

**RLS Policies:**
- **Manage own saved jobs**: `(select auth.uid()) = user_id` (Allows ALL: select, insert, update, delete)

---

### Storage Buckets

#### 1. `resumes`
Stores user uploaded PDF or TXT resume files.
- **Path structure**: `{user_id}/{filename}`
- **Security**: Restricted to authenticated users managing their own files.

---

## Performance Optimizations
All RLS policies use the subquery syntax `(select auth.uid())` instead of the direct `auth.uid()` function call to leverage statement-level caching in Postgres, improving performance by up to 99% at scale.
