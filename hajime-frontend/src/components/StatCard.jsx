import { Link } from 'react-router'

// A white box showing one number, e.g. "Students: 120".
// If "to" is given, the whole box links to that page.
function StatCard({ label, value, to }) {
    const content = (
        <>
            <p className="stat-label">{label}</p>
            <p className="stat-value">{value}</p>
        </>
    )

    if (to) {
        return (
            <Link className="stat-card" to={to}>
                {content}
            </Link>
        )
    }

    return <div className="stat-card">{content}</div>
}

export default StatCard
