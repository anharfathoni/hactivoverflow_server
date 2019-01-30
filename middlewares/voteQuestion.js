const Question = require('../models/Question.js')

function isQuestionOwner(req,res,next){
  console.log('masuk vote question')
  let questionId = req.params.questionId

  Question.findById({_id: questionId})
  .populate('userId')
  .then( question => {
    if(question.userId.email == req.current_user.email){
      console.log('cannot vote yours')
      res.status(400).json({message: 'cannot vote yours'})
    } else {
      next()
    }
  })
  .catch( error => {
    res.status(400).json({error, message: error.message})
  })
}

module.exports = isQuestionOwner