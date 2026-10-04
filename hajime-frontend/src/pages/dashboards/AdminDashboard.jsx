import { Link } from 'react-router'
import DashboardLayout from '../../components/DashboardLayout'
import StatCard from '../../components/StatCard'
import AnnouncementList from '../../components/AnnouncementList'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import useAuth from '../../hooks/useAuth'
import useApiData from '../../hooks/useApiData'

// Shows "…" while a number is loading, and "—" if it could not load
function countOf(request) {
    if (request.loading) return '…'
    if (request.error || !request.data) return '—'
    return request.data.length
}

function AdminDashboard() {
    const { user } = useAuth()

    const students = useApiData('/api/students')
    const teachers = useApiData('/api/teachers')
    const classes = useApiData('/api/classes')
    const subjects = useApiData('/api/subjects')
    const announcements = useApiData('/api/announcements')

    return (
        <DashboardLayout>
            <div className="page-header">
                <div>
                    <h1>Welcome, {user.firstName}</h1>
                    <p>Here is an overview of the school.</p>
                </div>
            </div>

            <div className="stat-grid">
                <StatCard label="Students" value={countOf(students)} to="/admin/students" />
                <StatCard label="Teachers" value={countOf(teachers)} to="/admin/teachers" />
                <StatCard label="Classes" value={countOf(classes)} to="/admin/classes" />
                <StatCard label="Subjects" value={countOf(subjects)} to="/admin/subjects" />
            </div>

            <section className="dashboard-panel">
                <div className="panel-heading">
                    <h2>Recent announcements</h2>
                    <Link className="text-link" to="/admin/announcements">Manage announcements</Link>
                </div>

                {announcements.loading && <Loading message="Loading announcements..." />}
                {announcements.error && (
                    <ErrorMessage message={announcements.error} onRetry={announcements.reload} />
                )}
                {announcements.data && (
                    <AnnouncementList
                    announcements={announcements.data.slice(0, 3)}
                    showAdminDetails
                    emptyText="No announcements yet."
                    />
                )}
            </section>
        </DashboardLayout>
    )
}

export default AdminDashboard
