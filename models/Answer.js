const mongoose = require('mongoose')
const Schema = mongoose.Schema

const answerSchema = new Schema({
  content: {
    type: String,
    required: [true, 'fill your answer']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'Question'
  },
  voteUp: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User'
  }],
  voteDown: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date,
    default: new Date()
  }
})

const Answer = mongoose.model('Answer', answerSchema)
module.exports = Answer