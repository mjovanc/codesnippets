/**
 * Snippet model.
 *
 * @author Marcus Cvjeticanin
 * @version 1.0.0
 */

'use strict'

const mongoose = require('mongoose')

const SnippetSchema = new mongoose.Schema({
  title: String,
  code: {
    type: String,
    required: [true, "can't be blank"]
  },
  createdBy: String
}, {
  timestamps: true,
  versionKey: false
})

const Snippet = mongoose.model('Snippet', SnippetSchema)

module.exports = Snippet
