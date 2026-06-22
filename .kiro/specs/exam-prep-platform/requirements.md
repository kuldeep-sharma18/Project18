# Requirements Document

## Introduction

KDs is a Cracku-style exam preparation platform built as a React + Vite single-page application. It targets MBA entrance exam aspirants (CAT, XAT, SNAP) and delivers a full end-to-end coaching experience: branded login, navigation, a test engine, analytics dashboard, past papers browser, formulas handbook, practice zone, and a courses catalog. The platform persists user sessions and test history in `localStorage` and fetches live questions from a Node.js/Express backend API. The project already has working component stubs for all major screens; this requirements document captures the full behaviour that must hold across the complete integrated platform.

---

## Glossary

- **Platform**: The KDs React + Vite single-page application running in the browser.
- **Student**: An authenticated user of the Platform.
- **Session**: A persisted login record stored in `localStorage` under the key `kds_logged_in_user`.
- **Attempt**: A completed or auto-submitted test recorded in `localStorage` under the key `quant_rush_attempts`.
- **Test**: A timed, scored sequence of MCQ questions presented by the Test Engine.
- **Mock**: A full-length or curated test available in the Mocks Catalog.
- **Sectional**: A configurable topic- and difficulty-filtered test launched from the Test Setup screen.
- **Past Paper**: A static solved question set from a previous official CAT/XAT exam year.
- **Question**: A single MCQ item with `id`, `category`, `difficulty`, `questionText`, `options[]`, `correctOptionIndex`, and `explanation` fields.
- **QUESTION_POOL**: The static client-side question dataset exported from `src/data/questions.js`.
- **API_Questions**: Questions fetched at runtime from `GET /api/questions` on the Express backend.
- **Score**: The integer result of `(correctCount × 3) + (incorrectCount × −1)`.
- **Navigator**: The sticky top navigation bar rendered on all screens except during an active Test.
- **OTP**: A 4-digit one-time passcode used to simulate mobile verification during login.
- **Google_Auth**: The simulated Google login flow that produces a fixed guest email payload.
- **Attempt_Record**: The JSON object saved after each Test containing score, answers, timing, and category performance data.
- **Dashboard**: The post-login landing screen showing KPI cards, score trend chart, syllabus breakdown, and test history.
- **Test_Engine**: The React component that renders questions one at a time, tracks time, and calculates scores on submission.
- **Question_Palette**: The grid of numbered buttons in the Test Engine right panel showing answered/unanswered/bookmarked status.
- **OnScreenCalculator**: The floating pop-up calculator accessible during a Test.
- **LearnBook**: The formulas handbook screen.
- **PracticeZone**: The single-question live quiz that streams questions from the backend API.
- **CoursesCatalog**: The screen listing purchasable coaching packages with coupon-based discounts.

---

## Requirements

### Requirement 1: Authentication and Session Persistence

**User Story:** As a prospective student, I want to log in using my mobile number + OTP, Google account, or email address, so that I can access the platform and have my session remembered across page reloads.

#### Acceptance Criteria

1. WHEN a user visits the Platform without a valid Session, THE Platform SHALL display the KDsLogin screen and SHALL NOT render any other application screen.
2. WHEN a user submits a valid 10-digit mobile number and clicks "Send OTP", THE Platform SHALL generate a 4-digit OTP, display it to the user via a browser alert, and present the OTP verification input field.
3. IF a user submits an OTP that matches the generated code or the bypass code "1234", THEN THE Platform SHALL create a Session payload containing `identifier`, `loginType`, `loginTime`, and `avatarSeed` fields and persist it to `localStorage` under key `kds_logged_in_user`.
4. IF a user submits an OTP that does not match the generated code and is not "1234", THEN THE Platform SHALL display an error message and SHALL NOT create a Session.
5. WHEN a user clicks "Continue with Google", THE Platform SHALL create a Session with identifier `premium.student@google.com` and loginType `Google Authentication` and persist it to `localStorage`.
6. WHEN a user toggles to email login mode and submits a valid email address, THE Platform SHALL initiate the same OTP flow using the email address as the `identifier` and set loginType to `Email`.
7. WHEN the Platform loads and `localStorage` contains a valid Session under `kds_logged_in_user`, THE Platform SHALL restore the session and navigate directly to the Dashboard without showing the login screen.
8. THE KDsLogin screen SHALL display a left panel with at least five feature highlights (Free Mocks, Study Materials, Exam Updates, Mentorship, and Years of Experience) and a right panel with the login form.
9. WHEN a logged-in Student clicks "Logout", THE Platform SHALL display a confirmation modal, and upon confirmation SHALL remove the Session from `localStorage` and return to the login screen.

---

### Requirement 2: Navigation Bar

**User Story:** As a logged-in student, I want a clearly labelled navigation bar at the top of every non-test screen, so that I can move between major sections of the platform instantly.

#### Acceptance Criteria

1. WHILE a Student is authenticated and the current view is not "TEST", THE Navigator SHALL be visible and sticky at the top of the viewport.
2. THE Navigator SHALL contain navigation buttons for: Dashboard, Mocks, Sectionals, Past Papers, Learn, Practice Zone, and Courses (with a promotional label such as "70% Off").
3. WHEN a Student clicks any Navigator button, THE Platform SHALL render the corresponding view and update the active button styling to distinguish it from inactive buttons.
4. THE Navigator SHALL display the authenticated Student's identifier and a Logout button in the user profile section.
5. WHILE a Student is taking a Test (currentView === "TEST"), THE Navigator SHALL be hidden.
6. THE Navigator SHALL display a top promotional banner strip showing the current discount offer above the navigation links.

---

### Requirement 3: Dashboard and Analytics

**User Story:** As a student, I want to see my test history, performance KPIs, and score trends on the Dashboard, so that I can track my progress over time.

#### Acceptance Criteria

1. WHEN a Student navigates to the Dashboard, THE Dashboard SHALL display four KPI cards showing: total mocks taken, global accuracy percentage, highest score achieved, and estimated percentile.
2. WHEN the Attempt history contains at least one Attempt_Record, THE Dashboard SHALL render a chronological SVG score trend line chart plotting each attempt's score against its date.
3. THE Dashboard SHALL display a syllabus breakdown panel listing per-topic accuracy percentages derived from all Attempt_Records' `categoryPerformance` data.
4. THE Dashboard SHALL provide three sub-tabs: "Dynamic Analytics View", "Selected Test Review", and "Comprehensive Exam Logs".
5. WHEN a Student clicks "Selected Test Review" and the selected Attempt has a non-empty `answers` array, THE Dashboard SHALL display each question with the Student's selected answer, whether it was correct or incorrect, and the full explanation.
6. WHEN the Attempt history is empty, THE Dashboard SHALL display an empty-state UI with a "Start Live Sectional" button and a "Load Demo Records" button.
7. WHEN a Student clicks "Load Demo Records", THE Dashboard SHALL load the PRE_POPULATED_MOCKS array into the Attempt history and persist it to `localStorage`.
8. WHEN a Student clicks "Reset Records", THE Platform SHALL display a confirmation modal, and upon confirmation SHALL clear all Attempt_Records from `localStorage` and reset the Dashboard to the empty state.
9. WHEN a Student clicks "New Mock Session" on the Dashboard, THE Platform SHALL navigate to the Sectionals (TestSetup) screen.
10. THE Dashboard estimated percentile SHALL be calculated from the Student's average score using a deterministic lookup table (e.g. score ≥ 25 → "99.2 %ile").

---

### Requirement 4: Test Setup (Sectionals)

**User Story:** As a student, I want to configure a custom sectional test by selecting question count, topic category, difficulty, and time limit before starting, so that I can practise targeted areas.

#### Acceptance Criteria

1. WHEN a Student opens the Sectionals screen, THE Test_Setup SHALL display controls to select number of questions (5, 10, 15, or 20), syllabus topic (All or any category present in QUESTION_POOL), difficulty (All, Easy, Medium, or Hard), and time allocation (5, 10, 15, 20, 30, or 45 minutes).
2. WHEN a Student clicks "Begin Quant Rush Mock", THE Test_Setup SHALL filter QUESTION_POOL by the selected category and difficulty, shuffle the filtered results, and pass up to the selected number of questions and the time limit in seconds to the Test Engine.
3. IF no questions match the selected category and difficulty filters, THEN THE Test_Setup SHALL display an alert informing the Student to adjust the criteria and SHALL NOT start the Test.
4. THE Test_Setup SHALL display the total number of questions in QUESTION_POOL as a read-only count.
5. THE Test_Setup SHALL display an instructions card listing the marking scheme (+3 correct, −1 incorrect, 0 unanswered), the countdown timer policy, calculator availability, and the no-tab-switching rule.

---

### Requirement 5: Mocks Catalog

**User Story:** As a student, I want to browse and launch pre-built mock tests including a live API-driven mock, so that I can attempt structured full-length exams.

#### Acceptance Criteria

1. THE Mocks_Catalog SHALL display a list of at least five mock exam cards, each showing title, description, question count, time limit, difficulty level, and category.
2. WHEN a Student clicks "Begin Mock" on a free mock card, THE Platform SHALL start the Test using the questions and time limit defined for that mock.
3. WHEN a Student clicks "Unlock" on a premium mock card, THE Platform SHALL display an alert directing the Student to the Courses screen and SHALL NOT start a Test.
4. WHEN a Student launches the "LIVE API-Driven" mock, THE Platform SHALL fetch questions from `GET /api/questions` and start the Test with the returned questions.
5. IF the `GET /api/questions` request fails or returns an empty list, THEN THE Platform SHALL log the error, alert the Student, and fall back to a slice of QUESTION_POOL to start the Test.
6. THE Mocks_Catalog SHALL display a "Next Live Mock Starts in" countdown badge and a proctored guidelines panel at the bottom of the screen.

---

### Requirement 6: Test Engine

**User Story:** As a student taking a test, I want to answer MCQ questions one at a time under a live countdown timer, navigate freely across questions, bookmark questions, use an on-screen calculator, and submit to receive an immediate score, so that the experience replicates a real exam.

#### Acceptance Criteria

1. WHEN a Test starts, THE Test_Engine SHALL display the first question, a live countdown timer initialised to `timeLimitSeconds`, a question palette, and a "Submit & Analyze" button.
2. WHILE a Test is active, THE Test_Engine SHALL decrement the countdown timer by one second every second and SHALL increment a per-question time tracker for the currently displayed question.
3. WHEN the countdown timer reaches zero, THE Test_Engine SHALL auto-submit the Test and pass the Attempt_Record to the parent via the `onSubmitTest` callback.
4. WHEN a Student selects an MCQ option, THE Test_Engine SHALL visually highlight the selected option and record it in the local `userAnswers` state.
5. WHEN a Student clicks "Clear Answer", THE Test_Engine SHALL deselect the current question's answer.
6. WHEN a Student clicks "Save & Next", THE Test_Engine SHALL advance to the next question.
7. WHEN a Student clicks "Mark for Review", THE Test_Engine SHALL toggle the bookmark flag for the current question and reflect this in the Question_Palette.
8. THE Question_Palette SHALL colour-code each question button: green for answered-and-saved, dark indigo for answered-and-marked, light indigo for marked-not-answered, grey for unvisited, and highlighted ring for the current question.
9. WHEN a Student clicks a Question_Palette button, THE Test_Engine SHALL navigate directly to that question.
10. WHEN a Student clicks "Submit & Analyze", THE Test_Engine SHALL display a confirmation modal summarising total questions, completed responses, and time taken, and upon confirmation SHALL calculate and submit the Attempt_Record.
11. THE Attempt_Record SHALL contain: `id`, `date`, `totalQuestions`, `unansweredCount`, `correctCount`, `incorrectCount`, `score` (applying +3/−1/0 scheme), `maxScore`, `accuracy`, `timeTakenSeconds`, `timeLimitSeconds`, `categoryPerformance`, `answers`, and `questions`.
12. WHEN a Student clicks the calculator icon, THE Test_Engine SHALL toggle the OnScreenCalculator overlay.
13. WHEN a Student clicks "Discard Test", THE Test_Engine SHALL call the `onCancelTest` callback.
14. THE Test_Engine top bar SHALL be visible during the Test and SHALL hide the Navigator.

---

### Requirement 7: Score Calculation Correctness

**User Story:** As a student, I want my test score to be calculated fairly and accurately using the standard marking scheme, so that my results reflect my true performance.

#### Acceptance Criteria

1. THE Platform SHALL calculate Score as `(correctCount × 3) + (incorrectCount × −1)` where unanswered questions contribute 0.
2. THE Platform SHALL calculate `accuracy` as `(correctCount / (correctCount + incorrectCount)) × 100` where the denominator is the count of answered (not unanswered) questions only.
3. IF all questions are unanswered, THEN THE Platform SHALL set accuracy to 0 and score to 0.
4. THE Platform SHALL set `maxScore` to `totalQuestions × 3`.
5. THE Platform SHALL derive `timeTakenSeconds` as `timeLimitSeconds − timeLeft` at the moment of submission.

---

### Requirement 8: User Data Persistence

**User Story:** As a student, I want my login session and all test attempts to survive page reloads and browser restarts, so that I never lose my progress.

#### Acceptance Criteria

1. THE Platform SHALL persist the Session payload to `localStorage` key `kds_logged_in_user` immediately after a successful login.
2. THE Platform SHALL persist the full Attempts array to `localStorage` key `quant_rush_attempts` immediately after each Test is submitted.
3. WHEN the Platform loads, THE Platform SHALL read `kds_logged_in_user` and `quant_rush_attempts` from `localStorage` and restore them to application state.
4. IF `localStorage` is unavailable or throws an exception, THE Platform SHALL log a warning to the console and continue operation with in-memory state only.
5. WHEN a Student resets records, THE Platform SHALL write an empty array to `quant_rush_attempts` in `localStorage`.
6. WHEN a Student logs out, THE Platform SHALL remove `kds_logged_in_user` from `localStorage`.

---

### Requirement 9: Questions API Integration

**User Story:** As a platform operator, I want the Express backend to serve a `/api/questions` endpoint that returns a structured list of MCQ questions, so that dynamic mocks and the Practice Zone always have fresh content.

#### Acceptance Criteria

1. THE Express_Server SHALL expose a `GET /api/questions` endpoint that returns a JSON object with shape `{ success: true, questions: Question[] }`.
2. EACH Question returned by the API SHALL contain fields: `id`, `category`, `difficulty`, `questionText`, `options` (array of strings), `correctOptionIndex` (integer), and `explanation`.
3. THE Express_Server SHALL return at least 10 questions from the `/api/questions` endpoint.
4. WHEN the Platform receives a successful API response, THE Platform SHALL use the returned `questions` array as the question set for the requesting Test or Practice session.
5. IF the API response has `success: false` or the `questions` array is empty or missing, THE Platform SHALL treat the response as a failure and apply the fallback behaviour defined in Requirement 5.5.

---

### Requirement 10: Past Papers Browser

**User Story:** As a student, I want to browse solved questions from previous official CAT exams, so that I can learn from real exam patterns and step-by-step solutions.

#### Acceptance Criteria

1. THE Past_Papers screen SHALL display a tab selector with at least three exam year entries (e.g. CAT 2021, CAT 2022, CAT 2023).
2. WHEN a Student selects a year tab, THE Past_Papers screen SHALL display all solved questions for that year, each showing the question text, multiple-choice options, and the correct answer highlighted.
3. WHEN a Student clicks "View Step-by-Step Solution" for a question, THE Past_Papers screen SHALL expand an explanation panel below that question.
4. WHEN a Student clicks "Hide Step-by-Step Methodology" for an expanded question, THE Past_Papers screen SHALL collapse the explanation panel.
5. THE Past_Papers screen SHALL display the exam title and metadata (source/year description) at the top of each year's question list.

---

### Requirement 11: Formulas Handbook (LearnBook)

**User Story:** As a student, I want to browse and search quantitative formulas categorised by topic, so that I can quickly revise the theorems I need for the exam.

#### Acceptance Criteria

1. THE LearnBook screen SHALL display formula cards covering at least the categories: Arithmetic, Algebra, Geometry, and Number Systems.
2. WHEN a Student types in the search input, THE LearnBook SHALL filter displayed formula cards in real time to show only cards whose title or formula text matches the search term (case-insensitive).
3. WHEN a Student clicks a category filter button, THE LearnBook SHALL display only formula cards belonging to that category.
4. EACH formula card SHALL display: category badge, title, formula in a monospace code block, a plain-language explanation, and a shortcut tip.
5. IF no formula cards match the current search and category filters, THE LearnBook SHALL display an empty-state message.

---

### Requirement 12: Practice Zone

**User Story:** As a student, I want to practise one question at a time in an untimed quiz mode with instant feedback and explanations, so that I can learn at my own pace using live API questions.

#### Acceptance Criteria

1. WHEN the Practice_Zone screen mounts, THE Practice_Zone SHALL fetch questions from `GET /api/questions` and display the first question.
2. WHEN a Student selects an option and clicks "Submit Answer", THE Practice_Zone SHALL reveal correct/incorrect styling on each option, update the running success rate counter, and display the full explanation.
3. WHEN a Student clicks "Next Question →", THE Practice_Zone SHALL advance to the next question and clear the previous selection and feedback.
4. IF the Practice_Zone is on the last question and the Student clicks "Next Question →", THE Practice_Zone SHALL wrap around and display the first question again.
5. IF the API request fails, THE Practice_Zone SHALL display an error panel with a "Retry Connection" button.
6. WHEN a Student clicks the refresh icon, THE Practice_Zone SHALL reset the session score to zero and re-fetch questions from the API.

---

### Requirement 13: Courses Catalog

**User Story:** As a student, I want to browse available coaching packages, apply a discount coupon, and enrol in a course, so that I can purchase the premium preparation content that fits my needs.

#### Acceptance Criteria

1. THE Courses_Catalog SHALL display at least three course cards, each showing title, original price, discount price (calculated from the applied coupon), duration, and a list of included features.
2. THE Courses_Catalog SHALL display a coupon input bar where a Student can enter a code and click "Apply Code".
3. WHEN a Student enters the code "KD70" and clicks "Apply Code", THE Courses_Catalog SHALL apply a 70% discount to all course prices and display the discounted amounts.
4. WHEN a Student enters the code "FREE100" and clicks "Apply Code", THE Courses_Catalog SHALL apply a 100% discount making all course prices ₹0.
5. IF a Student enters an invalid coupon code, THE Courses_Catalog SHALL display an alert informing the Student of the valid codes.
6. WHEN a Student clicks "Proceed & Buy Online" for a course, THE Courses_Catalog SHALL mark that course as enrolled and display a confirmation message mentioning the Student's email address.
7. AFTER a course is enrolled, THE Courses_Catalog SHALL change the enrol button to a "✓ Enrolled & Ready" disabled state for that course.

---

### Requirement 14: Global Confirmation Modal

**User Story:** As a student, I want all destructive or irreversible actions (logout, reset records, discard test) to require explicit confirmation, so that I never lose data accidentally.

#### Acceptance Criteria

1. THE Platform SHALL display a modal dialog before executing any of the following: logout, reset all records, restore sample data, and discard an active test.
2. EACH confirmation modal SHALL display a title, a descriptive message, a "Confirm" action button, and a "Cancel" button.
3. WHEN a Student clicks "Cancel" in a confirmation modal, THE Platform SHALL close the modal and take no destructive action.
4. WHEN a Student clicks outside the confirmation modal backdrop, THE Platform SHALL close the modal without taking any action.
5. Destructive modals (logout, reset, discard test) SHALL visually distinguish the confirm button using a red/danger style.

---

### Requirement 15: Responsive Layout and Accessibility

**User Story:** As a student on any device, I want the platform to be usable on both desktop and mobile viewports, so that I can study on the go.

#### Acceptance Criteria

1. THE Platform SHALL render all screens using responsive Tailwind CSS grid and flex layouts that adapt between a single-column layout on small viewports (< 768px) and multi-column layouts on medium and large viewports.
2. THE Navigator SHALL collapse its navigation links to a wrapping flex layout on small viewports rather than truncating or overflowing.
3. THE Test_Engine left panel (question area) and right panel (palette + submit) SHALL stack vertically on small viewports and display side-by-side on large viewports (≥ 1024px).
4. ALL interactive controls (buttons, inputs, selects) SHALL have visible focus indicators to support keyboard navigation.
5. ALL non-decorative images SHALL have descriptive `alt` attributes.
