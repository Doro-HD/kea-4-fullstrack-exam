import { MongoClient } from "mongodb";

const client = new MongoClient('mongodb://127.0.0.1:27017')
await client.connect()

const db = client.db('archivist')

export default {
  users: db.collection('users'),
  sessions: db.collection('sessions'),
  archives: db.collection('archives'),
  cards: db.collection('cards'),
  comments: db.collection('comments'),
  apiKeys: db.collection('apiKeys')
}