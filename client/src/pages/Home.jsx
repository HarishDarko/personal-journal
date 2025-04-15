import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <h1>Welcome to Personal Journal</h1>
      <p>
        This application allows you to keep track of your daily thoughts, feelings, and experiences.
        Start journaling today to improve your mental well-being and self-awareness.
      </p>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/journals" className="btn">
          View My Journals
        </Link>
        <Link to="/journals/create" className="btn">
          Create New Entry
        </Link>
      </div>
      <div style={{ marginTop: '3rem' }}>
        <h2>Benefits of Journaling</h2>
        <ul style={{ marginLeft: '2rem', marginTop: '1rem' }}>
          <li>Reduces stress and anxiety</li>
          <li>Improves memory and comprehension</li>
          <li>Helps track personal growth over time</li>
          <li>Enhances creativity and problem-solving skills</li>
          <li>Provides a safe space for self-expression</li>
        </ul>
      </div>
    </div>
  )
}

export default Home
