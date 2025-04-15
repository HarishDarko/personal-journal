import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getJournalEntry, deleteJournalEntry } from '../services/journalService'

const JournalEntry = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [journal, setJournal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        setLoading(true)
        const response = await getJournalEntry(id)
        setJournal(response.data)
        setLoading(false)
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }

    fetchJournal()
  }, [id])

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        await deleteJournalEntry(id)
        navigate('/journals')
      } catch (error) {
        setError(error.message)
      }
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!journal) {
    return <div className="error">Journal entry not found</div>
  }

  return (
    <div>
      <Link to="/journals" className="btn" style={{ marginBottom: '1rem' }}>
        Back to Journals
      </Link>
      <div className="journal" style={{ marginTop: '1rem' }}>
        <h1>{journal.title}</h1>
        <p className="journal-date">{formatDate(journal.createdAt)}</p>
        <div>
          <span className={`journal-mood ${journal.mood}`}>{journal.mood}</span>
          <div className="journal-tags">
            {journal.tags.map((tag, index) => (
              <span key={index} className="journal-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="journal-content" style={{ marginTop: '2rem' }}>
          {journal.content}
        </div>
        <div className="journal-actions" style={{ marginTop: '2rem' }}>
          <Link to={`/journals/edit/${journal._id}`} className="btn">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default JournalEntry
