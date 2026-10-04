import DashboardLayout from '../../components/DashboardLayout'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import NotEnrolledNotice from '../../components/NotEnrolledNotice'
import { NOT_ENROLLED_MESSAGE } from '../../utils/messages'
import useApiData from '../../hooks/useApiData'
import { formatDate } from '../../utils/format'

const statusOptions = ['present', 'absent', 'late', 'excused']

// A student's own attendance record, newest first
function MyAttendancePage() {
    const attendance = useApiData('/api/attendance/me')

    const records = attendance.data || []

    const summary = statusOptions.map((status) => ({
        status,
        count: records.filter((record) => record.status === status).length,
    }))

    return (
        <DashboardLayout>
            <div className="page-header">
                <div>
                    <h1>My attendance</h1>
                    <p>Every day your attendance was taken.</p>
                </div>
            </div>

            {attendance.error === NOT_ENROLLED_MESSAGE && <NotEnrolledNotice />}

            {attendance.error !== NOT_ENROLLED_MESSAGE && (
                <section className="dashboard-panel">
                    {attendance.loading && <Loading message="Loading your attendance..." />}

                    {attendance.error && (
                        <ErrorMessage message={attendance.error} onRetry={attendance.reload} />
                    )}

                    {attendance.data && (
                        records.length === 0 ? (
                            <p className="empty-state">No attendance has been recorded for you yet.</p>
                        ) : (
                            <>
                                <div className="summary-row">
                                    <p className="table-count">{records.length} days recorded</p>
                                    <div className="summary-badges">
                                        {summary.map((item) => (
                                            <span key={item.status} className={`status-badge status-${item.status}`}>
                                                {item.status}: {item.count}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="table-wrapper">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Class</th>
                                                <th>Status</th>
                                                <th>Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {records.map((record) => (
                                                <tr key={record._id}>
                                                    <td>{formatDate(record.date)}</td>
                                                    <td>{record.className?.name || '—'}</td>
                                                    <td>
                                                        <span className={`status-badge status-${record.status}`}>{record.status}</span>
                                                    </td>
                                                    <td>{record.remarks || '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )
                    )}
                </section>
            )}
        </DashboardLayout>
    )
}

export default MyAttendancePage
