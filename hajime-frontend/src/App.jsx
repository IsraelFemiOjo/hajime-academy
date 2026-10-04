import { Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

// Public pages
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

// Overview pages for each role
import AdminDashboard from './pages/dashboards/AdminDashboard'
import TeacherDashboard from './pages/dashboards/TeacherDashboard'
import StudentDashboard from './pages/dashboards/StudentDashboard'

// Admin-only pages
import TeachersPage from './pages/admin/TeachersPage'
import ClassesPage from './pages/admin/ClassesPage'
import SubjectsPage from './pages/admin/SubjectsPage'

// Student-only pages
import MyResultsPage from './pages/student/MyResultsPage'
import MyAttendancePage from './pages/student/MyAttendancePage'

// Pages used by more than one role
import StudentsPage from './pages/shared/StudentsPage'
import AttendancePage from './pages/shared/AttendancePage'
import ResultsPage from './pages/shared/ResultsPage'
import AnnouncementsPage from './pages/shared/AnnouncementsPage'

// Every dashboard page, with the role allowed to open it.
// To add a page: add it here and add its link in components/DashboardLayout.jsx.
const dashboardRoutes = [
  { path: '/admin', role: 'admin', page: <AdminDashboard /> },
  { path: '/admin/students', role: 'admin', page: <StudentsPage /> },
  { path: '/admin/teachers', role: 'admin', page: <TeachersPage /> },
  { path: '/admin/classes', role: 'admin', page: <ClassesPage /> },
  { path: '/admin/subjects', role: 'admin', page: <SubjectsPage /> },
  { path: '/admin/attendance', role: 'admin', page: <AttendancePage /> },
  { path: '/admin/results', role: 'admin', page: <ResultsPage /> },
  { path: '/admin/announcements', role: 'admin', page: <AnnouncementsPage /> },

  { path: '/teacher', role: 'teacher', page: <TeacherDashboard /> },
  { path: '/teacher/students', role: 'teacher', page: <StudentsPage /> },
  { path: '/teacher/attendance', role: 'teacher', page: <AttendancePage /> },
  { path: '/teacher/results', role: 'teacher', page: <ResultsPage /> },
  { path: '/teacher/announcements', role: 'teacher', page: <AnnouncementsPage /> },

  { path: '/student', role: 'student', page: <StudentDashboard /> },
  { path: '/student/results', role: 'student', page: <MyResultsPage /> },
  { path: '/student/attendance', role: 'student', page: <MyAttendancePage /> },
  { path: '/student/announcements', role: 'student', page: <AnnouncementsPage /> },
]

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {dashboardRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute requiredRole={route.role}>
                {route.page}
              </ProtectedRoute>
            }
          />
        ))}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
