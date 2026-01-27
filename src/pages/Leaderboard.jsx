import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuiz } from '../context/QuizContext'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  },
  exit: { opacity: 0, y: -50, transition: { duration: 0.3 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.3 }
  })
}

const getMedalEmoji = (position) => {
  switch (position) {
    case 0: return '🥇'
    case 1: return '🥈'
    case 2: return '🥉'
    default: return `#${position + 1}`
  }
}

const getCategoryColor = (category) => {
  switch (category) {
    case 'html': return '#E44D26'
    case 'css': return '#264DE4'
    case 'js': return '#F7DF1E'
    default: return '#6b7280'
  }
}

function Leaderboard() {
  const navigate = useNavigate()
  const { leaderboard, clearLeaderboard } = useQuiz()

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all leaderboard entries? This cannot be undone.')) {
      clearLeaderboard()
    }
  }

  return (
    <motion.div
      className="leaderboard-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Decorative Background */}
      <div className="leaderboard-bg">
        <div className="bg-circle circle-1" />
        <div className="bg-circle circle-2" />
        <div className="bg-circle circle-3" />
      </div>

      <motion.div className="leaderboard-header" variants={itemVariants}>
        <motion.button
          className="btn-back"
          onClick={() => navigate('/')}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back
        </motion.button>
        <h1>
          <motion.span
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            🏆
          </motion.span>
          Leaderboard
        </h1>
        <p>Top quiz champions</p>
        {leaderboard.length > 0 && (
          <motion.button
            className="btn-clear"
            onClick={handleClear}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🗑️ Clear All Entries
          </motion.button>
        )}
      </motion.div>

      <motion.div className="leaderboard-card" variants={itemVariants}>
        {leaderboard.length === 0 ? (
          <motion.div 
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="empty-icon">📊</span>
            <h3>No scores yet!</h3>
            <p>Be the first to complete a quiz and claim your spot!</p>
            <motion.button
              className="btn btn-primary"
              onClick={() => navigate('/quiz-select')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Quiz
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Table Header */}
            <div className="leaderboard-table-header">
              <span className="col-rank">Rank</span>
              <span className="col-name">Player</span>
              <span className="col-category">Category</span>
              <span className="col-score">Score</span>
              <span className="col-date">Date</span>
            </div>

            {/* Table Body */}
            <div className="leaderboard-table-body">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  className={`leaderboard-row ${index < 3 ? 'top-three' : ''}`}
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ 
                    scale: 1.02, 
                    backgroundColor: 'rgba(50, 183, 188, 0.1)',
                    transition: { duration: 0.2 }
                  }}
                >
                  <span className={`col-rank rank-${index + 1}`}>
                    {getMedalEmoji(index)}
                  </span>
                  <span className="col-name">
                    <span className="player-avatar">
                      {entry.name.charAt(0).toUpperCase()}
                    </span>
                    {entry.name}
                  </span>
                  <span className="col-category">
                    <span 
                      className="category-tag"
                      style={{ backgroundColor: getCategoryColor(entry.category) }}
                    >
                      {entry.category?.toUpperCase()}
                    </span>
                  </span>
                  <span className="col-score">
                    <span className="score-value">{entry.percentage}%</span>
                    <span className="score-detail">({entry.score}/{entry.total})</span>
                  </span>
                  <span className="col-date">{entry.date}</span>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* Action Buttons */}
      <motion.div className="leaderboard-actions" variants={itemVariants}>
        <motion.button
          className="btn btn-primary"
          onClick={() => navigate('/quiz-select')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🎮 Play Quiz
        </motion.button>
        <motion.button
          className="btn btn-secondary1"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🏠 Home
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default Leaderboard
