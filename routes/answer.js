const express = require('express')
const router = express.Router()
const {getAllAnswer, getOneAnswer, add, edit, vote} = require('../controllers//answerController.js')
const isLogin = require('../middlewares/isLogin.js')
const isAnswerOwner = require('../middlewares/isAnswerOwner.js')
const voteAnswer = require('../middlewares/voteAnswer.js')

router
      .get('/:questionId', getAllAnswer)
      .get('/:questionId/:answerId', getOneAnswer)
      .post('/:questionId', isLogin, add)
      .put('/vote/:answerId', isLogin, voteAnswer, vote)
      .put('/:answerId', isLogin, isAnswerOwner, edit)

module.exports = router