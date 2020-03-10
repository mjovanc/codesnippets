/**
 * Module for snippetsController.
 *
 * @author Marcus Cvjeticanin
 * @version 1.0.0
 */

'use strict'

const Snippet = require('../models/Snippet')

const snippetsController = {}

/**
 * Displays a list of snippets.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
snippetsController.index = async (req, res, next) => {
  try {
    const viewData = {
      snippets: (await Snippet.find({}))
        .map(snippet => ({
          id: snippet._id,
          title: snippet.title,
          code: snippet.code
        }))
    }
    res.render('snippets/index', { viewData })
  } catch (error) {
    next(error)
  }
}

/**
 * Returns view for a single snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
snippetsController.view = async (req, res) => {
  try {
    const snippet = await Snippet.findOne({ _id: req.params.id })
    const viewData = {
      id: snippet._id,
      title: snippet.title,
      code: snippet.code
    }
    res.render('snippets/view', { viewData })
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('..')
  }
}

/**
 * Returns a HTML form for creating a new snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
snippetsController.new = async (req, res) => {
  const viewData = {
    title: '',
    code: ''
  }
  res.render('snippets/new', { viewData })
}

/**
 * Creates a new Snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
snippetsController.create = async (req, res) => {
  try {
    const snippet = new Snippet({
      title: req.body.title,
      code: req.body.code
    })

    await snippet.save()

    req.session.flash = { type: 'success', text: 'The snippet was created successfully.' }
    res.redirect('./new')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('./new')
  }
}

/**
 * Returns a HTML form for editing a snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
snippetsController.edit = async (req, res) => {
  try {
    const snippet = await Snippet.findOne({ _id: req.params.id })
    const viewData = {
      id: snippet._id,
      title: snippet.title,
      code: snippet.code
    }
    res.render('snippets/edit', { viewData })
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('..')
  }
}

/**
 * Updates a specific snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
snippetsController.update = async (req, res) => {
  try {
    const result = await Snippet.updateOne({ _id: req.body.id }, {
      title: req.body.title,
      code: req.body.code
    })

    if (result.nModified === 1) {
      req.session.flash = { type: 'success', text: 'The snippet was updated successfully.' }
    } else {
      req.session.flash = {
        type: 'danger',
        text: 'The snippet you attempted to update was removed by another user after you got the original values.'
      }
    }
    res.redirect('..')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('./edit')
  }
}

/**
 * Returns a HTML form for removing a snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
snippetsController.remove = async (req, res) => {
  try {
    const snippet = await Snippet.findOne({ _id: req.params.id })
    const viewData = {
      id: snippet._id,
      title: snippet.title,
      code: snippet.code
    }
    res.render('snippets/remove', { viewData })
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('..')
  }
}

/**
 * Deletes a specific snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
snippetsController.delete = async (req, res) => {
  try {
    await Snippet.deleteOne({ _id: req.body.id })

    req.session.flash = { type: 'success', text: 'The snippet was deleted successfully.' }
    res.redirect('..')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('./remove')
  }
}

/**
 * Checks if user is logged in.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
snippetsController.authorize = async (req, res, next) => {
  if (!req.session.username) {
    const error = new Error('Forbidden')
    error.statusCode = 403
    return next(error)
  }

  next()
}

// Exports.
module.exports = snippetsController
