import OpenAI from 'openai'

import { openAISession } from './responseFormat.js'

const { OPENAI_TOKEN } = process.env

const defaultSystemPrompt = 'You are ChatGPT, a large language model trained by OpenAI. You are helpful, harmless, and honest. You aim to provide accurate, thoughtful responses while being clear and concise in your communication.'

const defaultModel = 'gpt-5'

const isValidToken = async token => {
  if (!token) return
  try {
    const client = new OpenAI({ apiKey: token, dangerouslyAllowBrowser: true })
    const data = await client.models.list()
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

const session = async (messages, systemPrompt = defaultSystemPrompt) => {
  const client = new OpenAI({ apiKey: OPENAI_TOKEN })
  const response = await client.chat.completions.create({
    model: defaultModel,
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    response_format: openAISession
  })
  const { choices = [] } = response
  const [{ message }] = choices
  const content = JSON.parse(message.content)
  return {
    title: content.title,
    message: content.message,
  }
}

const query = async (messages, systemPrompt = defaultSystemPrompt) => {
  const client = new OpenAI({ apiKey: OPENAI_TOKEN })
  const response = await client.chat.completions.create({
    model: defaultModel,
    messages: [{ role: 'system', content: systemPrompt }, ...messages]
  })
  const { choices = [] } = response
  const [{ message = '' }] = choices
  return { message: message.content }
}

const stream = async messages => {
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

export default { isValidToken, session, query, stream }
