import db from '../database/connection.js'
import { Router } from 'express'
import bcrypt from 'bcrypt'

const router = Router()

router.post('/auth/signUp', async (req, res) => {
  const username = req.body.username
  const password = req.body.password

  //possible exit point
  if (!username || !password) {
    res.status(400).send({ message: 'Invalid request body' })

    return
  }

  //possible exit point
  if (password.length < 8) {
    res.status(400).send({ message: 'Password is too short, minimum of 8 characters' })

    return
  }

  const userFound = await db.users.findOne({ username })
  //possible exit point
  if (userFound) {
    res.status(400).send({ message: `User with username ${userFound.username} already exits`})

    return
  }

  const hash = await bcrypt.hash(password, 12)
  await db.users.insertOne({ username, password: hash })

  req.session.username = username

  res.send({ user: {username: username, sessionExpiration: req.session.cookie.expires} })
})

router.post('/auth/signIn', async (req, res) => {
  const username = req.body.username
  const password = req.body.password

  //message will be displayed to the user 
  const data = { message: 'Please inter an username and password' }
  let status = 400

  let isValidRequestBody = false
  if (username && password) {
    isValidRequestBody = true

    data.message = 'Could not find an user with the given username'
    status = 404
  }

  const user = await db.users.findOne({ username })

  let isSamePassword = false
  if (isValidRequestBody && user) {
    isSamePassword = await bcrypt.compare(password, user.password)

    data.message = 'Incorrect password'
    status = 200
  }

  if (isSamePassword) {
    req.session.username = user.username

    data.message = 'Successful authentication'
    data.user = { username: user.username, sessionExpiration: req.session.cookie.expires }
  }

  res.status(status).send(data)
})

router.get('/auth/signOut', (req, res) => {
  req.session.destroy()

  res.send({ message: 'Session destroyed' })
})

export default router
