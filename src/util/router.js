import { Router } from 'express'

const catchAsyncFailure = behavior => (req, res, next) => {
  try { Promise.resolve(behavior(req, res, next)) }
  catch (e) { next(e) }
}

const makeRouter = (behaviors, middleware) => {
  const router = Router()
  behaviors.forEach(({ endpoint, method, behavior }) => {
    router[method](endpoint, middleware(behavior))
  })
  return router
}

export default app => ({ resource, behaviors }) =>
  app.use(resource, makeRouter(behaviors, catchAsyncFailure))
