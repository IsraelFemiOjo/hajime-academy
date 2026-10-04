import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import apiRequest from '../../api/client'
import useApiData from '../../hooks/useApiData'
import { matchesSearch } from '../../utils/format'

const emptyForm = {
    employeeNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    qualification: '',
    status: 'active',
}

// Admin only. Adding a teacher creates two things in the backend:
// 1. a login account (so the teacher can sign in to the portal)
// 2. a teacher profile linked to that account
function TeachersPage() {
    const teachers = useApiData('/api/teachers')

    const [search, setSearch] = useState('')
    const [actionError, setActionError] = useState('')

    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)
    const [formError, setFormError] = useState('')

    const teacherList = teachers.data || []

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const openAddForm = () => {
        setForm(emptyForm)
        setEditingId(null)
        setFormError('')
        setShowForm(true)
    }

    const openEditForm = (teacher) => {
        setForm({
            employeeNumber: teacher.employeeNumber,
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            email: teacher.email,
            password: '',
            phone: teacher.phone,
            qualification: teacher.qualification,
            status: teacher.status,
        })
        setEditingId(teacher._id)
        setFormError('')
        setShowForm(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const closeForm = () => {
        setShowForm(false)
        setEditingId(null)
        setFormError('')
    }

    const addTeacher = async () => {
        const email = form.email.trim().toLowerCase()
        const employeeNumber = form.employeeNumber.trim()

        // Check for duplicates first, so a login account is not created for nothing
        if (teacherList.some((teacher) => teacher.employeeNumber === employeeNumber)) {
            throw new Error('A teacher with this employee number already exists')
        }
        if (teacherList.some((teacher) => teacher.email === email)) {
            throw new Error('A teacher with this email already exists')
        }
        if (form.password.length < 6) {
            throw new Error('Password must be at least 6 characters.')
        }

        // 1. Create the teacher's login account (admin-only route)
        const account = await apiRequest('/api/users', {
            method: 'POST',
            body: {
                firstName: form.firstName,
                lastName: form.lastName,
                email,
                password: form.password,
                role: 'teacher',
            },
        })

        // 2. Create the teacher profile, linked to that account
        await apiRequest('/api/teachers', {
            method: 'POST',
            body: {
                userId: account.data.id,
                employeeNumber,
                firstName: form.firstName,
                lastName: form.lastName,
                email,
                phone: form.phone,
                qualification: form.qualification,
                status: form.status,
            },
        })
    }

    const updateTeacher = async () => {
        // The login email is not changed here, so it is not sent
        await apiRequest(`/api/teachers/${editingId}`, {
            method: 'PATCH',
            body: {
                employeeNumber: form.employeeNumber,
                firstName: form.firstName,
                lastName: form.lastName,
                phone: form.phone,
                qualification: form.qualification,
                status: form.status,
            },
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')
        setSaving(true)

        try {
            if (editingId) {
                await updateTeacher()
            } else {
                await addTeacher()
            }
            closeForm()
            teachers.reload()
        } catch (err) {
            setFormError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (teacher) => {
        const confirmed = window.confirm(
            `Delete ${teacher.firstName} ${teacher.lastName}'s teacher profile? This cannot be undone.`
        )
        if (!confirmed) return

        setActionError('')
        try {
            await apiRequest(`/api/teachers/${teacher._id}`, { method: 'DELETE' })
            teachers.reload()
        } catch (err) {
            setActionError(err.message)
        }
    }

    const shownTeachers = teacherList.filter((teacher) =>
        matchesSearch(search, [
            `${teacher.firstName} ${teacher.lastName}`,
            teacher.employeeNumber,
            teacher.email,
        ])
    )

    return (
        <DashboardLayout>
            <div className="page-header">
                <div>
                    <h1>Teachers</h1>
                    <p>Add teachers and give them a login to the portal.</p>
                </div>

                {!showForm && (
                    <button className="btn" type="button" onClick={openAddForm}>
                        Add teacher
                    </button>
                )}
            </div>

            {showForm && (
                <section className="dashboard-panel form-panel">
                    <h2>{editingId ? 'Edit teacher' : 'Add teacher'}</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-field">
                                <label htmlFor="firstName">First name</label>
                                <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required />
                            </div>

                            <div className="form-field">
                                <label htmlFor="lastName">Last name</label>
                                <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required />
                            </div>

                            <div className="form-field">
                                <label htmlFor="employeeNumber">Employee number</label>
                                <input id="employeeNumber" name="employeeNumber" value={form.employeeNumber} onChange={handleChange} required />
                            </div>

                            <div className="form-field">
                                <label htmlFor="phone">Phone</label>
                                <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
                            </div>

                            <div className="form-field">
                                <label htmlFor="email">Login email</label>
                                <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                disabled={Boolean(editingId)}
                                required
                                />
                                {editingId && <p className="field-note">The login email cannot be changed here.</p>}
                            </div>

                            {!editingId && (
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
                                    <p className="field-note">Give this to the teacher so they can sign in.</p>
                                </div>
                            )}

                            <div className="form-field">
                                <label htmlFor="qualification">Qualification</label>
                                <input id="qualification" name="qualification" placeholder="e.g. B.Ed Mathematics" value={form.qualification} onChange={handleChange} required />
                            </div>

                            <div className="form-field">
                                <label htmlFor="status">Status</label>
                                <select id="status" name="status" value={form.status} onChange={handleChange}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        {formError && <ErrorMessage message={formError} />}

                        <div className="form-actions">
                            <button className="btn" type="submit" disabled={saving}>
                                {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add teacher'}
                            </button>
                            <button className="btn btn-secondary" type="button" onClick={closeForm}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="dashboard-panel">
                {teachers.loading && <Loading message="Loading teachers..." />}

                {teachers.error && (
                    <ErrorMessage message={teachers.error} onRetry={teachers.reload} />
                )}

                {teachers.data && (
                    <>
                        {actionError && <ErrorMessage message={actionError} />}

                        <div className="table-toolbar">
                            <input
                                className="search-input"
                                type="search"
                                placeholder="Search by name, employee number or email"
                                aria-label="Search teachers"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <p className="table-count">
                                {shownTeachers.length} of {teacherList.length} teachers
                            </p>
                        </div>

                        {shownTeachers.length === 0 ? (
                            <p className="empty-state">
                                {teacherList.length === 0
                                    ? 'No teachers yet. Click "Add teacher" to add the first one.'
                                    : 'No teachers match your search.'}
                            </p>
                        ) : (
                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Employee no.</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Qualification</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shownTeachers.map((teacher) => (
                                            <tr key={teacher._id}>
                                                <td>{teacher.employeeNumber}</td>
                                                <td>{teacher.firstName} {teacher.lastName}</td>
                                                <td>{teacher.email}</td>
                                                <td>{teacher.phone}</td>
                                                <td>{teacher.qualification}</td>
                                                <td>
                                                    <span className={`status-badge status-${teacher.status}`}>
                                                        {teacher.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button className="link-button" type="button" onClick={() => openEditForm(teacher)}>
                                                            Edit
                                                        </button>
                                                        <button className="link-button link-button-danger" type="button" onClick={() => handleDelete(teacher)}>
                                                            Delete
                                                        </button>
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

export default TeachersPage
