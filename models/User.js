const mongoose = require('mongoose')
const Schema = mongoose.Schema
const jwt = require('jsonwebtoken')
const {encrypt} = require('../helpers/helper.js')

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name must be filled']
  },
  email: {
    type: String,
    required: [true, 'email must be filled'],
    validate: [{
      isAsync: true,
      validator: function (value, cb) {
        User.findOne({ email: value }, function (err, res) {
          cb(!res)
        })
      },
      message: `email is already registered`
    }]
  },
  password: {
    type: String,
    required: [true, 'password must be filled']
  },
  watchedTags: []
})

userSchema.pre('save',function(next) {
  if(this.password) {
    this.password = encrypt(this.password)
  }
  next()
})

const User = mongoose.model('User',userSchema)

module.exports = User