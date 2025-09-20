import openai from '../util/openai.js'
import anthropic from '../util/anthropic.js'

const providers = { openai, anthropic }

export const verifyToken = (req, res, next) =>
  !req.body.token
    ? next({ status: 400, message: 'Token is required' })
    : openai.isValidToken(req.body.token)
        .then(isValid => isValid ? next() : next({ status: 401, message: 'Invalid token' }))
        .catch(() => next({ status: 500, message: 'Failed to validate token' }))

const query = ({ body: { messages, provider = 'openai' } }, res, next) =>
  !messages
    ? next({ status: 400, message: 'Messages are required' })
    : !providers[provider]
      ? next({ status: 400, message: 'Invalid provider' })
      : providers[provider][messages.length > 2 ? 'query' : 'session'](messages)
          .then(({ title = '', message }) => res.json({ ...(title ? { title } : {}), response: message }))
          .catch(() => next({ status: 500, message: 'Failed to process chat request' }))

const stream = async ({ body: { messages, provider = 'openai' } }, res, next) => {
  if (!messages) {
    return next({ status: 400, message: 'Messages are required' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  const stream = await providers[provider].stream(messages)

  for await (const part of stream) {
    res.write(part.choices[0]?.delta?.content || '')
  }

  res.end()
}

export default [{
  resource: '/chat',
  behaviors: [
    { endpoint: '/', method: 'post', behavior: query },
    { endpoint: '/stream', method: 'post', behavior: stream }
  ]
}]
