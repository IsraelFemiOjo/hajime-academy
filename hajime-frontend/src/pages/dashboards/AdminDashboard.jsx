import DashboardLayout from '../../components/DashboardLayout'
import useAuth from '../../hooks/useAuth'

// Starter page. The full admin dashboard is built on top of this.
function AdminDashboard() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <section className="dashboard-panel">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.firstName}. Manage the school: students, teachers, classes, subjects, results and announcements.</p>
      </section>
    </DashboardLayout>
  )
}

export default AdminDashboard
