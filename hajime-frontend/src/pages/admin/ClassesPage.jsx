import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import apiRequest from '../../api/client'
import useApiData from '../../hooks/useApiData'
import { fullName, matchesSearch } from '../../utils/format'

const levels = ['JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3']

// The current school year, e.g. "2026/2027". A new school year starts in September.
function currentSession() {
    const now = new Date()
    const startYear = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1
    return `${startYear}/${startYear + 1}`
}

// A new class form, already filled with sensible defaults,
// so the admin usually only picks the level and the class teacher
function newClassForm() {
    return {
        level: '',
        section: 'A',
        classTeacher: '',
        academicSession: currentSession(),
        capacity: '40',
        status: 'active',
    }
}

// The class name is level + section, e.g. "JSS 1" + "A" = "JSS 1A"
function classNameFrom(form) {
    return form.level ? `${form.level}${form.section.trim().toUpperCase()}` : ''
}

// Admin only: create and manage classes, each with a class teacher
function ClassesPage() {
    const classes = useApiData('/api/classes')
    const teachers = useApiData('/api/teachers')

    const [search, setSearch] = useState('')
    const [actionError, setActionError] = useState('')

    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState(newClassForm)
    const [saving, setSaving] = useState(false)
    const [formError, setFormError] = useState('')

    const classList = classes.data || []
    const teacherList = teachers.data || []

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const openAddForm = () => {
        setForm(newClassForm())
        setEditingId(null)
        setFormError('')
        setShowForm(true)
    }

    const openEditForm = (schoolClass) => {
        setForm({
            level: schoolClass.level,
            section: schoolClass.section,
            // The backend sends the full teacher; the form only needs their id
            classTeacher: schoolClass.classTeacher?._id || '',
            academicSession: schoolClass.academicSession,
            capacity: String(schoolClass.capacity),
            status: schoolClass.status,
        })
        setEditingId(schoolClass._id)
        setFormError('')
        setShowForm(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const closeForm = () => {
        setShowForm(false)
        setEditingId(null)
        setFormError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')
        setSaving(true)

        const body = {
            ...form,
            name: classNameFrom(form),
            section: form.section.trim().toUpperCase(),
            capacity: Number(form.capacity),
        }

        try {
            if (editingId) {
                await apiRequest(`/api/classes/${editingId}`, { method: 'PATCH', body })
            } else {
                await apiRequest('/api/classes', { method: 'POST', body })
            }
            closeForm()
            classes.reload()
        } catch (err) {
            setFormError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (schoolClass) => {
        const confirmed = window.confirm(`Delete ${schoolClass.name}? This cannot be undone.`)
        if (!confirmed) return

        setActionError('')
        try {
            await apiRequest(`/api/classes/${schoolClass._id}`, { method: 'DELETE' })
            classes.reload()
        } catch (err) {
            setActionError(err.message)
        }
    }

    const shownClasses = classList.filter((schoolClass) =>
        matchesSearch(search, [
            schoolClass.name,
            schoolClass.level,
            schoolClass.academicSession,
            fullName(schoolClass.classTeacher),
        ])
    )

    return (
        <DashboardLayout>
            <div className="page-header">
                <div>
                    <h1>Classes</h1>
                    <p>Set up classes and assign a class teacher to each.</p>
                </div>

                {!showForm && (
                    <button className="btn" type="button" onClick={openAddForm}>
                        Add class
                    </button>
                )}
            </div>

            {showForm && (
                <section className="dashboard-panel form-panel">
                    <h2>{editingId ? 'Edit class' : 'Add class'}</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-field">
                                <label htmlFor="level">Level</label>
                                <select id="level" name="level" value={form.level} onChange={handleChange} required>
                                    <option value="">Select level</option>
                                    {levels.map((level) => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field">
                                <label htmlFor="classTeacher">Class teacher</label>
                                <select id="classTeacher" name="classTeacher" value={form.classTeacher} onChange={handleChange} required>
                                    <option value="">
                                        {teacherList.length === 0 ? 'No teachers yet. Add a teacher first' : 'Select teacher'}
                                    </option>
                                    {teacherList.map((teacher) => (
                                        <option key={teacher._id} value={teacher._id}>
                                            {fullName(teacher)} ({teacher.employeeNumber})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field">
                                <label htmlFor="section">Section</label>
                                <input id="section" name="section" maxLength="2" value={form.section} onChange={handleChange} required />
                                <p className="field-note">Leave as A unless this level has more than one class (A, B, C...).</p>
                            </div>

                            <div className="form-field">
                                <label htmlFor="academicSession">Academic session</label>
                                <input id="academicSession" name="academicSession" value={form.academicSession} onChange={handleChange} required />
                            </div>

                            <div className="form-field">
                                <label htmlFor="capacity">Capacity</label>
                                <input id="capacity" name="capacity" type="number" min="1" step="1" value={form.capacity} onChange={handleChange} required />
                                <p className="field-note">The most students this class can take.</p>
                            </div>

                            <div className="form-field">
                                <label htmlFor="status">Status</label>
                                <select id="status" name="status" value={form.status} onChange={handleChange}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        {classNameFrom(form) && (
                            <p className="form-preview">
                                Class name: <strong>{classNameFrom(form)}</strong>
                            </p>
                        )}

                        {formError && <ErrorMessage message={formError} />}

                        <div className="form-actions">
                            <button className="btn" type="submit" disabled={saving}>
                                {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add class'}
                            </button>
                            <button className="btn btn-secondary" type="button" onClick={closeForm}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="dashboard-panel">
                {classes.loading && <Loading message="Loading classes..." />}

                {classes.error && (
                    <ErrorMessage message={classes.error} onRetry={classes.reload} />
                )}

                {classes.data && (
                    <>
                        {actionError && <ErrorMessage message={actionError} />}

                        <div className="table-toolbar">
                            <input
                                className="search-input"
                                type="search"
                                placeholder="Search by class, level, session or teacher"
                                aria-label="Search classes"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <p className="table-count">
                                {shownClasses.length} of {classList.length} classes
                            </p>
                        </div>

                        {shownClasses.length === 0 ? (
                            <p className="empty-state">
                                {classList.length === 0
                                    ? 'No classes yet. Click "Add class" to add the first one.'
                                    : 'No classes match your search.'}
                            </p>
                        ) : (
                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Class</th>
                                            <th>Level</th>
                                            <th>Section</th>
                                            <th>Class teacher</th>
                                            <th>Session</th>
                                            <th>Capacity</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shownClasses.map((schoolClass) => (
                                            <tr key={schoolClass._id}>
                                                <td>{schoolClass.name}</td>
                                                <td>{schoolClass.level}</td>
                                                <td>{schoolClass.section}</td>
                                                <td>{fullName(schoolClass.classTeacher)}</td>
                                                <td>{schoolClass.academicSession}</td>
                                                <td>{schoolClass.capacity}</td>
                                                <td>
                                                    <span className={`status-badge status-${schoolClass.status}`}>
                                                        {schoolClass.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button className="link-button" type="button" onClick={() => openEditForm(schoolClass)}>
                                                            Edit
                                                        </button>
                                                        <button className="link-button link-button-danger" type="button" onClick={() => handleDelete(schoolClass)}>
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

export default ClassesPage
