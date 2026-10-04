import { Link } from "react-router"
import crest from "../assets/crest.svg"
import './Auth.css'

function NotFound() {
    return(
        <main className="auth-page">
            <section className="auth-panel">
                <div className="auth-header">
                    <img className="auth-logo" src={crest} alt="" />
                    <h1>Page not found</h1>
                    <p className="auth-intro">
                        The page you are looking for does not exist or may have been moved.
                    </p>
                </div>

                <Link className="auth-button" to="/">Return to the homepage</Link>
            </section>
        </main>
    )
}

export default NotFound
