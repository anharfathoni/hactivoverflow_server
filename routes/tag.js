var express = require('express');
var router = express.Router();
const controllerTag = require('../controllers/tagController')

router
      .get('/', controllerTag.showAll)
      .post('/', controllerTag.create)

module.exports = router;
