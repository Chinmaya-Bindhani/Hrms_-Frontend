# PeopleDesk HRMS Frontend: Project Flow

How the app behaves from the moment it opens: who sees what, how data moves, and what happens when something goes wrong. Pair this with `PROJECT_STRUCTURE.md`, which explains where each file lives.

---

## 1. App flow (the big picture)

```
                    ┌──────────────┐
                    │   Open app   │
                    └──────┬───────┘
                           ▼
                ┌─────────────────────┐
                │   Restore session   │  POST /auth/refresh (httpOnly cookie)
                └──────┬───────┬──────┘
              no valid │       │ valid
               session ▼       │
        ┌────────────────────┐ │
        │  Login or sign up  │ │
        └─────────┬──────────┘ │
                  │ success    │
                  ▼            ▼
            ┌────────────────────────────┐
            │  Permissions decide view   │  returned in the login response
            └─────────┬───────────┬──────┘
                      ▼           ▼
             ┌──────────────┐ ┌──────────────┐
             │ Employee view│ │   HR view    │
             │ own data     │ │ whole company│
             └──────────────┘ └──────────────┘
```

Key points:
- There is **no role picker**. The account decides the view.
- The view is decided by the `permissions` list in the user object, not by a role name.
- Every page the user cannot access redirects to `/dashboard`.

---

## 2. Authentication flows

### 2.1 Login

```
LoginPage                AuthContext              services.js → api.js          Backend / mock
    │  submit email+pw        │                            │                          │
    │────────────────────────▶│  login(email, password)    │                          │
    │                         │───────────────────────────▶│  POST /auth/login        │
    │                         │                            │─────────────────────────▶│
    │                         │                            │◀─────────────────────────│
    │                         │◀───────────────────────────│  { accessToken, user }   │
    │                         │  setToken(accessToken)  (kept in memory)
    │                         │  setUser(user)
    │◀────────────────────────│  navigate to the page the user wanted, or /dashboard
```

- Wrong credentials: the backend returns `401`, the page shows "Email or password is incorrect." under the form.
- Empty fields: caught in the page before any request ("Fill in all the fields.").

### 2.2 Sign up

```
Sign up form → POST /auth/signup → { accessToken, user } → same as login
```

- The new account's role is **decided by the backend**, never by the user. In the mock, only emails in `HR_EMAILS` become HR; everyone else is an employee.
- Errors shown inline: password under 6 characters, email already registered.

### 2.3 Page load or refresh

```
Browser refresh
   → AuthProvider mounts, loading = true  (pages show "Loading…")
   → POST /auth/refresh  (refresh cookie sent automatically)
        ├─ success → token + user restored → loading = false → page renders
        └─ failure → user = null → loading = false → redirect to /login
```

The access token lives only in memory, so a refresh always starts with this step.

### 2.4 Logout

```
Log out button → POST /auth/logout → setToken(null) → setUser(null) → redirect to /login
```

### 2.5 Token expires during use

```
Any request returns 401
   → (path is not /auth/*)  → POST /auth/refresh once
        ├─ success → new token saved → original request retried → page continues
        └─ failure → redirect to /login
```

This is handled once in `lib/api.js`. Pages never deal with it.

---

## 3. Route guard flow

Every protected page passes through `ProtectedRoute`:

```
Navigate to a URL
   │
   ▼
Still restoring session?  ── yes ──▶ show "Loading…"
   │ no
   ▼
Logged in?  ── no ──▶ redirect to /login  (remember the wanted page)
   │ yes
   ▼
Page needs a permission?  ── no ──▶ render page
   │ yes
   ▼
User has that permission?  ── no ──▶ redirect to /dashboard
   │ yes
   ▼
Render page
```

Example: an employee types `/payroll` → needs `payroll:run` → employee lacks it → sent to `/dashboard`.

> The guard only improves the experience. The backend must return `403` for the same request, because anyone can call the API directly.

---

## 4. Role-based view flow

The same URL can show different pages, and the sidebar is filtered from one list.

### 4.1 Sidebar

```
config/menu.js (all 9 items, each with an optional permission)
   │
   ▼  Layout.jsx keeps items where: no permission OR can(permission)
   │
   ├─ Employee: Dashboard · My leave · Attendance · Payslips · My profile
   └─ HR:       Dashboard · Employees · Leave requests · Attendance · Payroll · Settings
```

### 4.2 Shared URLs

| URL | If user has `employee:read_all` (HR) | Otherwise (Employee) |
|---|---|---|
| `/dashboard` | `HRDashboard` | `EmployeeDashboard` |
| `/attendance` | `HRAttendancePage` (needs `attendance:read_all`) | `MyAttendancePage` |

### 4.3 Permissions

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

---

## 5. Data request flow

How any page gets or changes data:

```
Page component
   │  const q = useApi(() => leave.list(), [])
   ▼
hooks/useApi.js      → sets loading, runs the call, stores data or error
   ▼
lib/services.js      → leave.list()  →  api.get("/leave/requests?status=All")
   ▼
lib/api.js           → adds Authorization header, handles errors and 401 refresh
   ▼
   ├─ VITE_USE_MOCK=true   → mock/mockServer.js  (fake database, 250 ms delay)
   └─ VITE_USE_MOCK=false  → fetch(VITE_API_URL + path)  → your backend
   ▼
Response comes back up the same chain → useApi → page re-renders
```

### What the page shows while this happens

```
useApi state              Async component shows
─────────────────────     ──────────────────────────────────────
loading, no data yet      "Loading…"
error                     error message + "Try again" button
data (empty list)         page's own empty message (e.g. "All caught up…")
data (has items)          the content
reloading, has old data   old content stays visible until new data arrives
```

### After a change (approve, cancel, add…)

```
Button click → service call → success → toast message → q.reload() → list refreshes
                            → failure → toast shows the error message
```

---

## 6. Employee flows

### 6.1 Check in / check out

```
Dashboard or Attendance page
   → CheckInCard shows live clock + current status (from GET /attendance → punchedIn)
   → click button → POST /attendance/check-in  (toggles)
   → toast "Checked in" or "Checked out" → reload attendance data
```

### 6.2 Apply for leave

```
"Apply for leave" (dashboard or My leave)
   → dialog: type, from date, to date (optional), reason (optional)
   → Send request
        ├─ no start date      → inline error "Choose a start date."
        ├─ end before start   → backend error shown inline
        └─ valid → POST /leave/requests
              → toast "Leave request sent to your manager"
              → dialog closes, form resets
              → request list reloads with the new item tagged Pending
```

### 6.3 Cancel a leave request

```
My leave → History → "Cancel" (shown only on Pending rows)
   → DELETE /leave/requests/:id
   → toast "Request cancelled" → list reloads
Backend rule: only your own, only while Pending.
```

### 6.4 View a payslip

```
Payslips page → GET /payslips (list of months)
   → first month selected by default
   → GET /payslips/:id → earnings, deductions, net pay
   → click another month → loads that detail
   → "Download PDF" (toast for now; connect to a file endpoint later)
```

### 6.5 Edit profile

```
My profile → GET /me/profile → read-only fields + editable phone
   → Save changes → PATCH /me/profile → toast "Profile saved"
Name, department and manager are changed by HR, not here.
```

---

## 7. HR flows

### 7.1 Review leave

```
HR Dashboard (queue) or Leave requests page
   → GET /leave/requests?status=Pending   (HR scope = all employees)
   → Approve / Reject → PATCH /leave/requests/:id { status }
   → toast "<name>'s request approved|rejected" → list reloads
Leave requests page filters: Pending | All
   Pending rows show buttons; decided rows show a status tag.
```

### 7.2 Manage employees

```
Employees page → GET /employees → table + search (filters on the client)
   ├─ click a row → detail dialog (department, manager, status, Edit details)
   └─ Add employee → dialog (name, email, department)
          → POST /employees → toast "<name> added" → list reloads
          (new employees start as "Probation"; the invite email is a backend job)
```

### 7.3 Attendance today

```
GET /attendance/today → counts (Present / Late / On leave / Absent)
   → filter pills: All | Present | Late | Absent → table of check-ins
```

### 7.4 Run payroll

```
GET /payroll/runs/current → month, totals, current step, step names

 Step 1  Attendance locked          done
 Step 2  Leave balances synced      done
 Step 3  Review pay changes         button: "Mark reviewed"
 Step 4  Run payroll                button: "Run payroll"
 Step 5  Publish payslips           button: "Publish payslips"
                                    ▼
                           "<Month> payroll is complete.
                            Employees can see their payslips."

Each button → POST /payroll/runs/current/advance → toast → reload
Only the current step has a button. Completed steps show a tick.
```

### 7.5 Settings

```
Settings → GET /settings/leave-policies → editable yearly allowances
   → Save policies → PUT /settings/leave-policies → toast "Policies saved"
Access by role table → GET /roles (read-only)
```

---

## 8. Cross-role flow: a leave request from start to finish

```
EMPLOYEE                          SYSTEM                              HR
   │                                │                                  │
   │ Apply for leave ──────────────▶│ POST /leave/requests             │
   │                                │ status = Pending                 │
   │ sees "Pending" in My leave     │                                  │
   │                                │◀────── sees it in review queue ──│
   │                                │        GET /leave/requests       │
   │                                │◀────── Approve or Reject ────────│
   │                                │        PATCH /leave/requests/:id │
   │ sees "Approved" or "Rejected"  │                                  │
   │ (next time the list loads)     │                                  │
```

Rules:
- Employees see only their own requests. HR sees everyone's. The **backend** applies this data scope.
- An employee can cancel only while the status is **Pending**.
- Approved leave is expected to affect attendance and payroll in the real backend.

---

## 9. Monthly cycle (how the modules connect)

```
Attendance (daily check-ins)
      │  regularise exceptions before the cut-off
      ▼
Attendance locked  ──▶  Leave balances synced
      │
      ▼
Review pay changes  ──▶  Run payroll  ──▶  Publish payslips
                                                 │
                                                 ▼
                                   Employees see payslips (Payslips page)
```

A missing punch becomes a loss-of-pay line, so the regularisation cut-off must be before the payroll lock date. The frontend's Payroll checklist mirrors this order.

---

## 10. Where state lives

| State | Where | Lifetime |
|---|---|---|
| Logged-in user and permissions | `AuthContext` (React state) | Until logout or refresh (then restored from the cookie) |
| Access token | In memory inside `lib/api.js` | Until refresh or logout |
| Refresh token | httpOnly cookie, set by the backend | Backend decides |
| Server data (lists, balances…) | `useApi` in each page | While the page is mounted |
| Form fields, filters, search text, selected row | Local `useState` in the page | While the page is mounted |
| Toast message | `ToastProvider` | About 2 seconds |
| Mock database | Memory in `mock/mockServer.js` | Until page reload |

Tokens are never stored in `localStorage`.

---

## 11. Error and edge-case flow

| Situation | What happens |
|---|---|
| Request fails (network, 500) | The page shows the message and a "Try again" button. |
| `401` on a normal request | One silent refresh, then retry. If refresh fails, go to `/login`. |
| `403` on an action | A toast or inline message shows the backend's `message`. |
| `422` validation error | The message appears inline in the form or dialog. |
| List is empty | The page shows a friendly empty message, not a blank area. |
| Unknown URL | Redirects to `/dashboard`. |
| Page opened without permission | Redirects to `/dashboard`. |
| Not logged in | Redirects to `/login`, then back to the wanted page after login. |

---

## 12. Moving from mock to real backend

```
1. Build the endpoints listed in lib/services.js
        │   (use mock/mockServer.js as the exact request/response reference)
        ▼
2. Backend returns { accessToken, user{ id, name, email, roles, permissions[] } }
   from login, signup and refresh; refresh token goes in an httpOnly cookie
        ▼
3. Backend enforces permissions AND data scope (own / team / all) on every route
        ▼
4. .env →  VITE_USE_MOCK=false
           VITE_API_URL=http://localhost:8000/api
   (restart `npm run dev`; enable CORS with credentials on the backend)
        ▼
5. Test each page against the real API
        ▼
6. Delete src/mock/ and its import in lib/api.js
```

---

## 13. Quick reference: page → endpoints

| Page | Reads | Writes |
|---|---|---|
| Employee dashboard | `/me/summary`, `/attendance`, `/leave/requests` | `/attendance/check-in`, `/leave/requests` |
| My leave | `/leave/balances`, `/leave/requests` | `POST` and `DELETE /leave/requests` |
| Attendance (employee) | `/attendance` | `/attendance/check-in` |
| Payslips | `/payslips`, `/payslips/:id` | – |
| My profile | `/me/profile` | `PATCH /me/profile` |
| HR dashboard | `/hr/summary`, `/leave/requests?status=Pending` | `PATCH /leave/requests/:id` |
| Employees | `/employees` | `POST /employees` |
| Leave requests | `/leave/requests?status=` | `PATCH /leave/requests/:id` |
| Attendance (HR) | `/attendance/today` | – |
| Payroll | `/payroll/runs/current` | `POST /payroll/runs/current/advance` |
| Settings | `/settings/leave-policies`, `/roles` | `PUT /settings/leave-policies` |

---

## 14. Not covered yet

- Manager role with team approvals (a "Team leave" page and `team` data scope).
- Forgot password, reset password and first-time set-password screens.
- Real PDF download for payslips.
- Holidays from the API (currently a fixed list on My leave).
- Notifications when a leave request is decided.