import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import apiRequest from '../../api/client'
import useApiData from '../../hooks/useApiData'
import { formatDate, fullName, todayString } from '../../utils/format'

const statusOptions = ['present', 'absent', 'late', 'excused']

// Admins and teachers: pick a class and a date, then mark everyone at once.
// Students already marked for that date show their saved status.
// (The backend allows one record per student per day, and records cannot be edited.)
function AttendancePage() {
    const classes = useApiData('/api/classes')
    const students = useApiData('/api/students')

    const [classId, setClassId] = useState('')
    const [date, setDate] = useState(todayString())

    // Records already saved for the chosen class (loads when a class is picked)
    const records = useApiData(classId ? `/api/attendance/class/${classId}` : null)

    // What the user has picked for each student not yet marked: { studentId: { status, remarks } }
    const [marks, setMarks] = useState({})
    const [saving, setSaving] = useState(false)
    const [saveMessage, setSaveMessage] = useState('')
    const [saveErrors, setSaveErrors] = useState([])

    const classList = classes.data || []
    const selectedClass = classList.find((schoolClass) => schoolClass._id === classId)

    // Students belong to a class by its name
    const classStudents = selectedClass
        ? (students.data || [])
            .filter((student) => student.className === selectedClass.name)
            // List in admission-number order, like a class register
            .sort((a, b) => a.admissionNumber.localeCompare(b.admissionNumber, undefined, { numeric: true }))
        : []

    // Saved records for the chosen date, looked up by student id
    const savedToday = {}
    ;(records.data || [])
        .filter((record) => record.date === date)
        .forEach((record) => {
            if (record.student) savedToday[record.student._id] = record
        })

    const notYetMarked = classStudents.filter((student) => !savedToday[student._id])

    const resetMessages = () => {
        setSaveMessage('')
        setSaveErrors([])
    }

    const handleClassChange = (e) => {
        setClassId(e.target.value)
        setMarks({})
        resetMessages()
    }

    const handleDateChange = (e) => {
        setDate(e.target.value)
        setMarks({})
        resetMessages()
    }

    // Everyone starts as "present" until changed
    const markFor = (studentId) => marks[studentId] || { status: 'present', remarks: '' }

    const updateMark = (studentId, field, value) => {
        setMarks({ ...marks, [studentId]: { ...markFor(studentId), [field]: value } })
    }

    const handleSave = async () => {
        resetMessages()
        setSaving(true)

        let savedCount = 0
        const errors = []

        // One request per student, as the backend expects
        for (const student of notYetMarked) {
            const mark = markFor(student._id)
            try {
                await apiRequest('/api/attendance', {
                    method: 'POST',
                    body: {
                        student: student._id,
                        className: classId,
                        date,
                        status: mark.status,
                        remarks: mark.remarks,
                    },
                })
                savedCount += 1
            } catch (err) {
                errors.push(`${fullName(student)}: ${err.message}`)
            }
        }

        setSaving(false)
        setMarks({})
        setSaveErrors(errors)
        if (savedCount > 0) {
            setSaveMessage(`Attendance saved for ${savedCount} student${savedCount === 1 ? '' : 's'}.`)
        }
        records.reload()
    }

    // Count of each status for the chosen date
    const summary = statusOptions.map((status) => ({
        status,
        count: Object.values(savedToday).filter((record) => record.status === status).length,
    }))

    const pageLoading = classes.loading || students.loading
    const pageError = classes.error || students.error

    return (
        <DashboardLayout>
            <div className="page-header">
                <div>
                    <h1>Attendance</h1>
                    <p>Choose a class and a date to mark or view attendance.</p>
                </div>
            </div>

            <section className="dashboard-panel">
                {pageLoading && <Loading message="Loading classes and students..." />}

                {pageError && (
                    <ErrorMessage
                    message={pageError}
                    onRetry={() => {
                        classes.reload()
                        students.reload()
                    }}
                    />
                )}

                {classes.data && students.data && (
                    <>
                        <div className="filter-bar">
                            <div className="form-field">
                                <label htmlFor="attendanceClass">Class</label>
                                <select id="attendanceClass" value={classId} onChange={handleClassChange}>
                                    <option value="">
                                        {classList.length === 0 ? 'No classes yet' : 'Select class'}
                                    </option>
                                    {classList.map((schoolClass) => (
                                        <option key={schoolClass._id} value={schoolClass._id}>{schoolClass.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field">
                                <label htmlFor="attendanceDate">Date</label>
                                <input id="attendanceDate" type="date" max={todayString()} value={date} onChange={handleDateChange} />
                            </div>
                        </div>

                        {!classId && (
                            <p className="empty-state">Select a class to see its students.</p>
                        )}

                        {classId && records.loading && <Loading message="Loading attendance..." />}

                        {classId && records.error && (
                            <ErrorMessage message={records.error} onRetry={records.reload} />
                        )}

                        {classId && records.data && (
                            <>
                                <div className="summary-row">
                                    <p className="table-count">
                                        {selectedClass.name} · {formatDate(date)} · {classStudents.length} students
                                    </p>
                                    <div className="summary-badges">
                                        {summary.map((item) => (
                                            <span key={item.status} className={`status-badge status-${item.status}`}>
                                                {item.status}: {item.count}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {classStudents.length === 0 ? (
                                    <p className="empty-state">
                                        No students are in {selectedClass.name} yet. Add students and choose this class for them.
                                    </p>
                                ) : (
                                    <div className="table-wrapper">
                                        <table className="data-table">
                                            <thead>
                                                <tr>
                                                    <th>Admission no.</th>
                                                    <th>Name</th>
                                                    <th>Status</th>
                                                    <th>Remarks</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {classStudents.map((student) => {
                                                    const saved = savedToday[student._id]
                                                    const mark = markFor(student._id)

                                                    return (
                                                        <tr key={student._id}>
                                                            <td>{student.admissionNumber}</td>
                                                            <td>{fullName(student)}</td>
                                                            <td>
                                                                {saved ? (
                                                                    <span className={`status-badge status-${saved.status}`}>
                                                                        {saved.status}
                                                                    </span>
                                                                ) : (
                                                                    <select
                                                                    className="table-select"
                                                                    aria-label={`Attendance for ${fullName(student)}`}
                                                                    value={mark.status}
                                                                    onChange={(e) => updateMark(student._id, 'status', e.target.value)}
                                                                    >
                                                                        {statusOptions.map((status) => (
                                                                            <option key={status} value={status}>
                                                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {saved ? (
                                                                    saved.remarks || '—'
                                                                ) : (
                                                                    <input
                                                                    className="table-input"
                                                                    aria-label={`Remarks for ${fullName(student)}`}
                                                                    placeholder="Optional"
                                                                    value={mark.remarks}
                                                                    onChange={(e) => updateMark(student._id, 'remarks', e.target.value)}
                                                                    />
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {saveMessage && <p className="success-message">{saveMessage}</p>}

                                {saveErrors.length > 0 && (
                                    <ErrorMessage message={`Some records were not saved: ${saveErrors.join('; ')}`} />
                                )}

                                {classStudents.length > 0 && (
                                    <div className="form-actions">
                                        {notYetMarked.length > 0 ? (
                                            <button className="btn" type="button" onClick={handleSave} disabled={saving}>
                                                {saving ? 'Saving...' : `Save attendance (${notYetMarked.length})`}
                                            </button>
                                        ) : (
                                            <p className="field-note">Everyone in this class has been marked for this date.</p>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </section>
        </DashboardLayout>
    )
}

export default AttendancePage
