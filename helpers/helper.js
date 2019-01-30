const bcrypt = require('bcryptjs')

function encrypt(password) {
  let salt = bcrypt.genSaltSync(10)
  let hash = bcrypt.hashSync(password, salt)
  return hash
}

function checkPassword(input,password){
  return bcrypt.compareSync(input,password)
}

module.exports = {
  encrypt, checkPassword
}