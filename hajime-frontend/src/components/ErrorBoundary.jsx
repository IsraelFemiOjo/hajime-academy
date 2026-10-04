import { Component } from 'react'
import crest from '../assets/crest.svg'
import '../pages/Auth.css'

// Catches any crash inside the app and shows this page
// instead of a blank white screen.
// React only allows this as a class component.
class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error, info) {
        console.error('App crashed:', error, info)
    }

    render() {
        if (this.state.hasError) {
            return (
                <main className="auth-page auth-page-full">
                    <section className="auth-panel">
                        <div className="auth-header">
                            <img className="auth-logo" src={crest} alt="" />
                            <h1>Something went wrong</h1>
                            <p className="auth-intro">
                                Please reload the page. If the problem continues, try again later.
                            </p>
                        </div>

                        <button
                        className="auth-button"
                        type="button"
                        onClick={() => window.location.reload()}
                        >
                            Reload page
                        </button>

                        <p className="auth-switch">
                            <a href="/">Return to the homepage</a>
                        </p>
                    </section>
                </main>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
