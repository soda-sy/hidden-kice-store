# 히든카이스 스토어

히든카이스 교재와 패스 상품을 검색하고, 카테고리로 거르고, 페이지로 나눠 보는 상품 목록 페이지입니다.

## 주요 기능

- 상품명 검색: 입력을 멈추면 300ms 뒤 자동 검색, Enter로 즉시 검색
- 카테고리 필터: 전체, 패스, 단품
- 페이지네이션: 한 페이지에 12개
- 검색 조건을 URL(`?q=&category=&page=`)에 저장: 새로고침, 링크 공유, 뒤로 가기 지원
- 예외 화면: 로딩 스켈레톤, 조회 실패와 다시 시도, 검색 결과 없음, 이미지 로드 실패
- 반응형: 모바일 2열, 태블릿 3열, PC 4열
- 아직 없는 기능(장바구니, 상세 페이지 등)은 "준비 중" 토스트로 안내

## 기술 스택

| 역할 | 사용한 것 |
|---|---|
| 프레임워크 | Next.js 16 (App Router), React 19, TypeScript |
| 스타일 | Tailwind CSS v4 |
| 데이터베이스 | Supabase (Postgres, RLS) |
| 서버 상태 | TanStack Query v5 |
| 테스트 | Vitest, React Testing Library, MSW |
| 패키지 매니저 | pnpm 11 |
| 배포 | Vercel |

## 시작하기

### 1. 준비물

- Node.js 22 이상
- pnpm 11 (`corepack enable`로 `package.json`의 버전을 사용할 수 있습니다)
- Supabase 프로젝트

### 2. 설치

```bash
git clone https://github.com/soda-sy/hidden-kice-store.git
cd hidden-kice-store
pnpm install
```

### 3. 데이터베이스 준비

Supabase 대시보드의 **SQL Editor**에서 아래 두 파일을 순서대로 실행합니다. 두 파일 모두 여러 번 실행해도 결과가 같습니다.

1. `supabase/migrations/20261116000000_create_store_schema.sql`: 테이블, 인덱스, RLS 정책 생성
2. `supabase/seed.sql`: 카테고리 2개, 상품 31개(비공개 상품 1개 포함) 입력

### 4. 환경 변수

`.env.example`을 복사해 `.env.local`을 만들고 값을 채웁니다.

```bash
cp .env.example .env.local
```

| 변수 | 값을 찾는 곳 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 대시보드 > Project Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 같은 화면의 공개 키(anon 또는 publishable) |

공개 키는 브라우저에 노출되는 것을 전제로 한 키이고, 데이터 접근은 RLS 정책으로 제한됩니다. `service_role` 키는 사용하지 않습니다. `.env.local`은 Git에 올라가지 않습니다.

### 5. 실행

```bash
pnpm dev
```

http://localhost:3000 에 접속하면 `/store`로 이동합니다.

## 스크립트

| 명령 | 설명 |
|---|---|
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 빌드 결과 실행 |
| `pnpm lint` | ESLint 검사 |
| `pnpm typecheck` | TypeScript 타입 검사 |
| `pnpm test` | 테스트 1회 실행 |
| `pnpm test:watch` | 테스트 감시 모드 |

테스트는 MSW로 Supabase API를 흉내 내기 때문에 실제 데이터베이스나 환경 변수 없이 실행됩니다.

## 배포 (Vercel)

1. Vercel에서 이 저장소를 Import 합니다. 프레임워크는 Next.js로 자동 인식됩니다.
2. Project Settings > Environment Variables에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 등록합니다.
3. Deploy를 누르면 `main` 브랜치에 push할 때마다 자동으로 배포됩니다.

## 디렉터리 구조

```text
hidden-kice-store/
├── public/
│   ├── icons/                          GNB, 검색, 페이지네이션 아이콘(SVG)
│   ├── images/
│   │   ├── banners/promo-banner.webp   프로모션 배너
│   │   └── products/                   상품 썸네일
│   └── logo.svg
├── src/
│   ├── app/                            라우팅과 레이아웃
│   │   ├── (shop)/
│   │   │   ├── layout.tsx              GNB + 본문 + Footer
│   │   │   └── store/page.tsx          /store 상품 목록 페이지
│   │   ├── fonts/                      Pretendard 폰트와 라이선스
│   │   ├── globals.css                 Figma 디자인 토큰(Tailwind 테마), 애니메이션
│   │   ├── layout.tsx                  루트 레이아웃, 폰트, 메타데이터
│   │   ├── page.tsx                    / → /store 리다이렉트
│   │   └── providers.tsx               TanStack Query, 토스트 Provider
│   ├── components/                     기능과 무관한 공통 UI
│   │   ├── common/
│   │   │   ├── ComingSoonButton.tsx    누르면 "준비 중" 토스트를 띄우는 버튼
│   │   │   ├── Pagination.tsx
│   │   │   └── Toast.tsx               ToastProvider, useToast
│   │   └── layout/
│   │       ├── Footer.tsx
│   │       └── GNB.tsx
│   ├── features/                       기능 단위 코드
│   │   ├── products/
│   │   │   ├── components/             ProductCatalog(목록 조립), Card, Grid, Search, CategoryFilter
│   │   │   ├── constants/product.ts    페이지 크기, 검색 디바운스 시간
│   │   │   ├── hooks/
│   │   │   │   ├── useProductListParams.ts   URL 쿼리 ↔ 검색 조건
│   │   │   │   └── useProducts.ts            상품, 카테고리 조회 Query 훅
│   │   │   ├── lib/price.ts            할인율 계산, 가격 표시
│   │   │   ├── services/productRepository.ts   Supabase 조회와 화면용 모델 변환
│   │   │   └── types/product.ts        화면용 상품 타입
│   │   └── promotions/
│   │       └── components/PromoBanner.tsx
│   ├── lib/supabase/
│   │   ├── client.ts                   브라우저용 Supabase 클라이언트
│   │   └── database.types.ts           DB 스키마 타입
│   └── tests/
│       ├── fixtures/                   테스트용 상품 데이터
│       ├── integration/                사용자 흐름 통합 테스트
│       ├── setup/                      공통 setup, MSW 서버
│       ├── unit/                       기능별 unit 테스트
│       └── utils/                      가짜 라우터, 가짜 Supabase API, 렌더 헬퍼
├── supabase/
│   ├── migrations/                     스키마, RLS 정책
│   └── seed.sql                        시드 데이터
├── .env.example                        환경 변수 이름
├── next.config.ts
├── vitest.config.mts
└── package.json
```

## 데이터 흐름

```text
URL 쿼리 → useProductListParams → useProducts(TanStack Query)
        → productRepository(Supabase 조회, DB 행 → 화면용 모델 변환) → 컴포넌트
```

## 데이터베이스

| 테이블 | 내용 |
|---|---|
| `categories` | 상품 유형(`code`는 필터용 고유값), 표시 순서, 공개 여부 |
| `products` | 카테고리(외래 키), 이름, 썸네일, 정가, 판매가(원 단위 정수), 표시 순서, 공개 여부 |

- 판매가는 정가보다 클 수 없도록 DB 제약으로 막습니다.
- 할인율은 저장하지 않고 정가와 판매가로 계산합니다(내림).
- RLS: 공개 키로는 공개된 카테고리와, 공개된 카테고리에 속한 공개 상품의 조회만 허용합니다. 추가, 수정, 삭제 권한은 없습니다.
