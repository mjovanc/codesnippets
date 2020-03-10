/**
 * User model.
 *
 * @author Marcus Cvjeticanin
 * @version 1.0.0
 */

'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
    index: true
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: [10, 'The password must be of minimum length of 10 characters.']
  }
}, {
  timestamps: true,
  versionKey: false
})

UserSchema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid login attempt.')
  }

  return user
}

UserSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 8)
})

UserSchema.post('save', async function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There is already a user with that username.'))
  } else {
    next()
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = User
