import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import JournalList from './pages/JournalList'
import JournalEntry from './pages/JournalEntry'
import CreateJournal from './pages/CreateJournal'
import EditJournal from './pages/EditJournal'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <main className="container">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/journals" element={<JournalList />} />
              <Route path="/journals/create" element={<CreateJournal />} />
              <Route path="/journals/:id" element={<JournalEntry />} />
              <Route path="/journals/edit/:id" element={<EditJournal />} />
            </Route>
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
