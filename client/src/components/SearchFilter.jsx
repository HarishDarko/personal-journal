import { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import './SearchFilter.css'

const SearchFilter = ({ onFilterChange, allTags }) => {
  const [search, setSearch] = useState('')
  const [mood, setMood] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [sortField, setSortField] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  // Apply filters only when explicitly called
  const applyFilters = useCallback(() => {
    // Format dates to ensure consistent format (YYYY-MM-DD)
    // Only include dates if they are valid
    const formattedStartDate = startDate ? startDate : '';
    const formattedEndDate = endDate ? endDate : '';

    console.log('Applying date range:', {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      startDateObj: formattedStartDate ? new Date(formattedStartDate) : 'not set',
      endDateObj: formattedEndDate ? new Date(formattedEndDate) : 'not set'
    });

    const filters = {
      search,
      mood,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      tags: selectedTags.length > 0 ? selectedTags.join(',') : '',
      sortField,
      sortOrder
    }
    onFilterChange(filters)
  }, [search, mood, startDate, endDate, selectedTags, sortField, sortOrder, onFilterChange])

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSearch('')
    setMood('all')
    setStartDate('')
    setEndDate('')
    setSelectedTags([])
    setSortField('createdAt')
    setSortOrder('desc')

    // Apply the cleared filters immediately
    setTimeout(() => {
      onFilterChange({})
    }, 0)
  }

  return (
    <div className="search-filter">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search journals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              applyFilters();
            }
          }}
        />
        <button
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="filters" data-testid="filter-container">
          <div className="filter-group">
            <label>Mood:</label>
            <select value={mood} onChange={(e) => setMood(e.target.value)}>
              <option value="all">All Moods</option>
              <option value="happy">Happy</option>
              <option value="sad">Sad</option>
              <option value="neutral">Neutral</option>
              <option value="excited">Excited</option>
              <option value="anxious">Anxious</option>
              <option value="angry">Angry</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Date Range:</label>
            <div className="date-inputs">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
                aria-label="Start Date"
              />
              <span className="date-separator">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
                aria-label="End Date"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Sort By:</label>
            <div className="sort-inputs">
              <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
                <option value="createdAt">Date Created</option>
                <option value="title">Title</option>
                <option value="mood">Mood</option>
              </select>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          {allTags && allTags.length > 0 && (
            <div className="filter-group">
              <label>Tags:</label>
              <div className="tags-container">
                {allTags.map((tag) => (
                  <span
                    key={tag}
                    className={`filter-tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="filter-actions">
            <button className="apply-filters" onClick={applyFilters}>
              Apply Filters
            </button>
            <button className="clear-filters" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

SearchFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  allTags: PropTypes.arrayOf(PropTypes.string)
}

SearchFilter.defaultProps = {
  allTags: []
}

export default SearchFilter
