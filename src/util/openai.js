import OpenAI from 'openai'

import request from './request.js'
import { openAISession } from './responseFormat.js'

const { OPENAI_TOKEN } = process.env

const url = 'https://api.openai.com/v1/chat/completions'

const defaultSystemPrompt = 'You are ChatGPT, a large language model trained by OpenAI. You are helpful, harmless, and honest. You aim to provide accurate, thoughtful responses while being clear and concise in your communication.'

const defaultModel = 'gpt-5'

const body = (model, messages) => ({ model, messages })
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
  session: (query, systemPrompt = defaultSystemPrompt) => {
    const prompt = `${systemPrompt} Respond to the user's input and also provide a suitable title for the conversation.`
    const payload = [{ role: 'system', content: prompt }, ...query]
    return request.post(url, { ...body(defaultModel, payload), response_format: openAISession }, authorization(OPENAI_TOKEN))
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
