import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createJournalEntry } from '../services/journalService'

const CreateJournal = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('neutral')
  const [tags, setTags] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !content) {
      setError('Please add a title and content')
      return
    }

    try {
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '')

      await createJournalEntry({
        title,
        content,
        mood,
        tags: tagsArray
      })

      navigate('/journals')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div>
      <Link to="/journals" className="btn" style={{ marginBottom: '1rem' }}>
        Back to Journals
      </Link>
      <h1>Create New Journal Entry</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
          />
        </div>
        <div className="form-control">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your journal entry here..."
          ></textarea>
        </div>
        <div className="form-control">
          <label htmlFor="mood">Mood</label>
          <select id="mood" value={mood} onChange={(e) => setMood(e.target.value)}>
            <option value="happy">Happy</option>
            <option value="sad">Sad</option>
            <option value="neutral">Neutral</option>
            <option value="excited">Excited</option>
            <option value="anxious">Anxious</option>
            <option value="angry">Angry</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-control">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. work, family, health"
          />
        </div>
        <button type="submit" className="btn btn-block">
          Save Journal Entry
        </button>
      </form>
    </div>
  )
}

export default CreateJournal
