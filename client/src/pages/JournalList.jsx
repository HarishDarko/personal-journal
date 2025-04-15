import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import JournalItem from '../components/JournalItem'
import SearchFilter from '../components/SearchFilter'
import { getJournalEntries } from '../services/journalService'

const JournalList = () => {
  const [journals, setJournals] = useState([])
  const [allTags, setAllTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({})

  // Extract unique tags from all journal entries
  const extractTags = (journalEntries) => {
    const tagsSet = new Set()
    journalEntries.forEach(journal => {
      journal.tags.forEach(tag => tagsSet.add(tag))
    })
    return Array.from(tagsSet)
  }

  const fetchJournals = useCallback(async (filterParams = {}) => {
    try {
      setLoading(true)
      const response = await getJournalEntries(filterParams)
      setJournals(response.data)

      // Only update tags when fetching without filters or on initial load
      if (Object.keys(filterParams).length === 0) {
        setAllTags(extractTags(response.data))
      }

      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }, [])

  // Initial fetch of journals
  useEffect(() => {
    fetchJournals()
  }, [fetchJournals])

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters)

    // Log date range filters for debugging
    if (newFilters.startDate || newFilters.endDate) {
      console.log('Date range filter applied:', {
        startDate: newFilters.startDate,
        endDate: newFilters.endDate
      });
    }

    // Only fetch if we have actual filters
    if (Object.keys(newFilters).length > 0) {
      fetchJournals(newFilters)
    } else {
      // If filters were cleared, fetch all journals
      fetchJournals({})
    }
  }, [fetchJournals])

  if (loading && journals.length === 0) {
    return <div className="loading">Loading...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>My Journal Entries</h1>
        <Link to="/journals/create" className="btn">
          Add New Entry
        </Link>
      </div>

      <SearchFilter onFilterChange={handleFilterChange} allTags={allTags} />

      {loading && <div className="loading">Updating results...</div>}

      {!loading && journals.length === 0 ? (
        <div className="no-results">
          <p>No journal entries found matching your criteria.</p>
          {Object.keys(filters).some(key => filters[key]) && (
            <p>Try adjusting your filters or <button onClick={() => handleFilterChange({})}>clear all filters</button>.</p>
          )}
        </div>
      ) : (
        <div className="journal-list">
          {journals.map((journal) => <JournalItem key={journal._id} journal={journal} />)}
        </div>
      )}
    </div>
  )
}

export default JournalList
