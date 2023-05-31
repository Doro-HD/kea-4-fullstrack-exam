//init env
import * as dotenv from 'dotenv'

dotenv.config()

import express from 'express'
import http from 'http'
import { Server }from 'socket.io'
import helmet from 'helmet'
import cors from 'cors'
import session from 'express-session'
import rateLimit from 'express-rate-limit'
import db from './database/connection.js'
import authRouter from './routers/authRouter.js'
import userRouter from './routers/userRouter.js'
import archiveRouter from './routers/archiveRouter.js' 
import cardRouter from './routers/cardRouter.js'
import commentRouter from './routers/commentRouter.js'

const app = express()

//bodyparser
app.use(express.json())

//security
app.use(helmet())

app.use(cors({
  origin: 'http://127.0.0.1:5173',
  credentials: true,
  origin: true
}))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    httpOnly: true,
    //cookie should live for 3 days
    maxAge: 3 * 24 * 60 * 60 * 1000
  }
}))

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
})

app.use(apiLimiter)
app.use('/auth', rateLimit({ ...apiLimiter, max: 10 }))

//if there is no session on protected routes the server will respond with an error
app.use('/protected', async (req, res, next) => {
  //unsafe api key for testing purpurse only
  //todo: use uuid and give expiration to key
  const apiKey = req.headers['archive-auth']

  if (apiKey && !req.session.username) {
    const apiKeyUser = await db.apiKeys.findOne({ apiKey })

    req.session.username = apiKeyUser?.usersUsername
  }

  if (req.session.username) {
    next()

    return
  }

  res.status(401).send({ message: 'User not authorized' })
})

//routers
app.use(authRouter)
app.use(userRouter)
app.use(archiveRouter)
app.use(cardRouter)
app.use(commentRouter)

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['*']
  }
})

io.on('connection', (socket) => {

  socket.on('join-comment-section', data => {
    socket.join(data.roomId)
  })

  socket.on('leave-comment-section', data => {
    socket.leave(data.roomId)
  })

  socket.on('comment-request', (data) => {
    socket.to(data.roomId).emit('comment-created', { comment: data.comment })
  })
})

const PORT = process.env.PORT || 8080
server.listen(PORT, () => console.log('Running on port: ', PORT))
