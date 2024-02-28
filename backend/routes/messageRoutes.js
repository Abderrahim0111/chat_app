const express = require('express')
const { fetchAllMessages, sendMessage } = require('../controllers/messageControllers')
const router = express()


router.get('/:chatId', fetchAllMessages)
router.post('/sendMsg', sendMessage)


module.exports = router