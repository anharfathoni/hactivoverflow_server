const express = require('express')
const router = express.Router()
const controllerUser = require('../controllers/userController.js')
const isLogin = require('../middlewares/isLogin')

router.use(isLogin)
router.get('/', controllerUser.getDataUser)
router.put('/', controllerUser.addWatchedTags)

module.exports = router