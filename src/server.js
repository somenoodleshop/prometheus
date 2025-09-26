import cors from 'cors'
import express from 'express'
import healthcheck from 'express-healthcheck'
import helmet from 'helmet'
import pino from 'pino-http'

import resources from './resource/index.js'
import router from './util/router.js'
import stackTraceMask from './util/stackTraceMask.js'

const { PORT = 80 } = process.env

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(pino())

app.use('/health', healthcheck())

app.get('/', (req, res) => { res.json({ message: 'Welcome to the API' }) })

app.get('/protected', (req, res) => {
  const sessionToken = req.headers.get('X-Session-Token')
  const user = req.headers.get('X-User')
  if (!sessionToken || !user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  res.json({
    message: 'This is a protected endpoint',
    sessionToken,
    user
  })
})

app.get('/profile', async (req, res) => {})

resources.forEach(router(app))

app.use((req, res, next) => next({ status: 404 }))

app.use(stackTraceMask)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
