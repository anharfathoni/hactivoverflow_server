const Answer = require('../models/Answer.js')
let Question = require('../models/Question.js')

class answerController{
  static getAllAnswer(req,res){
    let questionId = req.params.questionId
    Answer.find({questionId})
    .sort({updatedAt: -1})
    .populate('userId')
    .then( answers => {
      res.status(200).json({answers})
    })
    .catch( error => {
      res.status(400).json({error, message: error.message})
    })
  }

  static getOneAnswer(req,res){
    let questionId = req.params.questionId
    let answerId = req.params.answerId
    console.log([questionId,answerId])

    Answer.findOne({_id: answerId, questionId: questionId})
    .populate('userId')
    .exec( function(err, answer){
      if(err){
        res.status(400).json({error, message: error.message})
      } else {
        res.status(200).json({answer}) 
      }
    })
  }

  static add(req,res){
    let questionId = req.params.questionId
    let {content} = req.body
    let userId = req.current_user._id

    let newAnswer = {
      content, questionId, userId
    }

    let answer = {}

    Answer.create(newAnswer)
    .then( newanswer => {
      answer = newanswer
      return Question.findByIdAndUpdate(questionId, {$push: {answerId: answer._id}})
    })
    .then( question => {
      res.status(200).json({answer, message: 'success post answer'})
    })
    .catch( error => {
      // console.log(error.errors.content.message)
      res.status(400).json({message: error.errors.content.message})
    })
  }

  static edit(req,res){
    let answerId = req.params.answerId
    let {content} = req.body
    console.log([answerId, content])
    let editAnswer = {
      content, 
      updatedAt: new Date()
    }
    Answer.findByIdAndUpdate({_id: answerId},editAnswer)
    .then( answer => {
      res.status(200).json({answer, message: 'success edit answer'})
    })
    .catch( error => {
      res.status(400).json({error, message: error.message})
    })
  }

  static vote(req, res) {
    let answerId = req.params.answerId
    let status = req.body.status
    let userId = req.current_user._id

    Answer.find({ _id: answerId })
      .then(user => {
        let userVoteUp = user[0].voteUp.filter(user => String(user) == String(userId));
        if (userVoteUp.length > 0) {
          console.log('pernah vote up, cek press vote')
          if (status === 'up') {  //user press upVote
            return Answer.findByIdAndUpdate(
              { _id: answerId },
              { $pull: { voteUp: userId } })
          } else {  //user press downVote
            return Answer.findByIdAndUpdate(
              { _id: answerId },
              { $pull: { voteUp: userId }, $push: { voteDown: userId } })
          }
        } else {
          let userVoteDown = user[0].voteDown.filter(user => String(user) == String(userId));
          console.log("cekVoteDown", userVoteDown)
          if (userVoteDown.length > 0) {
            console.log('pernah vote down, cek press vote')
            if (status === 'down') { //user press downVote
              return Answer.findByIdAndUpdate(
                { _id: answerId },
                { $pull: { voteDown: userId } })
            } else { //user press upVote
              return Answer.findByIdAndUpdate(
                { _id: answerId },
                { $push: { voteUp: userId }, $pull: { voteDown: userId } })
            }
          } else {
            console.log('belum pernah vote , cek press vote')
            if (status === 'up') {  //user press upVote
              return Answer.findByIdAndUpdate(
                { _id: answerId },
                { $push: { voteUp: userId } })
            } else {  //user press downVote
              return Answer.findByIdAndUpdate(
                { _id: answerId },
                { $push: { voteDown: userId } })
            }
          }
        }
      })
      .then(question => {
        console.log('after voteee=====')
        console.log(question)
        res.status(200).json({ question, message: 'success vote' })
      })
      .catch(error => {
        console.log(error.response)
        res.status(400).json({ error, message: error.message })
      })
  }
}

module.exports = answerController