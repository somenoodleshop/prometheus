import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { Configuration, FrontendApi } from '@ory/kratos-client'

const {
  PORT = 8080,
  KRATOS_PUBLIC_URL = 'http://localhost:4433',
  KRATOS_ADMIN_URL = 'http://localhost:4434'
} = process.env

const app = express()
const kratos = new FrontendApi(new Configuration({ basePath: KRATOS_PUBLIC_URL }))

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const verifySession = async (req, res, next) => {
  try {
    const session = await kratos.toSession(undefined, req.headers.cookie)
    req.session = session
    next()
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

app.get('/auth/registration', async (req, res) => {
  try {
    const flow = await kratos.initializeSelfServiceRegistrationFlowForBrowsers()
    res.json(flow)
  } catch (err) {
    res.status(500).json({ message: 'Failed to initialize registration' })
  }
})

app.get('/auth/login', async (req, res) => {
  try {
    const flow = await kratos.initializeSelfServiceLoginFlowForBrowsers()
    res.json(flow)
  } catch (err) {
    res.status(500).json({ message: 'Failed to initialize login' })
  }
})

auth.get('/auth/logout', verifySession, async (req, res) => {
  try {
    const flow = await kratos.createSelfServiceLogoutFlowUrlForBrowsers(req.headers.cookie)
    res.json(flow.data)
  } catch (err) {
    res.status(500).json({ message: 'Failed to logout' })
  }
})

auth.get('/auth/callback', async (req, res) => {
  
})

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


app.use((req, res) => { res.status(404).json({ message: 'Not Found' }) })

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
