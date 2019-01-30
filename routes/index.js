var express = require('express');
var router = express.Router();
const controllerUser = require('../controllers/userController.js')


router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });
})

router
      .get('/checklogin', controllerUser.checkLogin)
      .post('/login', controllerUser.login)
      .post('/register', controllerUser.register)

module.exports = router;
