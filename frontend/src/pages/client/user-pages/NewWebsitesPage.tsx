import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { useClientSubmissions } from '../../../context/ClientSubmissionStore'
import './css/NewWebsitesPage.css'

export default function NewWebsitesPage() {
  const { customerUser } = useAuth()
  const { clientVotingSubmissions, clientVotingLoading, clientVotingError, castVote } = useClientSubmissions()
  const [votingId, setVotingId] = useState('')
  const [notice, setNotice] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  async function voteForWebsite(id: string) {
    if (!customerUser?.id || votingId) return
    setVotingId(id)
    setNotice('')
    setErrorMessage('')
    try {
      const updated = await castVote(id, 'client', customerUser.id)
      setNotice(updated.queue === 'approved'
        ? `${updated.name} reached three community votes and was added to the Admin Directory.`
        : `Your vote for ${updated.name} was recorded (${updated.clientVotes.length}/3 community votes).`)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Your vote could not be recorded.')
    } finally {
      setVotingId('')
    }
  }

  return (
    <main className="new-websites" data-theme="client">
      <div className="new-websites__shell">
        <header className="new-websites__header">
          <div>
            <p className="new-websites__eyebrow">Community review queue</p>
            <h1>New websites</h1>
            <p>These submissions passed five admin votes. Cast one vote per website to help decide what enters the directory.</p>
          </div>
          <Link to="/profile">Back to profile</Link>
        </header>

        {notice && <p className="new-websites__notice" role="status">{notice}</p>}
        {errorMessage && <p className="new-websites__error" role="alert">{errorMessage}</p>}

        {clientVotingLoading ? (
          <p className="new-websites__state" role="status">Loading websites ready for community review…</p>
        ) : clientVotingError ? (
          <p className="new-websites__state new-websites__state--error" role="alert">{clientVotingError}</p>
        ) : clientVotingSubmissions.length === 0 ? (
          <section className="new-websites__empty">
            <span className="material-symbols-outlined" aria-hidden="true">how_to_vote</span>
            <h2>No websites need votes right now</h2>
            <p>Submissions appear here after five admins approve them for community review.</p>
            <Link to="/submit">Submit a website</Link>
          </section>
        ) : (
          <section className="new-websites__list" aria-label="Websites awaiting community votes">
            {clientVotingSubmissions.map((submission) => (
              <article className="new-websites__card" key={submission.id}>
                <div className="new-websites__card-mark" aria-hidden="true">
                  {submission.logoInitials || submission.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="new-websites__details">
                  <div className="new-websites__title-row">
                    <h2>{submission.name}</h2>
                    <span className="new-websites__progress">{submission.clientVotes.length}/3 community votes</span>
                  </div>
                  <a href={submission.url} target="_blank" rel="noopener noreferrer">{submission.url}</a>
                  <p className="new-websites__appearance">{submission.appearance}</p>
                  <p className="new-websites__description">{submission.description}</p>
                  <div className="new-websites__tags">
                    {submission.categories.map((category) => <span key={`category-${category}`}>{category}</span>)}
                    {submission.tags.map((tag) => <span key={`tag-${tag}`}>{tag}</span>)}
                  </div>
                </div>
                <button
                  type="button"
                  className="new-websites__vote"
                  disabled={Boolean(votingId)}
                  onClick={() => void voteForWebsite(submission.id)}
                >
                  {votingId === submission.id ? 'Recording…' : 'Vote'}
                </button>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  )
}
