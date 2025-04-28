import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import resources from './resource.js'
import router from './util/router.js'

const { PORT = 8080 } = process.env

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => { res.json({ message: 'Welcome to the API' }) })

app.get('/protected', verifySession, (req, res) => {
  res.json({
    message: 'This is a protected endpoint',
    user: req.session.identity.traits
  })
})

app.get('/profile', verifySession, async (req, res) => {
  res.json({
    profile: req.session.identity.traits,
    sessionInfo: {
      authenticated_at: req.session.authenticated_at,
      expires_at: req.session.expires_at
    }
  })
})

resources.forEach(router(app))

app.use((req, res) => { res.status(404).json({ message: 'Not Found' }) })

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
