const express = require('express')
const router = express.Router()
const {create, findAll, findOne, edit, deleteQuestion, vote} = require('../controllers/questionController.js')
const isLogin = require('../middlewares/isLogin.js')
const isQuestionOwner = require('../middlewares/isQuestionOwner.js')
const voteQuestion = require('../middlewares/voteQuestion.js')

router
      .get('/', findAll)
      .get('/:questionId', findOne)

router.use(isLogin)
router
      .post('/', create)
      .put('/vote/:questionId', voteQuestion, vote)
      .put('/:questionId', isQuestionOwner, edit)
      .delete('/:questionId', isQuestionOwner, deleteQuestion)

module.exports = router