You are generating a React frontend for an existing e-learning API called CourseHub.

STACK: React (functional components, hooks only), Tailwind CSS for styling, native fetch (no axios). Single file component, default export.

API BASE URL: http://localhost:3000/api or render URL

ENDPOINTS:
- GET /courses → returns array of { _id, title, instructor, price, description }
- GET /courses/:id → returns single course object
- POST /auth/login → body { email, password } → returns { token, user: { id, name, email, role } }
- POST /auth/register → body { name, email, password, role } → returns same shape as login
- POST /courses → protected, header "Authorization: Bearer <token>" → body { title, price, description } → creates course (instructors only)

REQUIREMENTS:
1. Course listing page: fetch and display all courses as cards (title, instructor, price)
2. Client-side search input that filters displayed courses by title (no API call, filter in-memory)
3. Login form: email + password fields, POST to /auth/login, store returned token in React state (NOT localStorage - keep in memory)
4. Once logged in, show logged-in user's name in a header
5. If logged-in user's role is "instructor", show a "Create Course" form that POSTs to /courses with the Bearer token
6. Handle loading and error states for all fetch calls (simple inline text, no toast library)
7. Basic responsive layout using Tailwind grid/flex only - no custom CSS

CONSTRAINTS:
- Do not use localStorage or sessionStorage
- Do not use any UI library (no shadcn, no MUI) - plain Tailwind utility classes only
- Do not add features beyond what's listed above
- Do not explain the code — return ONLY the code, no preamble or commentary