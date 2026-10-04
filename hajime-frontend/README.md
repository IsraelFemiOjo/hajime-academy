# Hajime Academy – Frontend

The React website for the Hajime Academy school portal.

## Features

- Public pages: Home, About, Login, Register
- Student registration and login connected to the backend auth API
- Login is remembered after a page refresh and checked with the backend (`/api/auth/me`)
- Role-based routing: students, teachers and admins each go to their own dashboard
- Protected pages: logged-out users are sent to Login; users on another role's page are sent to their own dashboard
- Shared layout: navbar, dashboard sidebar and footer
- Loading states (spinner, "Logging in..." buttons) and clear error messages
- A "Something went wrong" screen if a page crashes, and a "Page not found" page

### Dashboards

| Role | Pages |
|---|---|
| Admin | Overview (school counts and recent announcements), Students, Teachers, Classes, Subjects, Attendance, Results, Announcements |
| Teacher | Overview, Students (view and edit), Attendance (mark a whole class at once), Results (enter scores; grades are worked out by the backend), Announcements |
| Student | Overview (class, attendance rate, average score, my details), My results, My attendance, Announcements |

- Admins add teachers and students from their pages; this creates the person's login and school record together, already linked.
- Teachers can view and edit students; only admins can add or delete them.
- A student only ever sees their own record, results and attendance.
- Someone who signs up on the Register page without being enrolled sees a message asking them to contact the school.
- Only admins can change or delete a saved result.
- Each role only sees the announcements meant for it.

## Running it

The backend must be running first (see `../backend/README.md`). Then:

```
npm install
npm run dev
```

Open `http://localhost:5173`.

By default the frontend talks to the backend at `http://localhost:3000`. To use a different address (for example a deployed backend), create a `.env` file in this folder:

```
VITE_API_URL=https://your-backend-address
```

## Adding a dashboard page

1. Create the page in `src/pages/...` and wrap it in `<DashboardLayout>`.
2. Add it to the `dashboardRoutes` list in `src/App.jsx` with the role allowed to open it.
3. Add its sidebar link in `src/components/DashboardLayout.jsx`.

## Other commands

| Command | What it does |
|---|---|
| `npm run build` | Builds the production version into `dist/` |
| `npm run lint` | Checks the code for mistakes |
| `npm run preview` | Previews the production build |

## Folder guide

| Path | Contents |
|---|---|
| `src/pages/` | Home, About, Login, Register, NotFound |
| `src/pages/dashboards/` | Overview page for each role |
| `src/pages/admin/` | Admin-only pages: Teachers, Classes, Subjects |
| `src/pages/student/` | Student-only pages: My results, My attendance |
| `src/pages/shared/` | Pages used by more than one role: Students, Attendance, Results, Announcements |
| `src/components/` | Navbar, Footer, DashboardLayout (sidebar links), ProtectedRoute, Loading, ErrorMessage, ErrorBoundary, StatCard, AnnouncementList |
| `src/components/DashboardUI.css` | Shared dashboard styles: buttons, forms, tables, badges |
| `src/context/` | `AuthProvider` – keeps track of the logged-in user |
| `src/hooks/useAuth.js` | Gives any page the logged-in user, `login()` and `logout()` |
| `src/hooks/useApiData.js` | Loads data for a page: `const { data, loading, error, reload } = useApiData('/api/students')` |
| `src/utils/format.js` | Helpers for names, dates and search |
| `src/api/client.js` | `apiRequest()` – calls the backend and attaches the login token |
