import createError from 'http-errors'

const stackTraceMask = logger => (error, req, res) => {
  logger.error(error)
  const { status, message } = createError(error.status || 500)
  res.status(status).json({ message })
}

export default stackTraceMask
