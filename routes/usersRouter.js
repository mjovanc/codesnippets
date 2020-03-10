/**
 * Users routes.
 *
 * @author Marcus Cvjeticanin
 * @version 1.0.0
 */

'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/usersController')

router.get('/new', controller.new)
router.post('/register', controller.register)

router.get('/login', controller.login)
router.post('/auth', controller.loginPost)

router.get('/logout', controller.logout)

module.exports = router
