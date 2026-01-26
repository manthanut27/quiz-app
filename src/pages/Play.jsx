import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuiz } from '../context/QuizContext'
import { getQuestionsByCategory } from '../data/questions'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } }
}

const questionVariants = {
  enter: { opacity: 0, x: 50 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
}

const optionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.3 }
  })
}

function Play() {
  const navigate = useNavigate()
  const { userName, category, setScore, setTotalQuestions, setQuizStatus, saveToLeaderboard } = useQuiz()
  
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [score, setLocalScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const [isTimerActive, setIsTimerActive] = useState(true)

  // Initialize questions
  useEffect(() => {
    if (!category) {
      navigate('/quiz-select')
      return
    }
    const qs = getQuestionsByCategory(category)
    setQuestions(qs)
  }, [category, navigate])

  // Timer logic
  useEffect(() => {
    if (!isTimerActive || showFeedback) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isTimerActive, showFeedback, currentIndex])

  const handleTimeUp = useCallback(() => {
    setIsTimerActive(false)
    setShowFeedback(true)
    setIsCorrect(false)
  }, [])

  const handleOptionSelect = (index) => {
    if (showFeedback) return
    setSelectedOption(index)
  }

  const handleNext = () => {
    if (selectedOption === null && !showFeedback) {
      // Shake animation trigger
      return
    }

    if (!showFeedback) {
      // Check answer
      const correct = selectedOption === questions[currentIndex].answer
      setIsCorrect(correct)
      if (correct) {
        setLocalScore((prev) => prev + 1)
      }
      setShowFeedback(true)
      setIsTimerActive(false)
      return
    }

    // Move to next question or finish
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedOption(null)
      setShowFeedback(false)
      setTimeLeft(15)
      setIsTimerActive(true)
    } else {
      finishQuiz()
    }
  }

  const finishQuiz = () => {
    const finalScore = score + (isCorrect ? 1 : 0)
    const total = questions.length
    const passScore = total * 0.5
    const status = finalScore >= passScore ? 'PASSED' : 'FAILED'

    setScore(finalScore)
    setTotalQuestions(total)
    setQuizStatus(status)
    saveToLeaderboard(userName, finalScore, total, category)
    navigate('/score')
  }

  if (questions.length === 0) {
    return (
      <div className="loading">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="spinner"
        />
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <motion.div
      className="play-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Header Info */}
      <div className="play-header">
        <motion.div 
          className="category-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          {category?.toUpperCase()}
        </motion.div>
        <div className="user-greeting">
          Hi, <span className="user-name">{userName}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-info">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="progress-bar">
          <motion.div 
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Timer */}
      <motion.div 
        className={`timer ${timeLeft <= 5 ? 'warning' : ''}`}
        animate={timeLeft <= 5 ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: timeLeft <= 5 ? Infinity : 0 }}
      >
        <svg className="timer-svg" viewBox="0 0 100 100">
          <circle
            className="timer-bg"
            cx="50"
            cy="50"
            r="45"
          />
          <motion.circle
            className="timer-progress"
            cx="50"
            cy="50"
            r="45"
            initial={{ pathLength: 1 }}
            animate={{ pathLength: timeLeft / 15 }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <span className="timer-text">{timeLeft}</span>
      </motion.div>

      {/* Quiz Card */}
      <motion.div className="quiz-card" layout>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={questionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <p className="question-label">Question:</p>
            <h2 className="question-text">{currentQuestion.question}</h2>

            <div className="options-container">
              {currentQuestion.options.map((option, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={optionVariants}
                  initial="hidden"
                  animate="visible"
                  className={`option ${selectedOption === index ? 'selected' : ''} 
                    ${showFeedback && index === currentQuestion.answer ? 'correct' : ''}
                    ${showFeedback && selectedOption === index && index !== currentQuestion.answer ? 'incorrect' : ''}`}
                  onClick={() => handleOptionSelect(index)}
                  whileHover={!showFeedback ? { scale: 1.02, x: 5 } : {}}
                  whileTap={!showFeedback ? { scale: 0.98 } : {}}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="option-text">{option}</span>
                  {showFeedback && index === currentQuestion.answer && (
                    <motion.span 
                      className="feedback-icon correct"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      ✓
                    </motion.span>
                  )}
                  {showFeedback && selectedOption === index && index !== currentQuestion.answer && (
                    <motion.span 
                      className="feedback-icon incorrect"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      ✗
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Feedback Message */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              className={`feedback-message ${isCorrect ? 'correct' : 'incorrect'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {isCorrect ? '🎉 Correct!' : '❌ Incorrect!'}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Button */}
        <motion.button
          className="btn btn-primary btn-next"
          onClick={handleNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={selectedOption === null && !showFeedback}
        >
          {showFeedback 
            ? (currentIndex < questions.length - 1 ? 'Next Question →' : 'See Results')
            : 'Submit Answer'}
        </motion.button>
      </motion.div>

      {/* Score Display */}
      <motion.div 
        className="current-score"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Score: <span>{score + (showFeedback && isCorrect ? 1 : 0)}</span> / {questions.length}
      </motion.div>
    </motion.div>
  )
}

export default Play
