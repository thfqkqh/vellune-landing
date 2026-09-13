# VELLUNE Landing Page

VELLUNE 화장품 브랜드 원페이지 랜딩페이지 MVP입니다.

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS 4
- Framer Motion
- React Hook Form + Zod
- **Supabase** (문의 저장)
- **Resend** (관리자 메일 알림)

## Getting Started

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=re_your_resend_api_key
ADMIN_EMAIL=thfqkqh@gmail.com
RESEND_FROM_EMAIL=onboarding@resend.dev
```

## Supabase Setup

1. Run SQL in [`../supabase/migrations/001_inquiries.sql`](../supabase/migrations/001_inquiries.sql)
2. See [`../supabase/README.md`](../supabase/README.md) for migration from Google Sheets

## Migrate Google Sheets Data

```bash
npm run migrate:sheets -- ../data/inquiries.csv
```

## Sections

1. HERO — Hero Brand Film (배경 영상)
2. BRAND — 브랜드 스토리
3. COMPANY — VELLUNE LABS 소개
4. PRODUCT — VELLUNE 01 제품
5. EXPERIENCE — Texture Film (배경 영상)
6. SCIENCE — 과학/성분 신뢰
7. VISUAL — Brand Film (배경 영상)
8. CONTACT — 문의폼 + Footer

## Deploy (Vercel)

Set Supabase + Resend environment variables in Vercel dashboard.
