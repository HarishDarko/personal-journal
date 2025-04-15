import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const JournalItem = ({ journal }) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="journal">
      <h3>{journal.title}</h3>
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
      <p className="journal-content">
        {journal.content.length > 150
          ? `${journal.content.substring(0, 150)}...`
          : journal.content}
      </p>
      <div className="journal-actions">
        <Link to={`/journals/${journal._id}`} className="btn">
          View
        </Link>
        <Link to={`/journals/edit/${journal._id}`} className="btn">
          Edit
        </Link>
      </div>
    </div>
  )
}

JournalItem.propTypes = {
  journal: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    mood: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
}

export default JournalItem
