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

// Every dashboard page, with the role allowed to open it.
// To add a page: add it here and add its link in components/DashboardLayout.jsx.
const dashboardRoutes = [
  { path: '/admin', role: 'admin', page: <AdminDashboard /> },
  { path: '/teacher', role: 'teacher', page: <TeacherDashboard /> },
  { path: '/student', role: 'student', page: <StudentDashboard /> },
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
