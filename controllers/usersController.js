/**
 * Module for usersController.
 *
 * @author Marcus Cvjeticanin
 * @version 1.0.0
 */

'use strict'

const User = require('../models/User')

const usersController = {}

/**
 * Returns a HTML form for registering a new user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
usersController.new = async (req, res) => {
  const viewData = {
    username: '',
    email: '',
    password: ''
  }
  res.render('users/new', { viewData })
}

/**
 * Registers a new User.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
usersController.register = async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })

    await user.save()

    req.session.flash = { type: 'success', text: 'The user was registered successfully.' }
    res.redirect('/')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('./new')
  }
}

/**
 * Returns a HTML form for login with a user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
usersController.login = async (req, res) => {
  const viewData = {
    username: '',
    password: ''
  }
  res.render('users/login', { viewData })
}

/**
 * Registers a new User.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
usersController.loginPost = async (req, res) => {
  try {
    const user = await User.authenticate(req.body.username, req.body.password)

    const tempSession = req.session
    req.session.username = user.username

    req.session.regenerate(() => {
      Object.assign(req.session, tempSession)
      console.log(req.session)
      res.redirect('/')
    })
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('./login')
  }
}

/**
 * Logging out user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
usersController.logout = async (req, res) => {
  req.session.destroy(function () {
    res.redirect('/')
  })
}

module.exports = usersController
