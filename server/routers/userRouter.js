import db from '../database/connection.js'
import { Router } from 'express'
import omit from '../util/omit.js'

function omitSensitiveInfo(user) {
  return omit(user, 'password')
}

const router = Router()

router.get('/protected/users/self', async (req, res) => {
  const user = await db.users.findOne({ username: req.session.username })

  res.send({ user: omitSensitiveInfo(user, 'password') })
})

router.get('/protected/users/:username', async (req, res) => {
  const username = req.params.username
  const user = await db.users.findOne({ username })

  if (!user) {
    res.status(404).send({ message: 'User not found' })

    return
  }
  res.send({ username: user.username })
})

export default router

