import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { useClientSubmissions } from '../../../context/ClientSubmissionStore'
import './css/UserSubmitWeb.css'

const categories = ['AI & ML', 'Dev Tools', 'Design & UI', 'SaaS & Cloud', 'Media & Audio']
const tags = ['#developer-tools', '#selfhosted', '#freemium']

export default function UserSubmitWeb() {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const { addSubmission } = useClientSubmissions()
  const [relationship, setRelationship] = useState('creator')
  const [rating, setRating] = useState('5')
  const [categoryItems, setCategoryItems] = useState(categories)
  const [tagItems, setTagItems] = useState(tags)
  const [selectedCategories, setSelectedCategories] = useState(categories.slice(0, 3))
  const [selectedTags, setSelectedTags] = useState(tags)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [newTag, setNewTag] = useState('')
  const [submitMessage, setSubmitMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const ratingDescriptions: Record<string, string> = {
    '5': 'Excellent: a site you would strongly recommend.',
    '4': 'Very good: useful and worth recommending.',
    '3': 'Good: does what you need, with some room to improve.',
    '2': 'Below average: has notable limitations.',
    '1': 'Poor: did not meet your expectations.',
  }

  const addCategory = () => {
    const category = newCategory.trim()
    if (category) {
      setCategoryItems((items) => items.includes(category) ? items : [...items, category])
      setSelectedCategories((items) => items.includes(category) ? items : [...items, category])
      setNewCategory('')
      setIsAddingCategory(false)
    }
  }

  const addCategoryOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    addCategory()
  }

  const addTag = () => {
    const tagText = newTag.trim().replace(/^#+/, '').toLowerCase().replace(/\s+/g, '-')
    const tag = tagText ? `#${tagText}` : ''
    if (tag) {
      setTagItems((items) => items.includes(tag) ? items : [...items, tag])
      setSelectedTags((items) => items.includes(tag) ? items : [...items, tag])
      setNewTag('')
      setIsAddingTag(false)
    }
  }

  const addTagOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    addTag()
  }

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <h2 style={{ margin: 0, color: '#0f172a' }}>Please log in to submit a website</h2>
        <p style={{ margin: 0, color: '#475569' }}>Create a customer account or sign in to continue.</p>
        <button
          type="button"
          onClick={() => navigate('/login')}
          style={{
            background: '#0f172a',
            color: '#fff',
            border: 'none',
            borderRadius: '0.7rem',
            padding: '0.8rem 1.25rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Go to login
        </button>
      </div>
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const fieldValue = (name: string) => String(formData.get(name) ?? '').trim()
    const contactEmail = fieldValue('contact-email')

    setIsSubmitting(true)
    setSubmitMessage('')
    try {
      await addSubmission({
        name: fieldValue('site-name'),
        url: fieldValue('site-url'),
        submittedBy: contactEmail || 'community-member',
        status: 'Hidden',
        appearance: fieldValue('site-tagline'),
        description: fieldValue('description'),
        categories: selectedCategories,
        tags: selectedTags,
        username: contactEmail || 'community-member',
        role: relationship === 'creator' ? 'Owner' : 'Community',
      })
      setSubmitMessage('Website submitted for review.')
    } catch (error) {
      setSubmitMessage(error instanceof Error ? error.message : 'Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="user-submit">
      <div className="user-submit__shell">
        <header className="user-submit__header">
          <div className="user-submit__eyebrow">Community submission • open for all</div>
          <h1>
            Suggest a <span>New Website</span>
          </h1>
          <p>
            Found a hidden gem, indie tool, or game-changing web app? Share it with
            the community and help members discover something worth bookmarking.
          </p>
        </header>

        <div className="user-submit__layout">
          <form className="user-submit__form" onSubmit={handleSubmit}>
            <section className="user-submit__section">
              <div className="user-submit__section-head">
                <div className="user-submit__section-title">
                  <span className="material-symbols-outlined" aria-hidden="true">link</span>
                  <span>1. Website details</span>
                </div>
                <span className="user-submit__pill">Auto-scan</span>
              </div>

              <div className="user-submit__field-grid">
                <div className="user-submit__field user-submit__field--full">
                  <label htmlFor="site-url">
                    Website link <span className="user-submit__required">*</span>
                  </label>
                  <input id="site-url" name="site-url" type="url" defaultValue="https://example.com" />
                </div>

                <div className="user-submit__field">
                  <label htmlFor="site-name">
                    Website name <span className="user-submit__required">*</span>
                  </label>
                  <input id="site-name" name="site-name" type="text" defaultValue="Latent Space Engine" />
                </div>

                <div className="user-submit__field">
                  <label htmlFor="site-monogram">Logo initials</label>
                  <input id="site-monogram" type="text" defaultValue="LSE" />
                </div>

                <div className="user-submit__field user-submit__field--full">
                  <label htmlFor="site-tagline">
                    Short description <span className="user-submit__required">*</span>
                  </label>
                  <input
                    id="site-tagline"
                    name="site-tagline"
                    type="text"
                    defaultValue="Autonomous vector synthesis and diffusion exploration sandbox"
                  />
                </div>
              </div>
            </section>

            <section className="user-submit__section">
              <div className="user-submit__section-head">
                <div className="user-submit__section-title">
                  <span className="material-symbols-outlined" aria-hidden="true">category</span>
                  <span>2. Categories &amp; tags</span>
                </div>
                <span className="user-submit__pill">Multi-select</span>
              </div>

              <div className="user-submit__field">
                <label>
                  Main categories <span className="user-submit__required">*</span>
                </label>
                <div className="user-submit__category-list">
                  {categoryItems
                    .filter((category) => category.toLowerCase().includes(newCategory.trim().toLowerCase()))
                    .map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`user-submit__chip ${selectedCategories.includes(category) ? 'user-submit__chip--active' : ''}`}
                      aria-pressed={selectedCategories.includes(category)}
                      onClick={() => setSelectedCategories((items) => (
                        items.includes(category)
                          ? items.filter((item) => item !== category)
                          : [...items, category]
                      ))}
                    >
                      {category}
                    </button>
                  ))}
                  <div className="user-submit__add-control">
                    <button
                      type="button"
                      className={`user-submit__chip-plus ${isAddingCategory ? 'user-submit__chip--active' : ''}`}
                      aria-label="Add a category"
                      aria-expanded={isAddingCategory}
                      aria-controls="new-category-input"
                      onClick={() => {
                        setNewCategory('')
                        setIsAddingCategory((isOpen) => !isOpen)
                      }}
                    >
                      +
                    </button>
                    {isAddingCategory && (
                      <div className="user-submit__add-popover">
                        <span className="user-submit__popover-caret" aria-hidden="true" />
                        <span className="user-submit__popover-caret user-submit__popover-caret--secondary" aria-hidden="true" />
                        <input
                          id="new-category-input"
                          className="user-submit__add-input"
                          type="text"
                          placeholder="New category"
                          aria-label="New category"
                          autoFocus
                          value={newCategory}
                          onChange={(event) => setNewCategory(event.target.value)}
                          onKeyDown={addCategoryOnEnter}
                        />
                        <button
                          type="button"
                          className="user-submit__popover-add"
                          aria-label="Add category"
                          disabled={!newCategory.trim()}
                          onClick={addCategory}
                        >
                          &gt;
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="user-submit__field" style={{ marginTop: '1rem' }}>
                <label htmlFor="new-tag-input">Community tags</label>
                <div className="user-submit__tag-list" id="tag-input-list">
                  {tagItems
                    .filter((tag) => tag.toLowerCase().includes(newTag.trim().toLowerCase()))
                    .map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`user-submit__chip ${selectedTags.includes(tag) ? 'user-submit__chip--active' : ''}`}
                      aria-pressed={selectedTags.includes(tag)}
                      onClick={() => setSelectedTags((items) => (
                        items.includes(tag)
                          ? items.filter((item) => item !== tag)
                          : [...items, tag]
                      ))}
                    >
                      {tag}
                    </button>
                  ))}
                  <div className="user-submit__add-control">
                    <button
                      type="button"
                      className={`user-submit__chip-plus ${isAddingTag ? 'user-submit__chip--active' : ''}`}
                      aria-label="Add a tag"
                      aria-expanded={isAddingTag}
                      aria-controls="new-tag-input"
                      onClick={() => {
                        setNewTag('')
                        setIsAddingTag((isOpen) => !isOpen)
                      }}
                    >
                      +
                    </button>
                    {isAddingTag && (
                      <div className="user-submit__add-popover">
                        <span className="user-submit__popover-caret" aria-hidden="true" />
                        <span className="user-submit__popover-caret user-submit__popover-caret--secondary" aria-hidden="true" />
                        <input
                          id="new-tag-input"
                          className="user-submit__add-input"
                          type="text"
                          placeholder="New tag"
                          aria-label="New tag"
                          autoFocus
                          value={newTag}
                          onChange={(event) => setNewTag(event.target.value)}
                          onKeyDown={addTagOnEnter}
                        />
                        <button
                          type="button"
                          className="user-submit__popover-add"
                          aria-label="Add tag"
                          disabled={!newTag.trim()}
                          onClick={addTag}
                        >
                          &gt;
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="user-submit__chips-caption">Search to find existing categories and tags you need.</div>
              </div>
            </section>

            <section className="user-submit__section">
              <div className="user-submit__section-head">
                <div className="user-submit__section-title">
                  <span className="material-symbols-outlined" aria-hidden="true">stars</span>
                  <span>3. Your rating &amp; connection</span>
                </div>
              </div>

              <div className="user-submit__field-grid">
                <div className="user-submit__field">
                  <label htmlFor="relationship">Relationship to this website</label>
                    <select
                      id="relationship"
                      value={relationship}
                      onChange={(event) => setRelationship(event.target.value)}
                    >
                    <option value="user">I use this site</option>
                    <option value="creator">I made this</option>
                    <option value="curator">I just found it</option>
                  </select>
                </div>

                {relationship === 'creator' ? (
                  <>
                    <div className="user-submit__field user-submit__field--full">
                      <label htmlFor="contact-email">
                        Your contact email <span className="user-submit__required">*</span>
                      </label>
                      <input
                        id="contact-email"
                        name="contact-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        required
                      />
                      <small className="user-submit__field-hint">
                        We may contact you here to confirm your connection to the website.
                      </small>
                    </div>

                    <fieldset className="user-submit__verification user-submit__field--full">
                      <legend>Ownership verification</legend>
                      <div>
                        <label className="user-submit__check">
                          <input type="checkbox" required />
                          <span> I own this website or am authorized to submit it.</span>
                        </label>
                      </div>
                      <div>
                        <label className="user-submit__check">
                          <input type="checkbox" required />
                          <span> I can verify my connection if the review team requests it.</span>
                        </label>
                      </div>
                    </fieldset>
                  </>
                ) : (
                  <div className="user-submit__field">
                    <label htmlFor="rating">Your rating</label>
                    <select
                      id="rating"
                      value={rating}
                      onChange={(event) => setRating(event.target.value)}
                      aria-describedby="rating-description"
                    >
                      <option value="5">★★★★★ 5.0</option>
                      <option value="4">★★★★☆ 4.0</option>
                      <option value="3">★★★☆☆ 3.0</option>
                      <option value="2">★★☆☆☆ 2.0</option>
                      <option value="1">★☆☆☆☆ 1.0</option>
                    </select>
                    <small id="rating-description" className="user-submit__field-hint">
                      {ratingDescriptions[rating]}
                    </small>
                  </div>
                )}
              </div>
            </section>

            <section className="user-submit__section">
              <div className="user-submit__section-head">
                <div className="user-submit__section-title">
                  <span className="material-symbols-outlined" aria-hidden="true">description</span>
                  <span>4. What does it do?</span>
                </div>
              </div>

              <div className="user-submit__field">
                <label htmlFor="description">
                  Why do you recommend it? <span className="user-submit__required">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue="Latent Space Engine connects heterogeneous diffusion checkpoints with zero latency via local WebGPU shaders. It helps teams explore semantic latent space, compare models, and fine-tune parameters without needing expensive infrastructure."
                />
              </div>
            </section>

            {submitMessage && <p className="user-submit__submit-message" role="status">{submitMessage}</p>}
            <button type="submit" className="user-submit__submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Submit website for review →'}
            </button>
          </form>

          <aside className="user-submit__side-stack">
            <div className="user-submit__panel user-submit__preview">
              <div className="user-submit__preview-header">
                <h3>Live preview</h3>
                <span className="user-submit__pill">Real-time</span>
              </div>

              <div className="user-submit__preview-card">
                <div className="user-submit__logo">LSE</div>
                <div className="user-submit__preview-copy">
                  <strong>Latent Space Engine</strong>
                  <span>Autonomous vector synthesis and diffusion exploration sandbox</span>
                </div>
              </div>

              <div className="user-submit__preview-meta">
                {selectedCategories.map((category) => (
                  <span key={`category-${category}`} className="user-submit__meta-tag">{category}</span>
                ))}
                {selectedTags.map((tag) => (
                  <span key={`tag-${tag}`} className="user-submit__meta-tag">{tag}</span>
                ))}
              </div>
            </div>

            <div className="user-submit__panel">
              <ul className="user-submit__rules">
                <li>
                  <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
                  <span>No spam, fake sites, or parked domains.</span>
                </li>
                <li>
                  <span className="material-symbols-outlined" aria-hidden="true">lock</span>
                  <span>Use a working public URL with HTTPS.</span>
                </li>
                <li>
                  <span className="material-symbols-outlined" aria-hidden="true">tune</span>
                  <span>Fair community ratings keep the directory useful.</span>
                </li>
              </ul>
            </div>

            <div className="user-submit__panel user-submit__queue">
              <div className="user-submit__queue-info">
                <div className="user-submit__queue-badge">
                  <span className="material-symbols-outlined" aria-hidden="true">hourglass_top</span>
                </div>
                <div>
                  <small>Current queue</small>
                  <strong>14 websites in review</strong>
                </div>
              </div>

              <div className="user-submit__queue-time">
                <strong>~15 min</strong>
                <small>avg wait</small>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
