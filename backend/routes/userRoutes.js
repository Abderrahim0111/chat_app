const express = require('express')
const { login, register, fetchAllUsers, logout } = require('../controllers/userControllers')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/fetchUsers', fetchAllUsers)
router.get('/logout', logout)

module.exports = router