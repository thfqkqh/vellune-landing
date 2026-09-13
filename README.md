# VELLUNE Landing Page

VELLUNE 화장품 브랜드 원페이지 랜딩페이지 MVP입니다.

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS 4
- Framer Motion
- React Hook Form + Zod
- **Supabase** (문의 저장, 회원 인증, 게시판)
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
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=re_your_resend_api_key
ADMIN_EMAIL=thfqkqh@gmail.com
RESEND_FROM_EMAIL=onboarding@resend.dev
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY`는 Supabase Dashboard → **Settings → API → anon public** 에서 확인합니다.

## Supabase Setup

1. Run SQL in [`supabase/migrations/001_inquiries.sql`](supabase/migrations/001_inquiries.sql) (문의)
2. Run SQL in [`supabase/migrations/002_posts.sql`](supabase/migrations/002_posts.sql) (게시판)
3. **Authentication → Providers → Email** 활성화
4. **Authentication → URL Configuration** 에 Redirect URL 추가:
   - `http://localhost:3000/auth/callback`
   - `https://vellune-landing.vercel.app/auth/callback`
5. See [`../supabase/README.md`](../supabase/README.md) for migration from Google Sheets

## Board & Auth

- 헤더 **BOARD** → 로그인 필요 (미로그인 시 `/login`으로 이동)
- `/signup` 회원가입, `/login` 로그인
- `/board` 글 목록, `/board/new` 새 글 작성
- 게시글은 Supabase `posts` 테이블 + RLS로 관리

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
