import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuiz } from '../context/QuizContext'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  },
  exit: { opacity: 0, x: 100, transition: { duration: 0.3 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const categories = [
  {
    id: 'html',
    name: 'HTML',
    description: 'Structure & Markup',
    icon: '/assests/html.svg',
    color: '#E44D26'
  },
  {
    id: 'css',
    name: 'CSS',
    description: 'Styling & Layout',
    icon: '/assests/css.svg',
    color: '#264DE4'
  },
  {
    id: 'js',
    name: 'JavaScript',
    description: 'Logic & Interactivity',
    icon: '/assests/js.svg',
    color: '#F7DF1E'
  }
]

function QuizSelect() {
  const navigate = useNavigate()
  const { setUserName, setCategory, resetQuiz } = useQuiz()
  const [name, setName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [errors, setErrors] = useState({})
  const [isShaking, setIsShaking] = useState(false)

  const handleSubmit = () => {
    const newErrors = {}
    
    if (!name.trim()) {
      newErrors.name = 'Please enter your name'
    }
    if (!selectedCategory) {
      newErrors.category = 'Please select a category'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      return
    }

    resetQuiz()
    setUserName(name.trim())
    setCategory(selectedCategory)
    navigate('/play')
  }

  return (
    <motion.div
      className="quiz-select-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Animated Background */}
      <div className="bg-gradient" />
      
      <motion.div className="back-link" variants={itemVariants}>
        <motion.button
          onClick={() => navigate('/')}
          className="btn-back"
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back to Home
        </motion.button>
      </motion.div>

      <motion.div className="select-header" variants={itemVariants}>
        <h1>Let's get started!</h1>
        <p>Enter your name and choose your quiz category</p>
      </motion.div>

      <motion.div 
        className="select-card"
        variants={itemVariants}
        animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        {/* Name Input */}
        <div className="input-group">
          <label>Your Name</label>
          <motion.div 
            className={`input-wrapper ${errors.name ? 'error' : ''}`}
            whileFocus={{ scale: 1.02 }}
          >
            <img src="/assests/user.svg" alt="User" />
            <input
              type="text"
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setErrors({ ...errors, name: '' })
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </motion.div>
          {errors.name && (
            <motion.span 
              className="error-text"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.name}
            </motion.span>
          )}
        </div>

        {/* Category Selection */}
        <div className="category-group">
          <label>Select Quiz Category</label>
          {errors.category && (
            <motion.span 
              className="error-text"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.category}
            </motion.span>
          )}
          <div className="categories">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                className={`category-card ${selectedCategory === cat.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedCategory(cat.id)
                  setErrors({ ...errors, category: '' })
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: `0 10px 30px ${cat.color}30`
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="category-icon"
                  animate={selectedCategory === cat.id ? { 
                    rotate: [0, -10, 10, 0],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <img src={cat.icon} alt={cat.name} />
                </motion.div>
                <strong>{cat.name}</strong>
                <small>{cat.description}</small>
                {selectedCategory === cat.id && (
                  <motion.div 
                    className="check-mark"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <motion.button
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Back
          </motion.button>
          <motion.button
            className="btn btn-primary"
            onClick={handleSubmit}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 30px rgba(50, 183, 188, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            Start Quiz →
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default QuizSelect
