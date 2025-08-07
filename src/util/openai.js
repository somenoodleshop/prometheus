import OpenAI from 'openai'

import request from './request.js'
import { newSession } from './responseFormat.js'

const { OPENAI_TOKEN } = process.env

const url = 'https://api.openai.com/v1/chat/completions'

const defaultSystemPrompt = 'You are ChatGPT, a large language model trained by OpenAI.'

const defaultModel = 'gpt-5'

const body = (model, messages) => ({ model, messages, temperature: 0.7 })
const authorization = token => ({ Authorization: `Bearer ${token}` })

export default {
  isValidToken: async token => {
    if (!token) return
    try {
      const client = new OpenAI({ apiKey: token, dangerouslyAllowBrowser: true })
      const data = await client.models.list()
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  },
  session: query => {
    const systemPrompt = `${defaultSystemPrompt} Respond to the user's input and also provide a suitable title for the conversation.`
    const payload = [{ role: 'system', content: systemPrompt }, ...query]
    return request.post(url, { ...body(defaultModel, payload), response_format: newSession }, authorization(OPENAI_TOKEN))
      .then(({ choices = [] }) => {
        const [{ message = '' }] = choices
        const content = JSON.parse(message.content)
        return {
          title: content.title,
          message: { role: message.role, content: content.response }
        }
      })
  },
  query: messages => request.post(url, body(defaultModel, [{ role: 'system', content: defaultSystemPrompt }, ...messages]), authorization(OPENAI_TOKEN))
    .then(({ choices = [] }) => {
      const [{ message = '' }] = choices
      return { message }
    })
    .catch(() => alert('Request broken')),
  stream: async messages => {
    const client = new OpenAI({ apiKey: OPENAI_TOKEN })
    const stream = await client.chat.completions.create({
      model: defaultModel,
      messages: [
        { role: 'system', content: defaultSystemPrompt },
        ...messages
      ],
      stream: true
    })
    return stream
  }
}
