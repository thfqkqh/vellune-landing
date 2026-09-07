# VELLUNE Landing Page

VELLUNE 화장품 브랜드 원페이지 랜딩페이지 MVP입니다.

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS 4
- Framer Motion
- React Hook Form + Zod
- Google Apps Script + Google Sheets (문의 저장)

## Getting Started

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

## Environment Variables

`.env.local` 파일에 아래 값을 설정합니다.

```env
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

## Google Sheets Setup

1. Google Spreadsheet `VELLUNE_INQUIRIES` 생성
2. 시트 이름 `INQUIRIES` 로 생성하고 1행 헤더 입력:
   `ID | DATE | TYPE | COMPANY | NAME | EMAIL | PHONE | MESSAGE | PRIVACY | STATUS`
3. **Extensions > Apps Script** 에 [`google-apps-script/Code.gs`](google-apps-script/Code.gs) 내용 붙여넣기
4. **Deploy > New deployment > Web app**
   - Execute as: Me
   - Who has access: Anyone
5. 배포 URL을 `.env.local` 의 `GOOGLE_SCRIPT_URL` 에 입력

## Project Structure

- `app/` — 페이지, API Route
- `components/` — Header, Footer, 섹션, 폼
- `data/` — 카피 및 제품 데이터
- `lib/` — validation, media paths, Google Sheets helper
- `public/media/` — source 폴더에서 복사한 이미지/영상

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

```bash
npm run build
```

Vercel에 프로젝트를 연결한 뒤 Environment Variables에 `GOOGLE_SCRIPT_URL` 을 등록합니다.

## Media

모든 미디어는 상위 `source/` 폴더 원본을 `public/media/` 로 복사해 사용합니다.
영상은 음소거·자동재생·루프로 배경 재생되며, `prefers-reduced-motion` 환경에서는 poster 이미지로 대체됩니다.
