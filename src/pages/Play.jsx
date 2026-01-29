import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuiz } from '../context/QuizContext'
import { getQuestionsByCategory } from '../data/questions'

const QUESTION_TIME = 15

function Play() {
  const navigate = useNavigate()
  const {
    userName,
    category,
    setScore,
    setTotalQuestions,
    setQuizStatus,
    saveToLeaderboard,
  } = useQuiz()

  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [score, setLocalScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const [isTimerActive, setIsTimerActive] = useState(true)

  /* ================= INIT ================= */

  useEffect(() => {
    if (!category) {
      navigate('/quiz-select')
      return
    }

    const loadedQuestions = getQuestionsByCategory(category)

    if (!Array.isArray(loadedQuestions) || loadedQuestions.length === 0) {
      navigate('/quiz-select')
      return
    }

    setQuestions(loadedQuestions)
  }, [category, navigate])

  /* ================= TIMER ================= */

  const handleTimeUp = useCallback(() => {
    setIsTimerActive(false)

    const correct =
      selectedOption !== null &&
      selectedOption === questions[currentIndex]?.answer

    setIsCorrect(correct)
    if (correct) setLocalScore((prev) => prev + 1)

    setShowFeedback(true)
  }, [selectedOption, questions, currentIndex])

  useEffect(() => {
    if (!isTimerActive || showFeedback) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isTimerActive, showFeedback, handleTimeUp])

  /* ================= HANDLERS ================= */

  const handleOptionSelect = (index) => {
    if (showFeedback) return
    setSelectedOption(index)
  }

  const handleSubmit = () => {
    if (selectedOption === null || showFeedback) return

    const correct =
      selectedOption === questions[currentIndex].answer

    setIsCorrect(correct)
    if (correct) setLocalScore((prev) => prev + 1)

    setShowFeedback(true)
    setIsTimerActive(false)
  }

  const handleNext = () => {
    if (!showFeedback) {
      handleSubmit()
      return
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedOption(null)
      setShowFeedback(false)
      setIsCorrect(null)
      setTimeLeft(QUESTION_TIME)
      setIsTimerActive(true)
    } else {
      finishQuiz()
    }
  }

  const finishQuiz = () => {
    const total = questions.length
    const finalScore = score
    const status = finalScore >= total * 0.5 ? 'PASSED' : 'FAILED'
    const safeName = userName?.trim() || 'Anonymous'

    setScore(finalScore)
    setTotalQuestions(total)
    setQuizStatus(status)
    saveToLeaderboard(safeName, finalScore, total, category)

    navigate('/score')
  }

  /* ================= LOADING ================= */

  if (!questions.length) {
    return (
      <div className="loading">
        <motion.div
          className="spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  /* ================= UI ================= */

  return (
    <motion.div className="play-page">
      <div className="play-header">
        <div className="category-badge">{category?.toUpperCase()}</div>
        <div className="user-greeting">
          Hi, <span className="user-name">{userName || 'Player'}</span>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-info">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className={`timer ${timeLeft <= 5 ? 'warning' : ''}`}>
        <span className="timer-text">{timeLeft}</span>
      </div>

      <div className="quiz-card">
        <p className="question-label">Question:</p>
        <h2 className="question-text">{currentQuestion.question}</h2>

        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`option
                ${selectedOption === index ? 'selected' : ''}
                ${showFeedback && index === currentQuestion.answer ? 'correct' : ''}
                ${showFeedback &&
                selectedOption === index &&
                index !== currentQuestion.answer
                  ? 'incorrect'
                  : ''}
              `}
              onClick={() => handleOptionSelect(index)}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="option-text">{option}</span>
            </div>
          ))}
        </div>

        {showFeedback && (
          <div className={`feedback-message ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? '🎉 Correct!' : '❌ Incorrect!'}
          </div>
        )}

        <button
          className="btn btn-primary btn-next"
          onClick={handleNext}
          disabled={selectedOption === null && !showFeedback}
        >
          {showFeedback
            ? currentIndex < questions.length - 1
              ? 'Next Question →'
              : 'See Results'
            : 'Submit Answer'}
        </button>
      </div>

      <div className="current-score">
        Score: <span>{score}</span> / {questions.length}
      </div>
    </motion.div>
  )
}

export default Play
