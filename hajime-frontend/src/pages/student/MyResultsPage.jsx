import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import NotEnrolledNotice from '../../components/NotEnrolledNotice'
import { NOT_ENROLLED_MESSAGE } from '../../utils/messages'
import useApiData from '../../hooks/useApiData'
import { subjectName } from '../../utils/format'

const terms = ['First Term', 'Second Term', 'Third Term']

// A student's own results, filtered by session and term
function MyResultsPage() {
    const results = useApiData('/api/results/me')

    const [session, setSession] = useState('')
    const [term, setTerm] = useState('')

    const resultList = results.data || []

    // Sessions this student has results for, newest first
    const sessions = [...new Set(resultList.map((result) => result.academicSession))].sort().reverse()

    const shownResults = resultList.filter((result) =>
        (!session || result.academicSession === session) &&
        (!term || result.term === term)
    )

    const average = shownResults.length
        ? Math.round(shownResults.reduce((sum, result) => sum + result.score, 0) / shownResults.length)
        : null

    return (
        <DashboardLayout>
            <div className="page-header">
                <div>
                    <h1>My results</h1>
                    <p>Your scores and grades for each subject.</p>
                </div>
            </div>

            {results.error === NOT_ENROLLED_MESSAGE && <NotEnrolledNotice />}

            {results.error !== NOT_ENROLLED_MESSAGE && (
                <section className="dashboard-panel">
                    {results.loading && <Loading message="Loading your results..." />}

                    {results.error && (
                        <ErrorMessage message={results.error} onRetry={results.reload} />
                    )}

                    {results.data && (
                        <>
                            <div className="filter-bar">
                                <div className="form-field">
                                    <label htmlFor="mySession">Session</label>
                                    <select id="mySession" value={session} onChange={(e) => setSession(e.target.value)}>
                                        <option value="">All sessions</option>
                                        {sessions.map((item) => (
                                            <option key={item} value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-field">
                                    <label htmlFor="myTerm">Term</label>
                                    <select id="myTerm" value={term} onChange={(e) => setTerm(e.target.value)}>
                                        <option value="">All terms</option>
                                        {terms.map((item) => (
                                            <option key={item} value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {shownResults.length === 0 ? (
                                <p className="empty-state">
                                    {resultList.length === 0
                                        ? 'No results have been recorded for you yet.'
                                        : 'No results for this session and term.'}
                                </p>
                            ) : (
                                <>
                                    <p className="table-count">
                                        {shownResults.length} subject{shownResults.length === 1 ? '' : 's'} · Average score {average}
                                    </p>

                                    <div className="table-wrapper">
                                        <table className="data-table">
                                            <thead>
                                                <tr>
                                                    <th>Subject</th>
                                                    <th>Session</th>
                                                    <th>Term</th>
                                                    <th>Score</th>
                                                    <th>Grade</th>
                                                    <th>Remarks</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {shownResults.map((result) => (
                                                    <tr key={result._id}>
                                                        <td>{subjectName(result.subject)}</td>
                                                        <td>{result.academicSession}</td>
                                                        <td>{result.term}</td>
                                                        <td>{result.score}</td>
                                                        <td>
                                                            <span className={`status-badge grade-${result.grade}`}>{result.grade}</span>
                                                        </td>
                                                        <td>{result.remarks}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </section>
            )}
        </DashboardLayout>
    )
}

export default MyResultsPage
