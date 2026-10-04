import DashboardLayout from '../../components/DashboardLayout'
import useAuth from '../../hooks/useAuth'

// Starter page. The full student dashboard is built on top of this.
function StudentDashboard() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <section className="dashboard-panel">
        <h1>Student Dashboard</h1>
        <p>Welcome, {user.firstName}. Your student portal.</p>
      </section>
    </DashboardLayout>
  )
}

export default StudentDashboard
