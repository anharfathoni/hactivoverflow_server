const Answer = require('../models/Answer.js')

function isAnswerOwner(req,res,next){
  console.log('masuk checkOwner answer')
  let answerId = req.params.answerId

  Answer.findById({_id: answerId})
  .populate('userId')
  .then( answer => {
    if(answer.userId.email == req.current_user.email){   
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

module.exports = isAnswerOwner