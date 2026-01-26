import { createContext, useContext, useState, useEffect } from 'react'

const QuizContext = createContext()

export function useQuiz() {
  return useContext(QuizContext)
}

export function QuizProvider({ children }) {
  const [userName, setUserName] = useState('')
  const [category, setCategory] = useState('')
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [quizStatus, setQuizStatus] = useState('')
  const [leaderboard, setLeaderboard] = useState([])

  // Load leaderboard from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('quizLeaderboard')
    if (saved) {
      setLeaderboard(JSON.parse(saved))
    }
  }, [])

  // Save to leaderboard
  const saveToLeaderboard = (name, score, total, category) => {
    const newEntry = {
      id: Date.now(),
      name,
      score,
      total,
      category,
      percentage: Math.round((score / total) * 100),
      date: new Date().toLocaleDateString()
    }
    
    const updated = [...leaderboard, newEntry]
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10) // Keep top 10
    
    setLeaderboard(updated)
    localStorage.setItem('quizLeaderboard', JSON.stringify(updated))
  }

  const resetQuiz = () => {
    setScore(0)
    setTotalQuestions(0)
    setQuizStatus('')
  }

  const value = {
    userName,
    setUserName,
    category,
    setCategory,
    score,
    setScore,
    totalQuestions,
    setTotalQuestions,
    quizStatus,
    setQuizStatus,
    leaderboard,
    saveToLeaderboard,
    resetQuiz
  }

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  )
}
