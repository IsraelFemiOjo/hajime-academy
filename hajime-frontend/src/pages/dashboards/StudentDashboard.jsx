import { Link } from 'react-router'
import DashboardLayout from '../../components/DashboardLayout'
import AnnouncementList from '../../components/AnnouncementList'
import StatCard from '../../components/StatCard'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import NotEnrolledNotice from '../../components/NotEnrolledNotice'
import { NOT_ENROLLED_MESSAGE } from '../../utils/messages'
import useAuth from '../../hooks/useAuth'
import useApiData from '../../hooks/useApiData'
import { formatDate } from '../../utils/format'

// Percentage of days the student was present or late
function attendanceRate(records) {
    if (records.length === 0) return '—'
    const attended = records.filter((record) => record.status === 'present' || record.status === 'late').length
    return `${Math.round((attended / records.length) * 100)}%`
}

// Average of all scores, rounded
function averageScore(results) {
    if (results.length === 0) return '—'
    const total = results.reduce((sum, result) => sum + result.score, 0)
    return Math.round(total / results.length)
}

function StudentDashboard() {
    const { user } = useAuth()

    const profile = useApiData('/api/students/me')
    const results = useApiData('/api/results/me')
    const attendance = useApiData('/api/attendance/me')
    const announcements = useApiData('/api/announcements')

    const notEnrolled = profile.error === NOT_ENROLLED_MESSAGE
    const student = profile.data

    return (
        <DashboardLayout>
            <div className="page-header">
                <div>
                    <h1>Welcome, {user.firstName}</h1>
                    <p>Your student portal.</p>
                </div>
            </div>

            {notEnrolled && <NotEnrolledNotice />}

            {student && (
                <div className="stat-grid">
                    <StatCard label="Class" value={student.className} />
                    <StatCard
                    label="Attendance"
                    value={attendance.data ? attendanceRate(attendance.data) : '…'}
                    to="/student/attendance"
                    />
                    <StatCard
                    label="Average score"
                    value={results.data ? averageScore(results.data) : '…'}
                    to="/student/results"
                    />
                    <StatCard
                    label="Results recorded"
                    value={results.data ? results.data.length : '…'}
                    to="/student/results"
                    />
                </div>
            )}

            <section className="dashboard-panel profile-panel">
                <h2>My details</h2>

                {profile.loading && <Loading message="Loading your details..." />}

                {profile.error && !notEnrolled && (
                    <ErrorMessage message={profile.error} onRetry={profile.reload} />
                )}

                {(student || notEnrolled) && (
                    <dl className="detail-list">
                        <div>
                            <dt>Name</dt>
                            <dd>{user.firstName} {user.lastName}</dd>
                        </div>
                        <div>
                            <dt>Email</dt>
                            <dd>{user.email}</dd>
                        </div>
                        {student && (
                            <>
                                <div>
                                    <dt>Admission number</dt>
                                    <dd>{student.admissionNumber}</dd>
                                </div>
                                <div>
                                    <dt>Class</dt>
                                    <dd>{student.className}</dd>
                                </div>
                                <div>
                                    <dt>Date of birth</dt>
                                    <dd>{formatDate(student.dateOfBirth)}</dd>
                                </div>
                                <div>
                                    <dt>Guardian</dt>
                                    <dd>{student.guardianName} · {student.guardianPhone}</dd>
                                </div>
                            </>
                        )}
                    </dl>
                )}
            </section>

            <section className="dashboard-panel">
                <div className="panel-heading">
                    <h2>Announcements</h2>
                    <Link className="text-link" to="/student/announcements">See all</Link>
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

export default StudentDashboard
