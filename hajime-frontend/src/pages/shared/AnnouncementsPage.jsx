import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import AnnouncementList from '../../components/AnnouncementList'
import apiRequest from '../../api/client'
import useAuth from '../../hooks/useAuth'
import useApiData from '../../hooks/useApiData'

const emptyForm = {
    title: '',
    message: '',
    audience: 'all',
    status: 'published',
}

// Admins write and manage announcements.
// Teachers and students only read them; the backend sends each role
// only the published announcements meant for them.
function AnnouncementsPage() {
    const { user } = useAuth()
    const isAdmin = user.role === 'admin'

    const announcements = useApiData('/api/announcements')

    const [actionError, setActionError] = useState('')
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

    const openEditForm = (announcement) => {
        setForm({
            title: announcement.title,
            message: announcement.message,
            audience: announcement.audience,
            status: announcement.status,
        })
        setEditingId(announcement._id)
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

        try {
            if (editingId) {
                await apiRequest(`/api/announcements/${editingId}`, { method: 'PATCH', body: form })
            } else {
                await apiRequest('/api/announcements', { method: 'POST', body: form })
            }
            closeForm()
            announcements.reload()
        } catch (err) {
            setFormError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (announcement) => {
        const confirmed = window.confirm(`Delete "${announcement.title}"? This cannot be undone.`)
        if (!confirmed) return

        setActionError('')
        try {
            await apiRequest(`/api/announcements/${announcement._id}`, { method: 'DELETE' })
            announcements.reload()
        } catch (err) {
            setActionError(err.message)
        }
    }

    return (
        <DashboardLayout>
            <div className="page-header">
                <div>
                    <h1>Announcements</h1>
                    <p>
                        {isAdmin
                            ? 'Share news with teachers, students or the whole school.'
                            : 'News and notices from the school.'}
                    </p>
                </div>

                {isAdmin && !showForm && (
                    <button className="btn" type="button" onClick={openAddForm}>
                        New announcement
                    </button>
                )}
            </div>

            {isAdmin && showForm && (
                <section className="dashboard-panel form-panel">
                    <h2>{editingId ? 'Edit announcement' : 'New announcement'}</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-field form-field-wide">
                                <label htmlFor="title">Title</label>
                                <input id="title" name="title" maxLength="150" value={form.title} onChange={handleChange} required />
                            </div>

                            <div className="form-field form-field-wide">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" name="message" rows="5" maxLength="2000" value={form.message} onChange={handleChange} required />
                            </div>

                            <div className="form-field">
                                <label htmlFor="audience">Who should see it</label>
                                <select id="audience" name="audience" value={form.audience} onChange={handleChange}>
                                    <option value="all">Everyone</option>
                                    <option value="teachers">Teachers only</option>
                                    <option value="students">Students only</option>
                                </select>
                            </div>

                            <div className="form-field">
                                <label htmlFor="status">Status</label>
                                <select id="status" name="status" value={form.status} onChange={handleChange}>
                                    <option value="published">Published (visible now)</option>
                                    <option value="draft">Draft (only admins can see it)</option>
                                </select>
                            </div>
                        </div>

                        {formError && <ErrorMessage message={formError} />}

                        <div className="form-actions">
                            <button className="btn" type="submit" disabled={saving}>
                                {saving ? 'Saving...' : editingId ? 'Save changes' : 'Post announcement'}
                            </button>
                            <button className="btn btn-secondary" type="button" onClick={closeForm}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="dashboard-panel">
                {announcements.loading && <Loading message="Loading announcements..." />}

                {announcements.error && (
                    <ErrorMessage message={announcements.error} onRetry={announcements.reload} />
                )}

                {announcements.data && (
                    <>
                        {actionError && <ErrorMessage message={actionError} />}

                        <AnnouncementList
                        announcements={announcements.data}
                        showAdminDetails={isAdmin}
                        onEdit={isAdmin ? openEditForm : null}
                        onDelete={isAdmin ? handleDelete : null}
                        emptyText={isAdmin ? 'No announcements yet. Click "New announcement" to post one.' : 'There are no announcements right now.'}
                        />
                    </>
                )}
            </section>
        </DashboardLayout>
    )
}

export default AnnouncementsPage
