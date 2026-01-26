import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { QuizProvider } from './context/QuizContext'
import Home from './pages/Home'
import QuizSelect from './pages/QuizSelect'
import Play from './pages/Play'
import Score from './pages/Score'
import Leaderboard from './pages/Leaderboard'

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/quiz-select" element={<QuizSelect />} />
        <Route path="/play" element={<Play />} />
        <Route path="/score" element={<Score />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <QuizProvider>
      <Router>
        <div className="app">
          <AnimatedRoutes />
        </div>
      </Router>
    </QuizProvider>
  )
}

export default App
