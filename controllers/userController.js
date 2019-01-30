const User = require('../models/User.js')
const {checkPassword} = require('../helpers/helper.js')
const jwt = require('jsonwebtoken')
const kue = require('kue')
const queue = kue.createQueue()

class userController{
  static checkLogin(req,res){
    let token = req.headers.token

    jwt.verify(token, process.env.SECRET, function(error, decoded){
      if(error){ //tidak bisa verify jwt (token yg dikirim null)
        res.status(400).send({status: false, message: 'please login'})
      } else {
        User.findOne({
          email: decoded.email
        })
        .then(user => {
          if(user){
            console.log('user found')
            res.status(200).send({status: true})  
          } else {
            console.log('user not found')
            res.status(400).send({status: false, message: 'please login'})  
          }
          
        })
        .catch( error =>{
          res.status(400).send({message: error.message})
        })
      }
    })
  }

  static register(req,res){
    let {name, email, password} = req.body
    let newUser = {name, email, password}

    User.create(newUser)
    .then( user => {
      console.log('userr==',user.email)
        queue.create('email', {
          title: `Congratulation!`,
          email: user.email,
          template: `<h1> Welcome ${user.email}, Thanks for Register to our website!</h1>`
        })
          .save((err) => {
            if (err) {
              console.log(err)
            } else {
              console.log('masuk')
              console.log(user)
            }
          })
      res.status(200).json({user, message: 'success register, please login to continue'})
    })
    .catch( error => {
      let message = error.message
      let errors = error.errors

      if(errors.name){
        message = errors.name.message
      } else if(errors.email){
        message = errors.email.message
      } else if(errors.password){
        message = errors.password.message
      }
      
      res.status(400).json({message})
    })
  }

  static login(req,res){
    let {email, password} = req.body
    
    User.findOne({email})
    .then( user => {
      if(user){
        if(checkPassword(password, user.password)){
          let token = jwt.sign({ email }, process.env.SECRET);
          res.status(200).json({ message: 'success login', token: token, userId: user._id })
        } else {
          res.status(400).json({ message: "wrong email / password" })
        }
      } else {
        res.status(400).json({ message: "wrong email / password" }) 
      }
    })
    .catch( error => {
      res.status(400).json({message: error.message})
    })
  }

  static getDataUser(req,res){
    User.findById(req.current_user._id)
      .then( user => {
        res.status(200).json({user})
      })
      .catch( error => {
        res.status(400).json({message: error.message})
      })
  }

  static addWatchedTags(req,res){
    let {watchedTags} = req.body

    User.findByIdAndUpdate(req.current_user._id, { $push: {watchedTags}}, {new: true})
      .then( user => {
        res.status(200).json({user, message: "success add watched tag"})
      })
      .catch( error => {
        res.status(400).json({message: error.message})
      })
  }
}

module.exports = userController