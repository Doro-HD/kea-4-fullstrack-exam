import { ObjectId } from 'mongodb'
import db from '../database/connection.js'
import { Router } from 'express'

const router = Router()

router.get('/protected/comments', async (req, res) => {
  const cardId = req.query.cardId
  if(!cardId) {
    res.status(400).send({ message: 'Url lacks query parameter cardId' })

    return
  }

  const comments = await db.comments.find({ cardId }).toArray()

  res.send({ comments })
})

router.post('/protected/comments', async (req, res) => {
  const cardId = req.body.cardId
  const sentAt = req.body.sentAt
  const text = req.body.text

  if (!cardId || !text || !sentAt) {
    res.status(400).send({ message: 'Invalid request body' })

    return
  }

  const username = req.session.username
  const comment = { cardId, username, sentAt, text }

  await db.comments.insertOne(comment)

  res.send({ comment })
})

export default router