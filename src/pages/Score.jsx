import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuiz } from '../context/QuizContext'

const containerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
}

const confettiColors = ['#32b7bc', '#8970d4', '#de6c66', '#F9BC06', '#20c997']

function Confetti() {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      size: 5 + Math.random() * 10
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="confetti-container">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            width: p.size,
            height: p.size
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ 
            y: '100vh', 
            opacity: 0,
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1)
          }}
          transition={{ 
            duration: p.duration,
            delay: p.delay,
            ease: "linear",
            repeat: Infinity
          }}
        />
      ))}
    </div>
  )
}

function Score() {
  const navigate = useNavigate()
  const { userName, score, totalQuestions, quizStatus, category } = useQuiz()
  const [showConfetti, setShowConfetti] = useState(false)

  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
  const isPassed = quizStatus === 'PASSED'

  useEffect(() => {
    if (isPassed) {
      setShowConfetti(true)
    }
  }, [isPassed])

  useEffect(() => {
    if (!totalQuestions) {
      navigate('/')
    }
  }, [totalQuestions, navigate])

  const getMessage = () => {
    if (percentage >= 90) return "Outstanding! You're a master!"
    if (percentage >= 70) return "Great job! Well done!"
    if (percentage >= 50) return "Good effort! You passed!"
    return "Keep practicing! You'll get better!"
  }

  const getEmoji = () => {
    if (percentage >= 90) return "🏆"
    if (percentage >= 70) return "🎉"
    if (percentage >= 50) return "👍"
    return "💪"
  }

  return (
    <motion.div
      className="score-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {showConfetti && <Confetti />}

      <motion.div 
        className="score-card"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Status Badge */}
        <motion.div 
          className={`status-badge ${isPassed ? 'passed' : 'failed'}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
        >
          {isPassed ? '✅ PASSED' : '❌ FAILED'}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Quiz Completed!
        </motion.h1>

        <motion.p 
          className="player-name"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Well done, <span>{userName}</span>!
        </motion.p>

        {/* Score Circle */}
        <motion.div 
          className="score-circle"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        >
          <svg viewBox="0 0 120 120" className="score-ring">
            <circle
              className="score-ring-bg"
              cx="60"
              cy="60"
              r="54"
            />
            <motion.circle
              className={`score-ring-progress ${isPassed ? 'passed' : 'failed'}`}
              cx="60"
              cy="60"
              r="54"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: percentage / 100 }}
              transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="score-value">
            <motion.span 
              className="percentage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {percentage}%
            </motion.span>
            <span className="score-detail">{score} / {totalQuestions}</span>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div 
          className="result-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <span className="emoji">{getEmoji()}</span>
          <p>{getMessage()}</p>
        </motion.div>

        {/* Category Badge */}
        <motion.div 
          className="category-completed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          Category: <span>{category?.toUpperCase()}</span>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="score-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
        >
          <motion.button
            className="btn btn-primary"
            onClick={() => navigate('/quiz-select')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 Play Again
          </motion.button>
          <motion.button
            className="btn btn-secondary1"
            onClick={() => navigate('/leaderboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🏆 Leaderboard
          </motion.button>
          <motion.button
            className="btn btn-outline"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🏠 Home
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Score
