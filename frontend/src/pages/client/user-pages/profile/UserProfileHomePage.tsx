import { Link } from 'react-router-dom'
import { useAuth } from '../../../../context/AuthContext'
import { getSubmissionQueue, useClientSubmissions } from '../../../../context/ClientSubmissionStore'
import './css/UserProfileHomePage.css'

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString()
}

function queueLabel(queue: ReturnType<typeof getSubmissionQueue>) {
  if (queue === 'approved') return 'Approved'
  if (queue === 'audit') return 'Community review'
  return 'Pending admin review'
}

export default function UserProfileHomePage() {
  const { customerUser } = useAuth()
  const { mySubmissions, mySubmissionsLoading, mySubmissionsError } = useClientSubmissions()
  const firstName = customerUser?.name.trim().split(/\s+/)[0] || 'Member'

  return (
    <div className="user-profile" data-theme="client">
      <main className="user-profile__shell">
        <header className="user-profile__header">
          <div>
            <p className="user-profile__eyebrow">Member profile</p>
            <h1>Welcome back, {firstName}</h1>
            <p className="user-profile__intro">Track the websites you have submitted and their progress through review.</p>
          </div>
          <Link className="user-profile__primary-link" to="/submit">Submit a website</Link>
        </header>

        <section className="user-profile__account" aria-label="Account details">
          <span className="user-profile__avatar" aria-hidden="true">{firstName.slice(0, 1).toUpperCase()}</span>
          <div>
            <strong>{customerUser?.name || 'Member account'}</strong>
            <span>{customerUser?.email || 'Account details unavailable'}</span>
          </div>
          <div className="user-profile__account-badge">
            <span className="material-symbols-outlined" aria-hidden="true">verified_user</span>
            Customer account
          </div>
        </section>

        <section className="user-profile__stats" aria-label="Submission summary">
          <article className="user-profile__stat">
            <span>Total submissions</span>
            <strong>{mySubmissionsLoading ? '—' : mySubmissions.length}</strong>
          </article>
          <article className="user-profile__stat">
            <span>In review</span>
            <strong>{mySubmissionsLoading ? '—' : mySubmissions.filter((item) => getSubmissionQueue(item) !== 'approved').length}</strong>
          </article>
          <article className="user-profile__stat">
            <span>Approved</span>
            <strong>{mySubmissionsLoading ? '—' : mySubmissions.filter((item) => getSubmissionQueue(item) === 'approved').length}</strong>
          </article>
        </section>

        <section className="user-profile__submissions" aria-labelledby="user-profile-submissions-title">
          <div className="user-profile__section-heading">
            <div>
              <p className="user-profile__eyebrow">Your activity</p>
              <h2 id="user-profile-submissions-title">My submissions</h2>
            </div>
            <Link to="/submit">New submission <span aria-hidden="true">→</span></Link>
            <Link to="/new-websites">Vote on new websites</Link>
          </div>

          {mySubmissionsLoading ? (
            <p className="user-profile__state" role="status">Loading your submissions…</p>
          ) : mySubmissionsError ? (
            <p className="user-profile__state user-profile__state--error" role="alert">{mySubmissionsError}</p>
          ) : mySubmissions.length === 0 ? (
            <div className="user-profile__empty">
              <span className="material-symbols-outlined" aria-hidden="true">language</span>
              <h3>No submissions yet</h3>
              <p>Share a useful website and follow its review progress here.</p>
              <Link to="/submit">Create your first submission</Link>
            </div>
          ) : (
            <div className="user-profile__list">
              {mySubmissions.map((submission) => {
                const queue = getSubmissionQueue(submission)
                return (
                  <article className="user-profile__submission" key={submission.id}>
                    <div className="user-profile__submission-mark" aria-hidden="true">
                      {submission.logoInitials || submission.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="user-profile__submission-copy">
                      <h3>{submission.name}</h3>
                      <a href={submission.url} target="_blank" rel="noopener noreferrer">{submission.url}</a>
                      <p>{submission.appearance}</p>
                      <span className="user-profile__submission-date">Submitted {formatDate(submission.submittedAt)}</span>
                    </div>
                    <div className={`user-profile__status user-profile__status--${queue}`} aria-label={`Status: ${queueLabel(queue)}`}>
                      <span className="user-profile__status-dot" />
                      {queueLabel(queue)}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
