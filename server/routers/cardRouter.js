import { ObjectId } from 'mongodb'
import db from '../database/connection.js'
import { Router } from 'express'

const router = Router()

router.get('/protected/cards', async (req, res) => {
  const archiveId = req.query.archiveId
  if (!archiveId) {
    res.status(400).send({ message: 'URL lacks query parameter "archiveId"' })

    return
  }

  const findOptions = { archiveId }

  const name = req.query.name
  if (name) {
    findOptions.name = name
  }

  const tags = req.query.tags
  if (tags) {
    findOptions.tags = { $in: tags.split(' ') }
  }

  const cards = await db.cards.find(findOptions).toArray()

  res.send({ cards })
})

router.post('/protected/cards', async (req, res) => {
  const {
    archiveId,
    name,
    tags,
    summary,
    text,
    ...attributes
  } = req.body

  //exit point
  if (
    !archiveId ||
    !name ||
    !tags ||
    !summary ||
    !text
  ) {
    res.status(400).send({ message: 'Bad request' })

    return
  }

  //exit point
  const cardFound = await db.cards.findOne({ archiveId, name })
  if (cardFound) {
    res.status(400).send({ message: 'Card with name, ' + name + ', already exists in this archive.'}) 

    return
  }

  const cardToInsert = { archiveId, name, tags, summary, text, ...attributes }
  await db.cards.insertOne(cardToInsert)

  res.send(cardToInsert)
})

router.get('/protected/cards/:cardId', async (req, res) => {
  const cardId = req.params.cardId

  const cardFound = await db.cards.findOne({ _id: new ObjectId(cardId) })
  if (!cardFound) {
    res.status(404).send({ message: 'Could not find card' })

    return
  }

  res.send({ card: cardFound })
})

export default router
