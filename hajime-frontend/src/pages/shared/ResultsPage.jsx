import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import apiRequest from '../../api/client'
import useAuth from '../../hooks/useAuth'
import useApiData from '../../hooks/useApiData'
import { fullName, subjectName } from '../../utils/format'
import { findMyTeacher, subjectsTaughtBy, classIdsOf } from '../../utils/teacher'

const terms = ['First Term', 'Second Term', 'Third Term']

// Admins and teachers: pick class, subject, session and term, then enter scores.
// The backend works out the grade (A–F) and remarks from the score.
// Only admins can change or delete a saved result (the backend only allows admins).
function ResultsPage() {
    const { user } = useAuth()
    const isAdmin = user.role === 'admin'

    const classes = useApiData('/api/classes')
    const subjects = useApiData('/api/subjects')
    const students = useApiData('/api/students')
    const teachers = useApiData(isAdmin ? null : '/api/teachers')

    const [classId, setClassId] = useState('')
    const [subjectId, setSubjectId] = useState('')
    const [session, setSession] = useState('')
    const [term, setTerm] = useState(terms[0])

    // Results already saved for the chosen class (loads when a class is picked)
    const results = useApiData(classId ? `/api/results/class/${classId}` : null)

    // Scores typed in for students without a result yet: { studentId: '75' }
    const [scores, setScores] = useState({})
    const [saving, setSaving] = useState(false)
    const [saveMessage, setSaveMessage] = useState('')
    const [saveErrors, setSaveErrors] = useState([])

    // Admin editing one saved result
    const [editingResultId, setEditingResultId] = useState(null)
    const [editScore, setEditScore] = useState('')
    const [actionError, setActionError] = useState('')

    // Admins see every subject; a teacher sees only the subjects assigned to them
    const allowedSubjects = isAdmin ? subjects.data || [] : subjectsTaughtBy(subjects.data, findMyTeacher(teachers.data, user))
    const allowedClassIds = classIdsOf(allowedSubjects)
    const classList = (classes.data || []).filter((schoolClass) => isAdmin || allowedClassIds.has(schoolClass._id))
    const selectedClass = classList.find((schoolClass) => schoolClass._id === classId)
    const classSubjects = allowedSubjects.filter((subject) => subject.className?._id === classId)

    const classStudents = selectedClass
        ? (students.data || [])
            .filter((student) => student.className === selectedClass.name)
            // List in admission-number order, like a class register
            .sort((a, b) => a.admissionNumber.localeCompare(b.admissionNumber, undefined, { numeric: true }))
        : []

    // Saved results that match the chosen subject, session and term, by student id
    const savedResults = {}
    ;(results.data || [])
        .filter((result) =>
            result.subject?._id === subjectId &&
            result.academicSession === session.trim() &&
            result.term === term
        )
        .forEach((result) => {
            if (result.student) savedResults[result.student._id] = result
        })

    const readyToEnter = classId && subjectId && session.trim()

    const resetMessages = () => {
        setSaveMessage('')
        setSaveErrors([])
        setActionError('')
    }

    const handleClassChange = (e) => {
        const newClass = classList.find((schoolClass) => schoolClass._id === e.target.value)
        setClassId(e.target.value)
        setSubjectId('')
        // Start with the class's own session; it can still be changed
        setSession(newClass ? newClass.academicSession : '')
        setScores({})
        setEditingResultId(null)
        resetMessages()
    }

    const handleSave = async () => {
        resetMessages()

        // Only students with a score typed in
        const toSave = classStudents.filter(
            (student) => !savedResults[student._id] && String(scores[student._id] ?? '').trim() !== ''
        )

        if (toSave.length === 0) {
            setActionError('Type at least one score before saving.')
            return
        }

        setSaving(true)
        let savedCount = 0
        const errors = []

        for (const student of toSave) {
            try {
                await apiRequest('/api/results', {
                    method: 'POST',
                    body: {
                        student: student._id,
                        subject: subjectId,
                        className: classId,
                        academicSession: session.trim(),
                        term,
                        score: Number(scores[student._id]),
                    },
                })
                savedCount += 1
            } catch (err) {
                errors.push(`${fullName(student)}: ${err.message}`)
            }
        }

        setSaving(false)
        setScores({})
        setSaveErrors(errors)
        if (savedCount > 0) {
            setSaveMessage(`Results saved for ${savedCount} student${savedCount === 1 ? '' : 's'}.`)
        }
        results.reload()
    }

    const startEdit = (result) => {
        resetMessages()
        setEditingResultId(result._id)
        setEditScore(String(result.score))
    }

    const saveEdit = async () => {
        setActionError('')
        try {
            await apiRequest(`/api/results/${editingResultId}`, {
                method: 'PATCH',
                body: { score: Number(editScore) },
            })
            setEditingResultId(null)
            results.reload()
        } catch (err) {
            setActionError(err.message)
        }
    }

    const handleDelete = async (result, student) => {
        const confirmed = window.confirm(`Delete ${fullName(student)}'s result? This cannot be undone.`)
        if (!confirmed) return

        resetMessages()
        try {
            await apiRequest(`/api/results/${result._id}`, { method: 'DELETE' })
            results.reload()
        } catch (err) {
            setActionError(err.message)
        }
    }

    const pageLoading = classes.loading || subjects.loading || students.loading
    const pageError = classes.error || subjects.error || students.error
    const notYetEntered = classStudents.filter((student) => !savedResults[student._id])

    return (
        <DashboardLayout>
            <div className="page-header">
                <div>
                    <h1>Results</h1>
                    <p>Enter and review scores by class, subject and term.</p>
                </div>
            </div>

            <section className="dashboard-panel">
                {pageLoading && <Loading message="Loading classes and subjects..." />}

                {pageError && (
                    <ErrorMessage
                    message={pageError}
                    onRetry={() => {
                        classes.reload()
                        subjects.reload()
                        students.reload()
                    }}
                    />
                )}

                {classes.data && subjects.data && students.data && (
                    <>
                        <div className="filter-bar">
                            <div className="form-field">
                                <label htmlFor="resultClass">Class</label>
                                <select id="resultClass" value={classId} onChange={handleClassChange}>
                                    <option value="">
                                        {classList.length === 0 ? 'No classes yet' : 'Select class'}
                                    </option>
                                    {classList.map((schoolClass) => (
                                        <option key={schoolClass._id} value={schoolClass._id}>{schoolClass.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field">
                                <label htmlFor="resultSubject">Subject</label>
                                <select
                                id="resultSubject"
                                value={subjectId}
                                onChange={(e) => {
                                    setSubjectId(e.target.value)
                                    setScores({})
                                    resetMessages()
                                }}
                                disabled={!classId}
                                >
                                    <option value="">
                                        {classId && classSubjects.length === 0 ? 'No subjects for this class' : 'Select subject'}
                                    </option>
                                    {classSubjects.map((subject) => (
                                        <option key={subject._id} value={subject._id}>{subjectName(subject)}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field">
                                <label htmlFor="resultSession">Session</label>
                                <input
                                id="resultSession"
                                placeholder="e.g. 2025/2026"
                                value={session}
                                onChange={(e) => {
                                    setSession(e.target.value)
                                    setScores({})
                                }}
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="resultTerm">Term</label>
                                <select
                                id="resultTerm"
                                value={term}
                                onChange={(e) => {
                                    setTerm(e.target.value)
                                    setScores({})
                                    resetMessages()
                                }}
                                >
                                    {terms.map((item) => (
                                        <option key={item} value={item}>{item}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {!readyToEnter && (
                            <p className="empty-state">Select a class, subject and session to enter or view scores.</p>
                        )}

                        {readyToEnter && results.loading && <Loading message="Loading results..." />}

                        {readyToEnter && results.error && (
                            <ErrorMessage message={results.error} onRetry={results.reload} />
                        )}

                        {readyToEnter && results.data && (
                            <>
                                {actionError && <ErrorMessage message={actionError} />}

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
                                                    <th>Score (0–100)</th>
                                                    <th>Grade</th>
                                                    <th>Remarks</th>
                                                    {isAdmin && <th>Actions</th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {classStudents.map((student) => {
                                                    const saved = savedResults[student._id]
                                                    const isEditing = saved && editingResultId === saved._id

                                                    return (
                                                        <tr key={student._id}>
                                                            <td>{student.admissionNumber}</td>
                                                            <td>{fullName(student)}</td>
                                                            <td>
                                                                {saved && !isEditing && saved.score}

                                                                {(!saved || isEditing) && (
                                                                    <input
                                                                    className="table-input table-input-small"
                                                                    type="number"
                                                                    min="0"
                                                                    max="100"
                                                                    aria-label={`Score for ${fullName(student)}`}
                                                                    value={isEditing ? editScore : scores[student._id] ?? ''}
                                                                    onChange={(e) =>
                                                                        isEditing
                                                                            ? setEditScore(e.target.value)
                                                                            : setScores({ ...scores, [student._id]: e.target.value })
                                                                    }
                                                                    />
                                                                )}
                                                            </td>
                                                            <td>
                                                                {saved ? (
                                                                    <span className={`status-badge grade-${saved.grade}`}>{saved.grade}</span>
                                                                ) : '—'}
                                                            </td>
                                                            <td>{saved ? saved.remarks : '—'}</td>
                                                            {isAdmin && (
                                                                <td>
                                                                    {saved && !isEditing && (
                                                                        <div className="table-actions">
                                                                            <button className="link-button" type="button" onClick={() => startEdit(saved)}>
                                                                                Edit
                                                                            </button>
                                                                            <button className="link-button link-button-danger" type="button" onClick={() => handleDelete(saved, student)}>
                                                                                Delete
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                    {isEditing && (
                                                                        <div className="table-actions">
                                                                            <button className="link-button" type="button" onClick={saveEdit}>
                                                                                Save
                                                                            </button>
                                                                            <button className="link-button" type="button" onClick={() => setEditingResultId(null)}>
                                                                                Cancel
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            )}
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {saveMessage && <p className="success-message">{saveMessage}</p>}

                                {saveErrors.length > 0 && (
                                    <ErrorMessage message={`Some results were not saved: ${saveErrors.join('; ')}`} />
                                )}

                                {classStudents.length > 0 && (
                                    <div className="form-actions">
                                        {notYetEntered.length > 0 ? (
                                            <button className="btn" type="button" onClick={handleSave} disabled={saving}>
                                                {saving ? 'Saving...' : 'Save results'}
                                            </button>
                                        ) : (
                                            <p className="field-note">Every student has a result for this subject and term.</p>
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

export default ResultsPage
