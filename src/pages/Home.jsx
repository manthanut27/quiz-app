import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  },
  exit: {
    opacity: 0,
    y: -50,
    transition: { duration: 0.3 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
}

const floatVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const rules = [
  "10 questions per quiz, each worth 10 points",
  "15 seconds per question - answer quickly!",
  "Select one answer before proceeding",
  "No going back once you move to next question",
  "Score 50% or above to pass the quiz"
]

function Home() {
  return (
    <motion.div
      className="home-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Floating Background Elements */}
      <div className="floating-shapes">
        <motion.div className="shape shape-1" />
        <motion.div className="shape shape-2" />
        <motion.div className="shape shape-3" />
      </div>

      {/* Badge */}
      <motion.div className="badge" variants={itemVariants}>
        <motion.img
          src="/icons/puzzle-icon.svg"
          alt="Quiz Icon"
          variants={floatVariants}
          animate="animate"
        />
        <span>Test Your Knowledge</span>
      </motion.div>

      {/* Hero Section */}
      <motion.div className="hero-section" variants={itemVariants}>
        <h1 className="gradient-text">
          <motion.span
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Web Dev
          </motion.span>
          <br />
          <motion.span
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Quiz Challenge
          </motion.span>
        </h1>

        <motion.p className="subtitle" variants={itemVariants}>
          Master HTML, CSS and JavaScript with our interactive quiz.
          Challenge yourself and see how much you know!
        </motion.p>
      </motion.div>

      {/* Rules Card */}
      <motion.div className="rules-card" variants={itemVariants}>
        <h2 className="card-title">Quiz Rules</h2>
        <ul className="rules-list">
          {rules.map((rule, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
            >
              <span className="rule-icon">✓</span>
              {rule}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Buttons */}
      <motion.div className="button-group" variants={itemVariants}>
        <Link to="/quiz-select">
          <motion.button className="btn btn-primary">
            <img src="/icons/quiz.svg" alt="Quiz" />
            Start Quiz
          </motion.button>
        </Link>

        <Link to="/leaderboard">
          <motion.button className="btn btn-secondary">
            View Leaderboard
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default Home
