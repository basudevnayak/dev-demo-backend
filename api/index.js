// api/index.js
import express from 'express'
import serverless from 'serverless-http'

const app = express()

app.use(express.json())

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from Serverless Express on Vercel' })
})

export const handler = serverless(app)
