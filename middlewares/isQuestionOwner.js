const Question = require('../models/Question.js')

function isQuestionOwner(req,res,next){
  console.log('masuk checkOwner question')
  let questionId = req.params.questionId
  
  Question.findById({_id: questionId})
  .populate('userId')
  .then( question => {
    console.log(question)
    console.log([question.userId.email,req.current_user.email])
    if(question.userId.email == req.current_user.email){
      next()
    } else {
      console.log('you are not the owner')
      res.status(400).json({message: 'you are not the owner'})
    }
  })
  .catch( error => {
    console.log(error)
    res.status(400).json({error, message: error.message})
  })
}

module.exports = isQuestionOwner