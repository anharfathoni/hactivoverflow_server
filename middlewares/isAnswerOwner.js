const Answer = require('../models/Answer.js')

function isAnswerOwner(req,res,next){
  console.log('masuk checkOwner answer')
  let answerId = req.params.answerId

  Answer.findById({_id: answerId})
  .populate('userId')
  .then( answer => {
    if(answer.userId.email == req.current_user.email){
      next()
    } else {
      console.log('you are not the owner')
      res.status(400).json({message: 'you are not the owner'})
    }
  })
  .catch( error => {
    res.status(400).json({error, message: error.message})
  })
}

module.exports = isAnswerOwner