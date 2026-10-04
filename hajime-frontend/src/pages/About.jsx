import { Link } from 'react-router'
import aboutCampus from '../assets/about-campus.jpg'
import Footer from '../components/Footer'
import './About.css'

function About() {
  return (
    <>
      <main className="about-page">
        <header
          className="about-banner"
          style={{
            backgroundImage: `
              linear-gradient(
                0deg,
                rgba(10, 37, 64, 0.88) 0%,
                rgba(10, 37, 64, 0.5) 50%,
                rgba(30, 64, 140, 0.25) 100%
              ),
              url(${aboutCampus})
            `,
          }}
        >
          <div className="about-banner-inner">
            <p className="about-breadcrumb">
              <Link to="/">Home</Link> / About
            </p>
            <h1>About Hajime Academy</h1>
          </div>
        </header>

        <div className="about-content">
          <div className="about-box">
            <section className="about-section">
              <h2>Preparing students for life beyond the classroom</h2>

              <p>
                Established in 2012, Hajime Academy is a co-educational
                secondary school serving students from JS1 to SS3.
              </p>

              <p>
                Hajime Academy combines strong academic instruction with
                character development and practical skills. We provide a
                supportive environment where students can learn, grow and take
                responsibility for their future.
              </p>
            </section>

            <section className="about-section">
              <h2>Our mission</h2>
              <p>
                To provide quality education that develops knowledge, good
                character, confidence and a sense of responsibility in every
                student.
              </p>
            </section>

            <section className="about-section">
              <h2>Our vision</h2>
              <p>
                To raise knowledgeable, responsible and capable young people
                who contribute positively to their communities.
              </p>
            </section>

            <section className="about-section">
              <h2>Our core values</h2>

              <ul className="values-list">
                <li>
                  <strong>Excellence.</strong> We encourage every student to do
                  their best and keep improving.
                </li>
                <li>
                  <strong>Integrity.</strong> We act honestly and take
                  responsibility for our choices.
                </li>
                <li>
                  <strong>Respect.</strong> We value every member of our school
                  community.
                </li>
                <li>
                  <strong>Service.</strong> We use our knowledge and abilities
                  to help others.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default About
