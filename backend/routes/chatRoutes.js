const express = require('express')
const router = express.Router()
const { accessChat, fetchChats, fetchGroups, creatGroup, exitGroup, addSelfToGroup } = require('../controllers/chatControllers')


router.post('/accessChat', accessChat)
router.get('/fetchChat', fetchChats)
router.get('/fetchGroups', fetchGroups)
router.post('/createGroup', creatGroup)
router.put('/exitGroup', exitGroup)
router.put('/addSelf', addSelfToGroup)


module.exports = router