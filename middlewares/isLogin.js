const User = require('../models/User.js')
const jwt = require('jsonwebtoken')

function isLogin(req,res,next){
  console.log('masuk authentication login')
  let token = req.headers.token
  console.log(token)
  jwt.verify(token,process.env.SECRET, function(error, decoded){
    if(error){ //tidak bisa verify jwt (token yg dikirim null)
      res.status(401).send({error, message: 'please login'})
    } else {
      User.findOne({
        email: decoded.email
      })
      .then(user => {
        if(user){
          console.log('user found')
          req.current_user = user
          next()
        } else {
          console.log('user not found')
          res.status(401).send({error, message: 'please login'})  
        }
        
      })
      .catch( error =>{
        // console.log(error)
        res.status(400).send({error, message: error.message})
      })
    }
  })
}

module.exports = isLogin