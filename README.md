# 🦀 Rust + WASM To-Do 미션

프리코스 **오픈 미션: 낯선 도구 해커톤**을 위해 Rust와 WebAssembly로 초간단 To-Do 애플리케이션을 구현합니다. Rust 로직을 브라우저에 올리고, JS 없이 상태를 관리해보는 것이 핵심 도전 과제입니다.

---

## ✅ 기능 구현 및 테스트 목록

- 기능을 구현하고 대응 테스트를 완료하면 체크박스를 표시합니다.

- **TODO 항목 입력 및 유효성 검사**
    - [x] **기능 구현**
        - [x] 입력창에서 제목을 받는다.
        - [x] 예외 발생: 제목이 비어 있는 경우
        - [x] 예외 발생: 128자 초과 입력
    - [x] **테스트 코드 작성**
        - [x] 정상 입력 시 Todo 생성 테스트
        - [x] 빈 제목 예외 테스트
        - [x] 길이 제한 초과 예외 테스트

- **TODO 추가**
    - [x] **기능 구현**
        - [x] Rust 구조체 기반 Todo 생성
        - [x] 생성 시 고유 ID 부여
        - [x] 리스트 상단에 새 Todo 표시
    - [x] **테스트 코드 작성**
        - [x] ID/내용이 정상적으로 저장되는지 테스트

- **TODO 완료 토글 및 삭제**
    - [x] **기능 구현**
        - [x] 완료 상태 토글
        - [x] 완료 토글 시 시간 기록(optional)
        - [x] 항목 삭제 기능
    - [x] **테스트 코드 작성**
        - [x] 토글 상태가 정상 반영되는지 테스트
        - [x] 삭제 시 리스트가 갱신되는지 테스트

- **상태 필터 및 카운트**
    - [x] **기능 구현**
        - [x] 전체/진행중/완료 필터 버튼
        - [x] 상단에 남은 할 일 갯수 표시
    - [x] **테스트 코드 작성**
        - [x] 필터 로직 단위 테스트
        - [x] 카운트 계산 테스트

- **저장 및 로딩**
    - [x] **기능 구현**
        - [x] LocalStorage 연동으로 새로고침 후에도 유지
        - [x] 초기 진입 시 저장된 Todo 복원
    - [x] **테스트 코드 작성**
        - [x] 직렬화/역직렬화 로직 테스트

---

## 📝 그 동안의 피드백 반영 체크리스트

- [X] `README.md`를 상세히 작성했는가?
- [X] 기능 목록을 정상/예외 상황을 포함해 재검토하고 업데이트했는가?
- [X] 상수/설정 값을 하드코딩하지 않았는가?
- [X] 함수/모듈 분리를 통해 테스트 가능한 단위를 만들었는가?
- [ ] Rust + WASM 도전을 통해 얻은 소감을 정리했는가?

---

## 🎯 학습 및 도전 목표

- Rust로 상태 관리 및 비즈니스 로직을 구현하고, WebAssembly로 브라우저에서 실행
- JS와의 상호작용, `wasm-bindgen` / `wasm-pack` 빌드 파이프라인 이해
- 단위 테스트(예: `wasm-pack test --headless --chrome`)를 통해 기능 검증

---

## ⚙️ 프로그래밍 요구 사항

- **Rust 1.82+**, `wasm-pack` 최신 버전
- 브라우저 빌드 파이프라인: `wasm-pack build --target web --out-dir ../todo_ui/src/wasm`
- 프론트엔드: Vite(바닐라)로 WASM 번들 로딩
- 함수는 단일 책임, 가급적 15줄 이내 유지
- 안전한 상태 공유를 위해 `Rc<RefCell<>>` 대신 명시적 메시지 패턴 고려
- ESLint/Prettier 없이도 포맷 유지 (Rustfmt, Vite 기본 설정)

---

## 📚 도구 및 라이브러리

- Rust 표준 라이브러리 + `wasm-bindgen`
- 선택: `serde` + `serde_wasm_bindgen` (LocalStorage 직렬화용)
- 프론트엔드 최소 의존성: `npm create vite@latest todo-wasm -- --template vanilla`

---

## ⌨️ 입출력/UX 요구 사항

### 입력

- 텍스트 입력 후 `Enter` 또는 `추가` 버튼
- 완료 토글, 삭제 버튼
- 필터 버튼 (All / Active / Done)

### 출력

```
✨ 오늘의 할 일 (3)
- [ ] Rust + wasm-pack 설치하기
- [x] README 초안 작성
- [ ] UI 와이어프레임 만들기

필터: [전체] [진행중] [완료]
```

---

## 🚀 진행 및 제출 방법

1. `README.md`에 기능 목록을 정리한다. (현재 단계)
2. Rust 로직 → WASM 빌드 → Vite 연동 순으로 단계별 개발
3. 기능 단위로 `git add`, `git commit`, `git push`
4. 체크리스트/테스트 모두 통과 후 결과물 + 소감문 제출

---

## 🌐 배포

- GitHub Pages: https://tldjfj123.github.io/TO_DO/
- 재배포: `cd todo_ui && npm run deploy`

---

## 🚨 제출 전 최종 체크리스트

- [x] `wasm-pack test --headless --chrome` 통과
- [x] `npm run build` 성공
- [x] `npm run test` (Vitest) 통과
- [x] UI 요구 사항 및 예외 처리 확인
- [ ] README/소감문 최신화

---

## 🗒️ 소감문 아이디어 메모

- Rust에서 브라우저 이벤트와 상태를 다루며 느낀 점
- wasm-bindgen/wasm-pack 파이프라인 세팅 과정의 시행착오
- JS 대신 Rust로 로직을 작성했을 때의 장단점
- 2주간 학습한 Rust 언어 특성과 borrow checker 경험