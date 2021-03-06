/**
 * Starting point of application.
 *
 * @author Marcus Cvjeticanin
 * @version 1.0.0
 */

'use strict'

require('dotenv').config()

const mongoose = require('./configs/mongoose')

// connect to the database
mongoose.connect().catch(error => {
  console.error(error)
  process.exit(1)
})

var createError = require('http-errors')
var express = require('express')
var session = require('express-session')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var indexRouter = require('./routes/indexRouter')
var usersRouter = require('./routes/usersRouter')
var snippetsRouter = require('./routes/snippetsRouter')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.locals.sitetitle = 'Code Snippets'

// setup and use session middleware (https://github.com/expressjs/session)
const sessionOptions = {
  name: 'boss', // Don't use default session cookie name.
  secret: 'boss cat', // Change it!!! The secret is used to hash the session with HMAC.
  resave: false, // Resave even if a request is not changing the session.
  saveUninitialized: false, // Don't save a created but not modified session.
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}

app.use(session(sessionOptions))

// middleware to be executed before the routes
app.use((req, res, next) => {
  // flash messages - survives only a round trip
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }

  if (req.session.username) {
    res.locals.username = req.session.username
  }

  next()
})

// routes
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/snippets', snippetsRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // 404 Not Found.
  if (err.status === 404) {
    return res
      .status(404)
      .render('errors/404.jade')
  }

  // 500 Internal Server Error (in production, all other errors send this response).
  if (req.app.get('env') !== 'development') {
    return res
      .status(500)
      .render('errors/500.jade')
  }

  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// Start listening.
app.listen(8000, () => {
  console.log('Server started on http://localhost:8000')
  console.log('Press Ctrl-C to terminate...')
})

module.exports = app
