# PeopleDesk HRMS Frontend: Project Structure

A guide to every folder and file in the project: what it does, who uses it, and how to extend it.

---

## 1. Overview

| Item | Choice |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Routing | React Router 6 |
| Styling | One plain CSS file (`src/styles.css`), no UI library |
| State | React Context for auth, a small `useApi` hook for server data |
| Backend | Built-in mock server now, real API later (switch in `.env`) |

**Core idea:** after login, the user's **permissions** decide which sidebar items, pages and actions they get. There is no role picker. The same codebase serves both **Employee** and **HR**.

---

## 2. Full tree

```
hrms-frontend/
├── index.html
├── package.json
├── vite.config.js
├── .env
├── .env.example
├── .gitignore
├── README.md
├── PROJECT_STRUCTURE.md
│
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles.css
    │
    ├── config/
    │   └── menu.js
    │
    ├── lib/
    │   ├── api.js
    │   └── services.js
    │
    ├── mock/
    │   └── mockServer.js
    │
    ├── hooks/
    │   └── useApi.js
    │
    ├── utils/
    │   └── format.js
    │
    ├── components/
    │   ├── ui.jsx
    │   ├── Layout.jsx
    │   ├── ProtectedRoute.jsx
    │   └── LeaveRows.jsx
    │
    └── features/
        ├── auth/
        │   ├── AuthContext.jsx
        │   └── LoginPage.jsx
        ├── employee/
        │   ├── EmployeeDashboard.jsx
        │   ├── MyLeavePage.jsx
        │   ├── MyAttendancePage.jsx
        │   ├── PayslipsPage.jsx
        │   ├── ProfilePage.jsx
        │   ├── CheckInCard.jsx
        │   └── ApplyLeaveDialog.jsx
        └── hr/
            ├── HRDashboard.jsx
            ├── EmployeesPage.jsx
            ├── LeaveRequestsPage.jsx
            ├── HRAttendancePage.jsx
            ├── PayrollPage.jsx
            └── SettingsPage.jsx
```

---

## 3. Root files

| File | Purpose |
|---|---|
| `index.html` | The single HTML page. Contains `<div id="root">`, loads the Figtree font, and loads `src/main.jsx`. |
| `package.json` | Lists dependencies (`react`, `react-dom`, `react-router-dom`, `vite`, `@vitejs/plugin-react`) and scripts (`dev`, `build`, `preview`). |
| `vite.config.js` | Enables the React plugin and sets the dev server port to 5173. |
| `.env` | Local settings. **Not committed to Git.** Keys must start with `VITE_`. |
| `.env.example` | Template to copy to `.env`. Safe to commit. |
| `.gitignore` | Ignores `node_modules`, `dist` and `.env`. |
| `README.md` | Quick start and how to connect the backend. |

### Environment variables

| Variable | Values | Meaning |
|---|---|---|
| `VITE_USE_MOCK` | `true` / `false` | `true` uses the fake backend in `src/mock`. `false` calls your real API. |
| `VITE_API_URL` | URL | Base URL of your backend, for example `http://localhost:8000/api`. Used only when `VITE_USE_MOCK=false`. |

Restart `npm run dev` after changing `.env`.

---

## 4. `src/` entry files

### `main.jsx`
Starts the app. Renders `<App />` inside `<BrowserRouter>` and imports `styles.css`. You rarely edit this file.

### `App.jsx`
The map of the whole app. It does three things:
1. **Providers:** wraps everything in `ToastProvider` (notifications) and `AuthProvider` (logged-in user).
2. **Routes:** declares every URL and the page it shows.
3. **Role-based choice:** `/dashboard` and `/attendance` show a different page for HR and employees, based on a permission check.

```jsx
const Dashboard = () => (can("employee:read_all") ? <HRDashboard /> : <EmployeeDashboard />);
```

Each protected route is wrapped with `ProtectedRoute` and the permission it needs.

### `styles.css`
All styling in one file. It uses CSS variables (`--teal`, `--ink`, `--line` and so on) for the colors, plus classes for the layout (`.app`, `.card`, `.grid`), buttons (`.btn`, `.btn.p`), status tags (`.tag.ok`, `.tag.wait`, `.tag.no`), table, modal, toast and the mobile breakpoint at 800px. Change the colors at the top of this file to rebrand.

---

## 5. `config/`

### `menu.js`
The sidebar definition. An array of items:

```js
{ to: "/payroll", label: "Payroll", icon: "money", permission: "payroll:run" }
```

- `to`: the URL.
- `label`: the text in the sidebar.
- `icon`: a key from the icon list in `components/ui.jsx`.
- `permission`: the user needs this permission to see the item. An item with no permission shows to everyone.

`Layout.jsx` filters this list by the current user's permissions. That is why employees and HR see different menus from the same file.

---

## 6. `lib/`: the network layer

### `api.js`
The **only** file that calls `fetch`. It does the following:
- Keeps the access token in memory (`setToken`). It is never stored in localStorage.
- Sends `Authorization: Bearer <token>` and `credentials: "include"` so the httpOnly refresh cookie travels with the request.
- Turns failed responses into `Error` objects with a readable `message` and a `status`.
- On a `401`, tries `POST /auth/refresh` once, then retries the request. If that fails, it redirects to `/login`.
- When `VITE_USE_MOCK` is not `false`, it routes the request to `mockServer.js` instead of the network.

It exports `request()` and a small `api` object with `get`, `post`, `patch`, `put` and `del`.

### `services.js`
One named function per backend endpoint, grouped by area. **This is the contract with your backend.**

| Group | Functions → endpoint |
|---|---|
| `auth` | `login` → `POST /auth/login`<br>`signup` → `POST /auth/signup`<br>`refresh` → `POST /auth/refresh`<br>`logout` → `POST /auth/logout` |
| `me` | `summary` → `GET /me/summary`<br>`profile` → `GET /me/profile`<br>`saveProfile` → `PATCH /me/profile` |
| `leave` | `balances` → `GET /leave/balances`<br>`list(status)` → `GET /leave/requests?status=`<br>`apply` → `POST /leave/requests`<br>`cancel(id)` → `DELETE /leave/requests/:id`<br>`decide(id, status)` → `PATCH /leave/requests/:id` |
| `attendance` | `get` → `GET /attendance`<br>`checkIn` → `POST /attendance/check-in`<br>`today` → `GET /attendance/today` |
| `payslips` | `list` → `GET /payslips`<br>`get(id)` → `GET /payslips/:id` |
| `hr` | `summary` → `GET /hr/summary` |
| `employees` | `list` → `GET /employees`<br>`create` → `POST /employees` |
| `payroll` | `current` → `GET /payroll/runs/current`<br>`advance` → `POST /payroll/runs/current/advance` |
| `settings` | `policies` → `GET /settings/leave-policies`<br>`savePolicies` → `PUT /settings/leave-policies`<br>`roles` → `GET /roles` |

Pages import from here and never write URLs themselves.

---

## 7. `mock/mockServer.js`

A fake backend that runs inside the browser so you can build the UI before the API exists.

- Holds an in-memory database: users, leave requests, employees, today's attendance, leave policies and the payroll step.
- Has one handler per endpoint, matched by method and URL pattern.
- Adds a 250 ms delay so loading states are visible.
- **Enforces permissions and data scope like a real backend would.** For example, `GET /leave/requests` returns all requests to HR but only the caller's own to an employee. Actions without permission return `403`.
- Decides the role at signup: only emails in `HR_EMAILS` become HR. Everyone else is an employee. In your real system HR assigns roles.
- Data resets on page reload. The session survives a refresh through `sessionStorage`.

**Delete this folder** (and its import in `api.js`) once your backend is live. Use it as the reference for request and response shapes.

---

## 8. `hooks/useApi.js`

A small hook for loading data:

```js
const q = useApi(() => leave.list(), []);
// q.data, q.loading, q.error, q.reload()
```

- Runs the call on mount and whenever the dependency list changes.
- Keeps old data visible while reloading.
- `reload()` re-fetches, which pages call after any change (approve, cancel, add).

It is used together with `<Async q={q}>` from `ui.jsx`, which shows the loading text, the error with a "Try again" button, or the content.

---

## 9. `utils/format.js`

Small helpers. Currently `inr(n)`, which formats a number as Indian rupees (`₹1,63,68,000`). Add date helpers here later.

---

## 10. `components/`: shared pieces

### `ui.jsx`
The small UI toolkit. Everything else is built from these:

| Export | Use |
|---|---|
| `Icon` | Sidebar line icons (dashboard, calendar, clock, money, user, users, gear). |
| `PageHead` | Page title and subtitle on the left, an optional action or filter on the right. |
| `Card` | White bordered box with an optional title. |
| `Stat` | Big number, small label, optional progress bar. |
| `Tag` | Colored status pill. Maps Approved, Present, Active to green; Pending, Late, On leave, Probation to amber; Rejected and Absent to red. |
| `Pills` | Filter buttons such as Pending / All. |
| `Empty` | Friendly empty-state text. |
| `Async` | Handles loading, error and success states for a `useApi` result. |
| `Modal` | Dialog built on the native `<dialog>` element. Children render only while open, so forms reset. |
| `ToastProvider` / `useToast` | The dark confirmation message at the bottom of the screen. |

### `Layout.jsx`
The page frame for logged-in users: the left sidebar (logo, filtered menu, user box with Log out) and the content area where the current page renders (`<Outlet />`). It also shows "HR" or "Employee" under the user's name.

### `ProtectedRoute.jsx`
The route guard. Order of checks:
1. Still restoring the session → show "Loading…".
2. Not logged in → redirect to `/login`, remembering the page they wanted.
3. Logged in but lacking the required permission → redirect to `/dashboard`.
4. Otherwise render the page.

> This is a convenience for users. **The backend must enforce the same rules.** Anyone can call the API directly.

### `LeaveRows.jsx`
Two row components used on several pages:
- `LeaveRow`: leave type, dates, days, status tag and an optional action such as Cancel.
- `ReviewRow`: name, department, leave details, with Approve and Reject buttons.

---

## 11. `features/`: pages grouped by area

### `features/auth/`

**`AuthContext.jsx`** holds the logged-in user for the whole app.
- On load, calls `auth.refresh()` to restore the session.
- Provides `user`, `loading`, `login()`, `signup()`, `logout()` and `can(permission)`.
- Stores the access token in memory through `setToken`.
- Use it anywhere with `const { user, can } = useAuth()`.

**`LoginPage.jsx`** has the Log in / Sign up tabs, validation, a loading state on the button and an error message area. After success, it returns the user to the page they originally wanted, or to `/dashboard`. It shows the demo account hint only in mock mode.

### `features/employee/`: pages for regular users

| File | Page |
|---|---|
| `EmployeeDashboard.jsx` | Greeting, two leave balances, days present, net pay, check-in card, recent leave requests. |
| `MyLeavePage.jsx` | Three balances, leave history with Cancel on pending items, upcoming holidays, Apply dialog. |
| `MyAttendancePage.jsx` | Check-in card, month totals, month calendar (present, late, weekend, future), recent days table. |
| `PayslipsPage.jsx` | List of months; selecting one shows the earnings and deductions breakdown. |
| `ProfilePage.jsx` | Read-only HR fields and an editable phone number. |
| `CheckInCard.jsx` | Shared card with a live clock and Check in / Check out button. Used by the dashboard and attendance page. |
| `ApplyLeaveDialog.jsx` | Shared leave request form. Used by the dashboard and My leave. |

### `features/hr/`: pages for HR

| File | Page |
|---|---|
| `HRDashboard.jsx` | Company stats, leave requests to review (approve or reject), headcount by department. |
| `EmployeesPage.jsx` | Searchable table, Add employee dialog, employee detail dialog. |
| `LeaveRequestsPage.jsx` | Pending / All filter, approve and reject. |
| `HRAttendancePage.jsx` | Today's counts, status filter, check-in table. |
| `PayrollPage.jsx` | Run totals and the five-step payroll checklist. |
| `SettingsPage.jsx` | Editable yearly leave allowances and a read-only access-by-role table. |

---

## 12. Routes, files, permissions and endpoints

| Sidebar item | URL | File (employee / HR) | Permission | Main endpoints |
|---|---|---|---|---|
| Dashboard | `/dashboard` | `EmployeeDashboard` / `HRDashboard` | none (content depends on permission) | `/me/summary`, `/attendance`, `/hr/summary`, `/leave/requests` |
| My leave | `/leave` | `MyLeavePage` | `leave:apply` | `/leave/balances`, `/leave/requests` |
| Employees | `/employees` | `EmployeesPage` | `employee:read_all` | `/employees` |
| Leave requests | `/leave-requests` | `LeaveRequestsPage` | `leave:manage_all` | `/leave/requests`, `PATCH /leave/requests/:id` |
| Attendance | `/attendance` | `MyAttendancePage` / `HRAttendancePage` | none (content depends on permission) | `/attendance`, `/attendance/check-in`, `/attendance/today` |
| Payslips | `/payslips` | `PayslipsPage` | `payroll:view_own` | `/payslips`, `/payslips/:id` |
| Payroll | `/payroll` | `PayrollPage` | `payroll:run` | `/payroll/runs/current`, `.../advance` |
| My profile | `/profile` | `ProfilePage` | `profile:own` | `/me/profile` |
| Settings | `/settings` | `SettingsPage` | `settings:manage` | `/settings/leave-policies`, `/roles` |

---

## 13. Roles and permissions

The login response returns the user with a `permissions` list. The frontend only checks permission codes, never role names.

| Permission | Employee | HR |
|---|:-:|:-:|
| `leave:apply` | ✓ | – |
| `attendance:own` | ✓ | – |
| `payroll:view_own` | ✓ | – |
| `profile:own` | ✓ | ✓ |
| `employee:read_all` | – | ✓ |
| `leave:manage_all` | – | ✓ |
| `attendance:read_all` | – | ✓ |
| `payroll:run` | – | ✓ |
| `settings:manage` | – | ✓ |

**Expected shape of the login, signup, refresh response:**

```json
{
  "accessToken": "eyJ...",
  "user": {
    "id": 12,
    "name": "Asha Rao",
    "email": "asha@company.com",
    "roles": ["employee"],
    "permissions": ["leave:apply", "attendance:own", "payroll:view_own", "profile:own"]
  }
}
```

---

## 14. How data flows

### A normal request
```
Page  →  services.js  →  api.js  →  mockServer.js   (VITE_USE_MOCK=true)
                                 →  your backend     (VITE_USE_MOCK=false)
```

### Login
```
LoginPage → AuthContext.login → auth.login → api.js
         ← { accessToken, user }
AuthContext stores user in state, token in memory
→ navigate to the page the user wanted, or /dashboard
```

### Page load or refresh
```
AuthProvider mounts → POST /auth/refresh (cookie)
   success → user restored, ProtectedRoute lets them through
   failure → user = null → redirect to /login
```

### Opening a restricted page
```
Employee opens /payroll
→ ProtectedRoute(permission="payroll:run") → can() is false → redirect to /dashboard
(and the backend would return 403 if the API were called directly)
```

---

## 15. Connecting your real backend

1. Set `VITE_USE_MOCK=false` and `VITE_API_URL=...` in `.env`, then restart the dev server.
2. Build each endpoint listed in `services.js`. Use the handlers in `mockServer.js` as the reference for request and response shapes.
3. Return `{ accessToken, user }` from login, signup and refresh. Set the refresh token as an **httpOnly, Secure, SameSite cookie**.
4. Return `401` for missing or expired tokens, `403` for no permission, and `422` with a clear `message` for validation errors. The UI shows `message` to the user.
5. On the backend, enforce permissions **and data scope** (own, team, all) for every endpoint.
6. Enable CORS with credentials for the frontend origin.
7. Delete `src/mock/` and the mock import in `lib/api.js`.

---

## 16. How to add things

### A new page
1. Create `src/features/<area>/MyNewPage.jsx`.
2. Add its API functions to `lib/services.js`.
3. Add a route in `App.jsx`, wrapped with `guard("permission:code", <MyNewPage />)`.
4. Add a line to `config/menu.js` with the same permission.
5. Optional: add a handler to `mockServer.js` so it works before the backend.

### A new role (for example Manager)
1. Add a permission set for it in the backend (and the mock).
2. Create `src/features/manager/` for its pages, such as a team leave page.
3. Add menu items and routes that use the new permissions.
4. No change is needed in `ProtectedRoute` or `Layout`.

### A new shared component
Put it in `components/` only if two or more features use it. If only one page uses it, keep it beside that page.

---

## 17. Conventions

- **Pages never call `fetch` or write URLs.** They call `services.js`.
- **Check permissions, not role names.** Use `can("leave:apply")`, not `role === "employee"`.
- **Every list handles three states:** loading, empty and error. Use `<Async>` and `<Empty>`.
- **Status uses text plus color**, never color alone.
- **Confirm actions with a toast** (approve, reject, cancel, publish).
- **Sentence case** for labels and buttons. Name actions the same way everywhere ("Send request", "Save changes").
- **Do not store tokens in localStorage.** The access token stays in memory.

---

## 18. Commands

| Command | What it does |
|---|---|
| `npm install` | Installs dependencies. |
| `npm run dev` | Starts the dev server at http://localhost:5173 with hot reload. |
| `npm run build` | Creates the production build in `dist/`. |
| `npm run preview` | Serves the production build locally to test it. |

---

## 19. Known gaps and next steps

- No manager role (team approvals) yet.
- No forgot-password, reset-password or set-password pages.
- Holidays on My leave are hard-coded; they need a `GET /holidays` endpoint.
- Settings does not edit roles or holidays.
- No automated tests yet. Good first candidates are `ProtectedRoute`, `useApi` and the leave dialog.