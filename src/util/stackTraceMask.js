import createError from 'http-errors'

const stackTraceMask = (error, req, res, next) => {
  req.log.error(error)
  const { status, message } = createError(error.status || 500)
  res.status(status).json({ message })
}

export default stackTraceMask
