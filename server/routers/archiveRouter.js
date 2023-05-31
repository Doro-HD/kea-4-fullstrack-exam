import { Router } from 'express'
import { ObjectId } from 'mongodb'
import db from '../database/connection.js'

const archiveRouter = Router()

archiveRouter.get('/protected/archives', async (req, res) => {
  const username = req.session.username
  const queryParams = req.query

  //default options will find all public archives that are not owned by the user
  const findOptions = { usersUsername: { $ne: username }, isPrivate: false }

  //if the self parameter is true will return all archives owned by the user
  const isSelf = queryParams.self === 'true'

  const archiveName = queryParams.name
  if (archiveName) {
    findOptions.archiveName = archiveName
  }

  const tags = queryParams.tags?.split(' ')
  if (tags) {
    findOptions.tags = { $in: tags }
  }


  if (isSelf) {
    findOptions.usersUsername = username
  } else {
    findOptions.usersUsername = { $ne: username }
    findOptions.isPrivate = false
  }

  const archives = await db.archives.find(findOptions).toArray()

  res.send({ archives })
})

archiveRouter.post('/protected/archives', async (req, res) => {
  //mandatory fields
  const usersUsername = req.session.username
  const archiveName = req.body.archiveName
  const description = req.body.description
  const isPrivate = req.body.isPrivate

  //optional fields
  const tags = req.body.tags?.split(' ') || []
  
  //exit point
  if (!archiveName && !isPrivate && !description) {
    res.status(400).send({ message: 'Bad request body' })

    return
  }

  const archiveFound = await db.archives.findOne({ usersUsername, archiveName })

  //exit point
  if(archiveFound) {
    res.status(400).send({ message: 'Archive with name, ' + archiveName + ', already exists'})

    return
  }

  const result = await db.archives.insertOne({ usersUsername, archiveName, description, isPrivate, tags })

  res.send({ archive: { id: result.insertedId, usersUsername, archiveName, description, isPrivate, tags } })
})

archiveRouter.get('/protected/archives/:archiveId', async (req, res) => {
  const archiveId = req.params.archiveId

  const archive = await db.archives.findOne({ _id: new ObjectId(archiveId) })

  //exit point
  if (!archive) {
    res.status(404).send({ message: 'No archive found' })

    return
  }

  //exit point
  if (archive.isPrivate && req.session.username !== archive.usersUsername) {
    res.status(403).send({ message: 'Forbidden access, archive is private'})

    return
  }

  res.send({ archive })
})

export default archiveRouter
