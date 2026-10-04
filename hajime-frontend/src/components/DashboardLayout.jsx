import { NavLink } from 'react-router'
import useAuth from '../hooks/useAuth'
import './DashboardLayout.css'
import './DashboardUI.css'

// Sidebar links for each role.
// To add a page: add its link here and its route in App.jsx.
const sidebarLinks = {
    admin: [
        { to: '/admin', label: 'Overview' },
        { to: '/admin/students', label: 'Students' },
        { to: '/admin/teachers', label: 'Teachers' },
        { to: '/admin/classes', label: 'Classes' },
        { to: '/admin/subjects', label: 'Subjects' },
        { to: '/admin/announcements', label: 'Announcements' },
    ],
    teacher: [
        { to: '/teacher', label: 'Overview' },
    ],
    student: [
        { to: '/student', label: 'Overview' },
    ],
}

function DashboardLayout({ children }) {
    const { user } = useAuth()
    const links = sidebarLinks[user.role] || []

    return(
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <h2>{user.role} Portal</h2>

                <nav className="dashboard-nav">
                    {links.map((link) => (
                        // "end" stops Overview from staying highlighted on every sub-page
                        <NavLink key={link.to} to={link.to} end>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            <main className="dashboard-main">
                {children}
            </main>
        </div>
    )
}

export default DashboardLayout
