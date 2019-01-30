var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

require('dotenv').config()
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var questionRouter = require('./routes/question.js')
var answerRouter = require('./routes/answer.js')
var tagRouter = require('./routes/tag')

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Zenfox-hacktivoverflow');

//---------------------------------CONNECT MLAB DATABASE---------------------------------------
// const mongodbUri = 'mongodb://anharaf:anharaf1234@ds055690.mlab.com:55690/zenfox-hacktivoverflow'

// mongoose.connect(mongodbUri,
//   {
//     useNewUrlParser: true,
//     auth: {
//       user: 'anharaf',
//       password: 'anharaf1234'
//     }
//   });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log(('You are Mongected'));
// });
//------------------------------------------------------------------------------

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/questions', questionRouter)
app.use('/answers', answerRouter)
app.use('/tags', tagRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.status(400).json({err})
});

module.exports = app;
