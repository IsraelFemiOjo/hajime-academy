import { formatDate } from '../utils/format'

const audienceLabels = {
    all: 'Everyone',
    teachers: 'Teachers',
    students: 'Students',
}

// A list of announcements. Used on the Announcements page and the overview pages.
// onEdit and onDelete are only passed in for admins.
function AnnouncementList({ announcements, showAdminDetails = false, onEdit, onDelete, emptyText }) {
    if (announcements.length === 0) {
        return <p className="empty-state">{emptyText}</p>
    }

    return (
        <ul className="announcement-list">
            {announcements.map((announcement) => (
                <li key={announcement._id} className="announcement-item">
                    <div className="announcement-top">
                        <h3>{announcement.title}</h3>

                        {showAdminDetails && (
                            <div className="announcement-badges">
                                <span className="status-badge status-neutral">
                                    {audienceLabels[announcement.audience] || announcement.audience}
                                </span>
                                <span className={`status-badge status-${announcement.status}`}>
                                    {announcement.status}
                                </span>
                            </div>
                        )}
                    </div>

                    <p className="announcement-message">{announcement.message}</p>

                    <div className="announcement-bottom">
                        <p className="announcement-date">{formatDate(announcement.createdAt)}</p>

                        {(onEdit || onDelete) && (
                            <div className="table-actions">
                                {onEdit && (
                                    <button className="link-button" type="button" onClick={() => onEdit(announcement)}>
                                        Edit
                                    </button>
                                )}
                                {onDelete && (
                                    <button className="link-button link-button-danger" type="button" onClick={() => onDelete(announcement)}>
                                        Delete
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default AnnouncementList
