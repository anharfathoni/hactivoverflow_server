const Question = require('../models/Question.js')

class questionController {
  static create(req, res) {
    console.log('masuk controller create question')
    let { title, body, tags } = req.body
    let userId = req.current_user._id
    Question
      .create({ title, body, userId, tags })
      .then(question1 => {
        return question1.populate('userId').execPopulate()
      })
      .then(question => {
        res.status(200).json({ question, message: 'success post question' })
      })
      .catch(error => {
        res.status(400).json({ message: error.message })
      })
  }

  static search(req,res){
    console.log('masuk search')
    let query = {}
    let data = {}

    if (req.query.title) {
      console.log('ada query title')
      value = new RegExp(req.query.title, "i")
      data = {
        $or: [
          { title: value },
          { tags: { $in: [value] } }
        ]
      }
    }

    if (req.query.sort) {
      console.log('ada query sort')
      let value = req.query.sort
      if(value === "newest"){
        query = {updatedAt: 1}
      }
    }

    Question.find(data).sort(query)
    .then( questions => {
      res.status(200).json({ questions })
    })
    .catch( error => {
      res.status(500).json({message: error.message})
    })
  }

  static findAll(req, res) {
    console.log('show all question')
    let query = {createdAt: -1}
    let data = {}

    if (req.query.title) {
      let value = new RegExp(req.query.title, "i")
      console.log('ada query title', value)
      data = {
        $or: [
          { title: value },
          { tags: { $in: [ value ] } }
        ]
      }
    }

    if (req.query.sort) {
      console.log('ada query sort')
      let value = req.query.sort
      if(value === "newest"){
        query = {updatedAt: -1}
      } else if(value === "vote"){
        query = {voteUp: -1}
      } else if(value === "unanswered"){
        query = {answerId: -1}
      }
    }

    Question.find(data).sort(query)
      .populate('userId')
      .then(questions => {
        res.status(200).json({ questions })
      })
      .catch(error => {
        console.log(error)
        res.status(400).json({ message: error.message })
      })
  }

  static findOne(req, res) {
    let questionId = req.params.questionId
    console.log(`show details question ${questionId}`)
    Question.findById({ _id: questionId })
      .populate('userId')
      // .populate({
      //   path: 'answer',
      //   populate: { path: 'userId' },
      // })
      .populate('voteUp')
      .populate('voteDown')
      
      .then( question => {
        res.status(200).json({ question })
      })
      .catch(error => {
        res.status(400).json({ message: error.message })
      })
  }

  static edit(req, res) {
    let questionId = req.params.questionId
    let { title, body, tags } = req.body
    let updatedAt = new Date()

    Question.findByIdAndUpdate({ _id: questionId }, { title, body, updatedAt, tags })
      .then(question => {
        res.status(200).json({ question, message: "success edit question" })
      })
      .catch(error => {
        res.status(400).json({ message: error.message })
      })
  }

  static deleteQuestion(req, res) {
    let questionId = req.params.questionId

    Question.findByIdAndDelete({ _id: questionId })
      .then((question) => {
        res.status(200).json({ question, message: 'success delete question' })
      })
      .catch(error => {
        res.status(400).json({ message: error.message })
      })

  }

  static vote(req, res) {
    let questionId = req.params.questionId
    let status = req.body.status
    let userId = req.current_user._id
    console.log([status, userId])

    // if(status === 'up'){
    Question.find({ _id: questionId })
      .then(user => {
        console.log("user:", user)
        console.log(user[0].voteUp)
        let userVoteUp = user[0].voteUp.filter(user => String(user) == String(userId));
        console.log("cekVoteUp", userVoteUp)
        if (userVoteUp.length > 0) {
          console.log('pernah vote up, cek press vote')
          if (status === 'up') {  //user press upVote
            return Question.findByIdAndUpdate(
              { _id: questionId },
              { $pull: { voteUp: userId } })
          } else {  //user press downVote
            return Question.findByIdAndUpdate(
              { _id: questionId },
              { $pull: { voteUp: userId }, $push: { voteDown: userId } })
            // ,{ $push: { voteDown: userId }})

          }
        } else {
          let userVoteDown = user[0].voteDown.filter(user => String(user) == String(userId));
          console.log("cekVoteDown", userVoteDown)
          if (userVoteDown.length > 0) {
            console.log('pernah vote down, cek press vote')
            if (status === 'down') { //user press downVote
              return Question.findByIdAndUpdate(
                { _id: questionId },
                { $pull: { voteDown: userId } })
            } else { //user press upVote
              return Question.findByIdAndUpdate(
                { _id: questionId },
                { $push: { voteUp: userId }, $pull: { voteDown: userId } })
              // ,{ $pull: { voteDown: userId }})


            }
          } else {
            console.log('belum pernah vote , cek press vote')
            if (status === 'up') {  //user press upVote
              return Question.findByIdAndUpdate(
                { _id: questionId },
                { $push: { voteUp: userId } })
            } else {  //user press downVote
              return Question.findByIdAndUpdate(
                { _id: questionId },
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
        res.status(400).json({ message: error.message })
      })
  }
}

module.exports = questionController