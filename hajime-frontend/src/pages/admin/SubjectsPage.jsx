import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import apiRequest from '../../api/client'
import useApiData from '../../hooks/useApiData'
import { fullName, matchesSearch, subjectForClass, subjectName } from '../../utils/format'

const emptyForm = {
    name: '',
    className: '',
    teacher: '',
    description: '',
    status: 'active',
}

// Admin only: subjects, each taught by a teacher in a class.
// The admin types just "Mathematics"; the page saves it with the class attached
// (see subjectForClass in utils/format.js) so every class can have its own Mathematics.
function SubjectsPage() {
    const subjects = useApiData('/api/subjects')
    const classes = useApiData('/api/classes')
    const teachers = useApiData('/api/teachers')

    const [search, setSearch] = useState('')
    const [actionError, setActionError] = useState('')

    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)
    const [formError, setFormError] = useState('')

    const subjectList = subjects.data || []
    const classList = classes.data || []
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

    const openEditForm = (subject) => {
        setForm({
            name: subjectName(subject),
            className: subject.className?._id || '',
            teacher: subject.teacher?._id || '',
            description: subject.description || '',
            status: subject.status,
        })
        setEditingId(subject._id)
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

        const schoolClass = classList.find((item) => item._id === form.className)
        const body = { ...form, ...subjectForClass(form.name, schoolClass ? schoolClass.name : '') }

        try {
            if (editingId) {
                await apiRequest(`/api/subjects/${editingId}`, { method: 'PATCH', body })
            } else {
                await apiRequest('/api/subjects', { method: 'POST', body })
            }
            closeForm()
            subjects.reload()
        } catch (err) {
            setFormError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (subject) => {
        const confirmed = window.confirm(`Delete ${subjectName(subject)} for ${subject.className?.name || 'this class'}? This cannot be undone.`)
        if (!confirmed) return

        setActionError('')
        try {
            await apiRequest(`/api/subjects/${subject._id}`, { method: 'DELETE' })
            subjects.reload()
        } catch (err) {
            setActionError(err.message)
        }
    }

    const shownSubjects = subjectList.filter((subject) =>
        matchesSearch(search, [
            subjectName(subject),
            subject.className?.name,
            fullName(subject.teacher),
        ])
    )

    return (
        <DashboardLayout>
            <div className="page-header">
                <div>
                    <h1>Subjects</h1>
                    <p>Add the subjects taught in each class and who teaches them.</p>
                </div>

                {!showForm && (
                    <button className="btn" type="button" onClick={openAddForm}>
                        Add subject
                    </button>
                )}
            </div>

            {showForm && (
                <section className="dashboard-panel form-panel">
                    <h2>{editingId ? 'Edit subject' : 'Add subject'}</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-field">
                                <label htmlFor="name">Subject name</label>
                                <input id="name" name="name" placeholder="e.g. Mathematics" value={form.name} onChange={handleChange} required />
                            </div>

                            <div className="form-field">
                                <label htmlFor="className">Class</label>
                                <select id="className" name="className" value={form.className} onChange={handleChange} required>
                                    <option value="">
                                        {classList.length === 0 ? 'No classes yet. Add a class first' : 'Select class'}
                                    </option>
                                    {classList.map((schoolClass) => (
                                        <option key={schoolClass._id} value={schoolClass._id}>{schoolClass.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field">
                                <label htmlFor="teacher">Teacher</label>
                                <select id="teacher" name="teacher" value={form.teacher} onChange={handleChange} required>
                                    <option value="">
                                        {teacherList.length === 0 ? 'No teachers yet. Add a teacher first' : 'Select teacher'}
                                    </option>
                                    {teacherList.map((teacher) => (
                                        <option key={teacher._id} value={teacher._id}>{fullName(teacher)}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field form-field-wide">
                                <label htmlFor="description">Description (optional)</label>
                                <textarea id="description" name="description" rows="3" value={form.description} onChange={handleChange} />
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
                                {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add subject'}
                            </button>
                            <button className="btn btn-secondary" type="button" onClick={closeForm}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="dashboard-panel">
                {subjects.loading && <Loading message="Loading subjects..." />}

                {subjects.error && (
                    <ErrorMessage message={subjects.error} onRetry={subjects.reload} />
                )}

                {subjects.data && (
                    <>
                        {actionError && <ErrorMessage message={actionError} />}

                        <div className="table-toolbar">
                            <input
                                className="search-input"
                                type="search"
                                placeholder="Search by subject, class or teacher"
                                aria-label="Search subjects"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <p className="table-count">
                                {shownSubjects.length} of {subjectList.length} subjects
                            </p>
                        </div>

                        {shownSubjects.length === 0 ? (
                            <p className="empty-state">
                                {subjectList.length === 0
                                    ? 'No subjects yet. Click "Add subject" to add the first one.'
                                    : 'No subjects match your search.'}
                            </p>
                        ) : (
                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Subject</th>
                                            <th>Class</th>
                                            <th>Teacher</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shownSubjects.map((subject) => (
                                            <tr key={subject._id}>
                                                <td>{subjectName(subject)}</td>
                                                <td>{subject.className?.name || '—'}</td>
                                                <td>{fullName(subject.teacher)}</td>
                                                <td>
                                                    <span className={`status-badge status-${subject.status}`}>
                                                        {subject.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button className="link-button" type="button" onClick={() => openEditForm(subject)}>
                                                            Edit
                                                        </button>
                                                        <button className="link-button link-button-danger" type="button" onClick={() => handleDelete(subject)}>
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

export default SubjectsPage
