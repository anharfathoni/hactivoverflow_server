const Tag = require('../models/Tag')

module.exports = {
  create(req, res) {
    let { text } = req.body

    Tag.create({ text: text })
      .then(tag => {
        res.status(201).json({ tag })
      })
      .catch(error => {
        res.status(400).json({ message: error.message })
      })
  },

  showAll(req, res) {
    Tag.find()
      .then( tags => {
        res.status(201).json({ tags })
      })
      .catch(error => {
        res.status(400).json({ message: error.message })
      })
  }
}