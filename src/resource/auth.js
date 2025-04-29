import { Configuration, FrontendApi } from '@ory/kratos-client'

const {
  KRATOS_PUBLIC_URL = 'http://localhost:4433',
  KRATOS_ADMIN_URL = 'http://localhost:4434'
} = process.env

const kratos = new FrontendApi(new Configuration({ basePath: KRATOS_PUBLIC_URL }))

export const verifySession = async (req, res, next) =>
  kratos.toSession(undefined, req.headers.cookie)
    .then(session => {
      req.session = session
      next()
    })
    .catch(next({ status: 401, message: 'Unauthorized' }))

const registration = async (req, res, next) =>
  kratos.initializeSelfServiceRegistrationFlowForBrowsers()
    .then(flow => res.json(flow))
    .catch(next({ status: 500, message: 'Failed to initialize registration' }))

const login = async (req, res, next) =>
  kratos.initializeSelfServiceLoginFlowForBrowsers()
    .then(flow => res.json(flow))
    .catch(next({ status: 500, message: 'Failed to initialize login' }))

const logout = async (req, res, next) =>
  kratos.createSelfServiceLogoutFlowUrlForBrowsers(req.headers.cookie)
    .then(flow => res.json(flow.data))
    .catch(next({ status: 500, message: 'Failed to logout' }))

export default [{
  resource: '/auth',
  behaviors: [
    { endpoint: '/registration', method: 'get', behavior: registration },
    { endpoint: '/login', method: 'get', behavior: login },
    { endpoint: '/logout', method: 'get', behavior: [verifySession, logout] }
  ]
}]
