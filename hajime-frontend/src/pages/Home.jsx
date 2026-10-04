import { Link } from 'react-router'
import useAuth from '../hooks/useAuth'
import heroStudents from '../assets/hero-students.jpeg'
import Footer from '../components/Footer'
import './Home.css'

function Home() {
  const { user } = useAuth()

  return (
    <>
      <main className="home-page">
        <section
          className="home-hero"
          style={{
            backgroundImage: `
              linear-gradient(
                0deg,
                rgba(10, 37, 64, 0.88) 0%,
                rgba(10, 37, 64, 0.45) 45%,
                rgba(30, 64, 140, 0.2) 100%
              ),
              url(${heroStudents})
            `,
          }}
        >
          <div className="home-hero-inner">
            <h1>Welcome to Hajime Academy</h1>

            <p className="home-hero-text">
              A co-educational secondary school.
            </p>

            {/* Logged in: go to your dashboard. Logged out: log in or register */}
            <div className="home-hero-actions">
              {user ? (
                <Link className="home-login-button" to={`/${user.role}`}>
                  Go to your dashboard
                </Link>
              ) : (
                <>
                  <Link className="home-login-button" to="/login">
                    Portal login
                  </Link>

                  <p className="home-register-note">
                    New student? <Link to="/register">Create your account</Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        <div className="home-content">
          <section className="home-box" aria-labelledby="portal-heading">
            <h2 id="portal-heading">About the portal</h2>
            <p>
              Students, teachers and administrators use the Hajime Academy
              portal to manage attendance, assignments, results and school
              announcements.
            </p>
            <Link className="home-text-link" to="/about">
              Read more about the school
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default Home
