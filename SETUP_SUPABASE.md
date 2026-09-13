# Supabase Migration Setup

## 1. Run SQL

Supabase Dashboard → SQL Editor → run [`supabase/migrations/001_inquiries.sql`](supabase/migrations/001_inquiries.sql)

## 2. Environment variables

**vellune-landing `.env.local`:**

```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
ADMIN_EMAIL=thfqkqh@gmail.com
RESEND_FROM_EMAIL=onboarding@resend.dev
```

**vellune-admin `.env.local`:**

```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=vellune2026
AUTH_SECRET=vellune-admin-jwt-secret-change-me
```

## 3. Migrate Google Sheets CSV

```bash
npm run migrate:sheets -- path/to/inquiries.csv
```

## 4. Sync sequence after import

```sql
select setval(
  'public.inquiry_seq',
  coalesce(
    (
      select max(cast(substring(display_id from 4) as integer))
      from public.inquiries
      where display_id ~ '^VL-[0-9]+$'
    ),
    0
  ) + 1,
  false
);
```

## 5. Vercel

Update env vars on both `vellune-landing` and `vellune-admin` projects. Remove `GOOGLE_SCRIPT_URL` and `ADMIN_API_SECRET`.
