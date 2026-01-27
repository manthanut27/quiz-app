import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuiz } from '../context/QuizContext'

/* -------------------- Animations -------------------- */

const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.25 } },
}

const confettiColors = ['#32b7bc', '#8970d4', '#de6c66', '#F9BC06', '#20c997']

/* -------------------- Score Logic -------------------- */

function calculateResult({ score, totalQuestions, passPercentage = 50 }) {
  const safeTotal = Math.max(totalQuestions || 0, 0)
  const safeScore = Math.min(Math.max(score || 0, 0), safeTotal)

  const percentage =
    safeTotal === 0 ? 0 : Math.round((safeScore / safeTotal) * 100)

  const passed = percentage >= passPercentage

  let message, emoji, grade

  if (percentage >= 90) {
    grade = 'A+'
    message = "Outstanding! You're a master!"
    emoji = '🏆'
  } else if (percentage >= 70) {
    grade = 'A'
    message = 'Great job! Well done!'
    emoji = '🎉'
  } else if (percentage >= passPercentage) {
    grade = 'B'
    message = 'Good effort! You passed!'
    emoji = '👍'
  } else {
    grade = 'F'
    message = "Keep practicing! You'll get better!"
    emoji = '💪'
  }

  return {
    score: safeScore,
    totalQuestions: safeTotal,
    percentage,
    passed,
    grade,
    message,
    emoji,
  }
}

/* -------------------- Confetti -------------------- */

function Confetti() {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: 2 + Math.random() * 2,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        size: 6 + Math.random() * 8,
      }))
    )
  }, [])

  return (
    <div className="confetti-container">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ y: -20, opacity: 1 }}
          animate={{ y: '100vh', opacity: 0, rotate: 360 }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'linear',
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  )
}

/* -------------------- Score Page -------------------- */

function Score() {
  const navigate = useNavigate()
  const { userName, score, totalQuestions, category } = useQuiz()
  const [showConfetti, setShowConfetti] = useState(false)

  const result = useMemo(
    () =>
      calculateResult({
        score,
        totalQuestions,
        passPercentage: 50,
      }),
    [score, totalQuestions]
  )

  const { percentage, passed, message, emoji } = result

  /* Block illegal access */
  useEffect(() => {
    if (!totalQuestions || totalQuestions <= 0) {
      navigate('/', { replace: true })
    }
  }, [totalQuestions, navigate])

  /* Celebration */
  useEffect(() => {
    setShowConfetti(passed)
  }, [passed])

  return (
    <motion.div
      className="score-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {showConfetti && <Confetti />}

      <div className="score-card">
        {/* Status */}
        <div className={`status-badge ${passed ? 'passed' : 'failed'}`}>
          {passed ? '✅ PASSED' : '❌ FAILED'}
        </div>

        <h1>Quiz Completed</h1>

        <p className="player-name">
          Well done, <span>{userName}</span>
        </p>

        {/* Score Ring */}
        <div className="score-circle">
          <svg viewBox="0 0 120 120" className="score-ring">
            <circle cx="60" cy="60" r="54" className="score-ring-bg" />
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              className={`score-ring-progress ${passed ? 'passed' : 'failed'}`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: percentage / 100 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </svg>

          <div className="score-value">
            <span className="percentage">{percentage}%</span>
            <span className="score-detail">
              {result.score} / {result.totalQuestions}
            </span>
          </div>
        </div>

        {/* Message */}
        <div className="result-message">
          <span className="emoji">{emoji}</span>
          <p>{message}</p>
        </div>

        {/* Category */}
        <div className="category-completed">
          Category: <span>{category?.toUpperCase()}</span>
        </div>

        {/* Actions — RESTORED UI */}
        <motion.div
          className="score-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
      </div>
    </motion.div>
  )
}

export default Score
