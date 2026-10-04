import DashboardLayout from '../../components/DashboardLayout'
import useAuth from '../../hooks/useAuth'

// Starter page. The full teacher dashboard is built on top of this.
function TeacherDashboard() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <section className="dashboard-panel">
        <h1>Teacher Dashboard</h1>
        <p>Welcome, {user.firstName}. Manage your classes, attendance and student results.</p>
      </section>
    </DashboardLayout>
  )
}

export default TeacherDashboard
