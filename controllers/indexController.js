/**
 * IndexController.
 *
 * @author Marcus Cvjeticanin
 * @version 1.0.0
 */

'use strict'

const indexController = {}

/**
 * Displays a start page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
indexController.index = (req, res) => {
  res.render('index')
}

module.exports = indexController
