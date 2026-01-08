# mini-date

Headless range datepicker engine for Next.js 16 + React 19.

## Packages

- `@mini-date/core`
  - 날짜 범위 모델(`DateRange`, `DayCell`)
  - 지역 시간 기반 유틸(`formatLocalYMD`, `parseLocalYMD`, `combineLocalDateTime`)
  - 범위 선택 규칙(`applyRangeClick`), 달력 빌더(`buildMonthGrid`, `startOfWeek`, `addDays`)
  - 계산 유틸(`dDayByDate`, `timeLeftMs`, `formatDuration`, `countRangeDays`)
- `@mini-date/react`
  - `"use client"` 훅 `useRangeCalendar`
  - 달력 6주 그리드, 이전/다음 월 이동, hover 미리보기, disabled 상태 관리
  - UI는 제공하지 않으며 `getDayProps`만 제공해 어떤 디자인에도 맞출 수 있음

## 개발

```bash
yarn install
yarn workspace @mini-date/core build
yarn workspace @mini-date/react build
