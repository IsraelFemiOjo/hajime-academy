import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import apiRequest from '../../api/client'
import useAuth from '../../hooks/useAuth'
import useApiData from '../../hooks/useApiData'
import { matchesSearch } from '../../utils/format'

// Empty form, used when adding a new student
const emptyForm = {
    admissionNumber: '',
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    className: '',
    guardianName: '',
    guardianPhone: '',
    address: '',
    status: 'active',
    email: '',
    password: '',
}

// Used by both admin and teacher.
// Only admins can add or delete students: adding a student also creates
// their portal login, and the backend only lets admins create logins.
// Teachers can view and edit students.
function StudentsPage() {
    const { user } = useAuth()
    const isAdmin = user.role === 'admin'

    const students = useApiData('/api/students')
    // Classes fill the "Class" dropdown, so a student's class always matches a real class
    const classes = useApiData('/api/classes')

    const [search, setSearch] = useState('')
    const [actionError, setActionError] = useState('')

    // Form state. editingId is null when adding, or the student's id when editing.
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)
    const [formError, setFormError] = useState('')

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const openAddForm = () => {
        setForm(emptyForm)
        setEditingId(null)
        setFormError('')
        setShowForm(true)
    }

    const openEditForm = (student) => {
        setForm({
            admissionNumber: student.admissionNumber,
            firstName: student.firstName,
            lastName: student.lastName,
            gender: student.gender,
            // The date input needs YYYY-MM-DD
            dateOfBirth: student.dateOfBirth ? student.dateOfBirth.slice(0, 10) : '',
            className: student.className,
            guardianName: student.guardianName,
            guardianPhone: student.guardianPhone,
            address: student.address,
            status: student.status,
            email: '',
            password: '',
        })
        setEditingId(student._id)
        setFormError('')
        setShowForm(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const closeForm = () => {
        setShowForm(false)
        setEditingId(null)
        setFormError('')
    }

    // The school details sent to the backend (without the login fields)
    const studentDetails = () => ({
        admissionNumber: form.admissionNumber,
        firstName: form.firstName,
        lastName: form.lastName,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        className: form.className,
        guardianName: form.guardianName,
        guardianPhone: form.guardianPhone,
        address: form.address,
        status: form.status,
    })

    // Adding a student creates two things in the backend:
    // 1. a login account, so the student can sign in to the portal
    // 2. the student's school record, linked to that login
    const addStudent = async () => {
        const admissionNumber = form.admissionNumber.trim()

        // Check first, so a login is not created for nothing
        if ((students.data || []).some((student) => student.admissionNumber === admissionNumber)) {
            throw new Error('A student with this admission number already exists')
        }
        if (form.password.length < 6) {
            throw new Error('Password must be at least 6 characters.')
        }

        const account = await apiRequest('/api/users', {
            method: 'POST',
            body: {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email.trim().toLowerCase(),
                password: form.password,
                role: 'student',
            },
        })

        await apiRequest('/api/students', {
            method: 'POST',
            body: { ...studentDetails(), admissionNumber, userId: account.data.id },
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')
        setSaving(true)

        try {
            if (editingId) {
                await apiRequest(`/api/students/${editingId}`, { method: 'PATCH', body: studentDetails() })
            } else {
                await addStudent()
            }

            closeForm()
            students.reload()
        } catch (err) {
            setFormError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (student) => {
        const confirmed = window.confirm(
            `Delete ${student.firstName} ${student.lastName}? This cannot be undone.`
        )
        if (!confirmed) return

        setActionError('')
        try {
            await apiRequest(`/api/students/${student._id}`, { method: 'DELETE' })
            students.reload()
        } catch (err) {
            setActionError(err.message)
        }
    }

    const studentList = students.data || []
    const classNames = (classes.data || []).map((schoolClass) => schoolClass.name)

    // When editing an older student whose class is not in the list, still show it
    if (form.className && !classNames.includes(form.className)) {
        classNames.push(form.className)
    }

    // Search by name, admission number or class
    const shownStudents = studentList.filter((student) =>
        matchesSearch(search, [
            `${student.firstName} ${student.lastName}`,
            student.admissionNumber,
            student.className,
        ])
    )

    return (
        <DashboardLayout>
            <div className="page-header">
                <div>
                    <h1>Students</h1>
                    <p>
                        {isAdmin
                            ? 'Enrol students, give them a portal login and keep their records up to date.'
                            : 'Look up and update student records.'}
                    </p>
                </div>

                {isAdmin && !showForm && (
                    <button className="btn" type="button" onClick={openAddForm}>
                        Add student
                    </button>
                )}
            </div>

            {showForm && (
                <section className="dashboard-panel form-panel">
                    <h2>{editingId ? 'Edit student' : 'Add student'}</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-field">
                                <label htmlFor="admissionNumber">Admission number</label>
                                <input id="admissionNumber" name="admissionNumber" value={form.admissionNumber} onChange={handleChange} required />
                            </div>

                            <div className="form-field">
                                <label htmlFor="className">Class</label>
                                <select id="className" name="className" value={form.className} onChange={handleChange} required>
                                    <option value="">
                                        {classNames.length === 0 ? 'No classes yet. An admin must add classes first' : 'Select class'}
                                    </option>
                                    {classNames.map((name) => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field">
                                <label htmlFor="firstName">First name</label>
                                <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required />
                            </div>

                            <div className="form-field">
                                <label htmlFor="lastName">Last name</label>
                                <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required />
                            </div>

                            <div className="form-field">
                                <label htmlFor="gender">Gender</label>
                                <select id="gender" name="gender" value={form.gender} onChange={handleChange} required>
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            <div className="form-field">
                                <label htmlFor="dateOfBirth">Date of birth</label>
                                <input id="dateOfBirth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} required />
                            </div>

                            <div className="form-field">
                                <label htmlFor="guardianName">Guardian name</label>
                                <input id="guardianName" name="guardianName" value={form.guardianName} onChange={handleChange} required />
                            </div>

                            <div className="form-field">
                                <label htmlFor="guardianPhone">Guardian phone</label>
                                <input id="guardianPhone" name="guardianPhone" type="tel" value={form.guardianPhone} onChange={handleChange} required />
                            </div>

                            <div className="form-field form-field-wide">
                                <label htmlFor="address">Address</label>
                                <input id="address" name="address" value={form.address} onChange={handleChange} required />
                            </div>

                            <div className="form-field">
                                <label htmlFor="status">Status</label>
                                <select id="status" name="status" value={form.status} onChange={handleChange}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            {!editingId && (
                                <>
                                    <h3 className="form-section-title">Portal login</h3>

                                    <div className="form-field">
                                        <label htmlFor="email">Login email</label>
                                        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
                                    </div>

                                    <div className="form-field">
                                        <label htmlFor="password">Login password</label>
                                        <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="At least 6 characters"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        />
                                        <p className="field-note">Give this to the student so they can sign in.</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {formError && <ErrorMessage message={formError} />}

                        <div className="form-actions">
                            <button className="btn" type="submit" disabled={saving}>
                                {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add student'}
                            </button>
                            <button className="btn btn-secondary" type="button" onClick={closeForm}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="dashboard-panel">
                {students.loading && <Loading message="Loading students..." />}

                {students.error && (
                    <ErrorMessage message={students.error} onRetry={students.reload} />
                )}

                {students.data && (
                    <>
                        {actionError && <ErrorMessage message={actionError} />}

                        <div className="table-toolbar">
                            <input
                                className="search-input"
                                type="search"
                                placeholder="Search by name, admission number or class"
                                aria-label="Search students"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <p className="table-count">
                                {shownStudents.length} of {studentList.length} students
                            </p>
                        </div>

                        {shownStudents.length === 0 ? (
                            <p className="empty-state">
                                {studentList.length === 0
                                    ? (isAdmin ? 'No students yet. Click "Add student" to add the first one.' : 'No students yet.')
                                    : 'No students match your search.'}
                            </p>
                        ) : (
                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Admission no.</th>
                                            <th>Name</th>
                                            <th>Class</th>
                                            <th>Gender</th>
                                            <th>Guardian phone</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shownStudents.map((student) => (
                                            <tr key={student._id}>
                                                <td>{student.admissionNumber}</td>
                                                <td>{student.firstName} {student.lastName}</td>
                                                <td>{student.className}</td>
                                                <td className="text-capitalize">{student.gender}</td>
                                                <td>{student.guardianPhone}</td>
                                                <td>
                                                    <span className={`status-badge status-${student.status}`}>
                                                        {student.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button className="link-button" type="button" onClick={() => openEditForm(student)}>
                                                            Edit
                                                        </button>
                                                        {isAdmin && (
                                                            <button className="link-button link-button-danger" type="button" onClick={() => handleDelete(student)}>
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </section>
        </DashboardLayout>
    )
}

export default StudentsPage
