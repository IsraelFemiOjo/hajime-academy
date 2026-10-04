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

function TeacherDashboard() {
    const { user } = useAuth()

    const students = useApiData('/api/students')
    const classes = useApiData('/api/classes')
    const subjects = useApiData('/api/subjects')
    const announcements = useApiData('/api/announcements')

    return (
        <DashboardLayout>
            <div className="page-header">
                <div>
                    <h1>Welcome, {user.firstName}</h1>
                    <p>Mark attendance, enter results and keep up with school news.</p>
                </div>

                <div className="header-actions">
                    <Link className="btn" to="/teacher/attendance">Mark attendance</Link>
                    <Link className="btn btn-secondary" to="/teacher/results">Enter results</Link>
                </div>
            </div>

            <div className="stat-grid">
                <StatCard label="Students" value={countOf(students)} to="/teacher/students" />
                <StatCard label="Classes" value={countOf(classes)} />
                <StatCard label="Subjects" value={countOf(subjects)} />
            </div>

            <section className="dashboard-panel">
                <div className="panel-heading">
                    <h2>Announcements</h2>
                    <Link className="text-link" to="/teacher/announcements">See all</Link>
                </div>

                {announcements.loading && <Loading message="Loading announcements..." />}
                {announcements.error && (
                    <ErrorMessage message={announcements.error} onRetry={announcements.reload} />
                )}
                {announcements.data && (
                    <AnnouncementList
                    announcements={announcements.data.slice(0, 3)}
                    emptyText="There are no announcements right now."
                    />
                )}
            </section>
        </DashboardLayout>
    )
}

export default TeacherDashboard
