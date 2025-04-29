import openai from '../util/openai.js'

export const verifyToken = async (req, res, next) =>
  !req.body.token
    ? next({ status: 400, message: 'Token is required' })
    : openai.isValidToken(req.body.token)
        .then(isValid => isValid ? next() : next({ status: 401, message: 'Invalid token' }))
        .catch(() => next({ status: 500, message: 'Failed to validate token' }))

const sendMessage = async (req, res, next) =>
  !req.body.messages
    ? next({ status: 400, message: 'Messages are required' })
    : openai.query(req.body.token, req.body.messages)
        .then(({ message }) => res.json({ response: message.content }))
        .catch(() => next({ status: 500, message: 'Failed to process chat request' }))

export default [{
  resource: '/chat',
  behaviors: [
    { endpoint: '/send', method: 'post', behavior: [verifyToken, sendMessage] }
  ]
}]
