// Shown to a student whose login is not linked to a school record yet
// (for example, someone who signed up on the Register page instead of
// being enrolled by the school).
function NotEnrolledNotice() {
    return (
        <div className="notice-box">
            <p className="notice-title">Your account is not linked to a student record yet</p>
            <p>
                Your results and attendance will appear here once the school office has enrolled you.
                If you were given a login by the school, sign in with that one instead.
            </p>
        </div>
    )
}

export default NotEnrolledNotice
