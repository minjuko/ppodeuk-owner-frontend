# 뽀득뽀득 OWNER Frontend

[![Frontend CI](https://github.com/minjuko/ppodeuk-owner-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/minjuko/ppodeuk-owner-frontend/actions/workflows/ci.yml)

셀프 세차장 예약 서비스 **뽀득뽀득**의 사업자용 웹 애플리케이션입니다. 사업자가 세차장을 등록하고 베이·예약·매출 정보를 관리하는 화면을 담고 있습니다.

> 개인의 주요 담당 저장소는 [USER Frontend](https://github.com/minjuko/ppodeuk-user-frontend)입니다.  
> 이 저장소에서는 팀 프로젝트 당시 **세차장 등록 화면과 초기 입력 UI, 일부 입력·공통 컴포넌트**를 맡았습니다. 이후 코드 품질 개선, 회귀 테스트와 CI 구축도 진행했습니다.

## 프로젝트 정보

| 항목 | 내용 |
| --- | --- |
| 개발 기간 | 2023.09.14 ~ 2023.12.02 |
| 팀 구성 | 6명 (Frontend 3명, Backend 3명) |
| 저장소 역할 | OWNER Frontend |
| 개인 담당 | 세차장 등록 화면·초기 입력 UI, 일부 입력·공통 컴포넌트 |
| 수상 | 카카오 테크 캠퍼스 1기 신규 서비스 개발 프로젝트 대상 |

## 주요 기능

아래는 OWNER Frontend 팀 저장소에 구현된 기능입니다.

- 사업자 회원가입·로그인
- 세차장 입점 신청과 매장 정보 수정
- 세차 베이 조회·상태 변경·삭제
- 예약 현황과 매출 조회
- 인증 상태에 따른 보호 페이지 접근 제어

## 개인 기여

### 팀 프로젝트

- 세차장 등록 화면과 초기 입력 UI 구현
- 입력 요소와 일부 공통 컴포넌트 구현
- 공통 컴포넌트를 조합하는 화면 구성에 참여

### 개선 작업

- 코드 포맷과 ESLint 오류·경고 정리
- 회원가입 비동기 처리와 오류 메시지 보완
- 폼 변경 상태 추적, 입력 검증과 Kakao SDK 미로드 예외 처리 개선
- API 요청 파라미터 처리와 mock 데이터 정리
- Vitest·React Testing Library 기반 회귀 테스트 추가
- GitHub Actions 기반 lint·test·build 자동 검증 구성
- Vite React 플러그인을 `@vitejs/plugin-react-swc`로 일치

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Frontend | React 18, JavaScript, Vite |
| 상태·서버 데이터 | Redux Toolkit, TanStack Query |
| Form | React Hook Form |
| Styling | Tailwind CSS |
| API·Mock | Axios, MSW |
| Test | Vitest, React Testing Library, jsdom |
| Quality | ESLint, Prettier, GitHub Actions |

## 품질 검증

Node.js `v22.20.0`, npm `10.9.3` 환경에서 확인했습니다.

| 검증 항목 | 결과 |
| --- | --- |
| Lint | 오류 0, 경고 0 |
| Test | 6개 파일, 16개 테스트 통과 |
| Production build | 636개 모듈 변환 |
| Main JavaScript | 429.23 kB, gzip 141.46 kB |
| Production dependency audit | 10건 → 0건 |
| Full dependency audit | 56건 (critical 3, 개발·빌드 도구) |

GitHub Actions는 `main` 브랜치 push와 pull request에서 `npm ci`, lint, test, build를 순서대로 실행합니다. Production 의존성 감사는 0건입니다. 전체 감사에 남은 항목은 Storybook·Vitest·Vite·MSW·Tailwind 등 개발·빌드 도구 경로이며, 해결에 major version 변경이 필요해 자동 강제 업데이트하지 않았습니다.

## 실행 방법

### 요구 환경

- Node.js 22
- npm 10

### 환경 변수

```bash
cp .env.example .env.local
```

```env
VITE_API_BASE_URL=https://api.example.com
VITE_KAKAOMAP_API_KEY=your_kakao_javascript_key
```

### 설치 및 실행

```bash
npm ci
npm run dev
```

### 검증 명령

```bash
npm run lint
npm test -- --run
npm run build
```

## 관련 저장소

- [USER Frontend](https://github.com/minjuko/ppodeuk-user-frontend) — 개인 주요 담당, 사용자 예약 흐름
- [Backend](https://github.com/minjuko/ppodeuk-backend) — Backend 팀 구현

## 문서

- [2023년 기존 README 보존본](./docs/archive/README-2023-original.md)
