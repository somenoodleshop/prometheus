import Anthropic from '@anthropic-ai/sdk'

import { anthropicSession } from './responseFormat.js'

const { ANTHROPIC_TOKEN } = process.env

const client = new Anthropic({ apiKey: ANTHROPIC_TOKEN })

const defaultSystemPrompt = 'You are Claude, an AI assistant created by Anthropic. You are helpful, harmless, and honest. You aim to provide accurate, thoughtful responses while being clear and concise in your communication.'

const defaultModel = 'claude-opus-4-0'

export default {
  session: async (messages, systemPrompt = defaultSystemPrompt) => {
    const response = await client.messages.create({
      model: defaultModel,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      tools: [anthropicSession],
      tool_choice: { type: 'tool', name: 'format_response' }
    })
    return response.content[0].text
  },
  query: async (messages, systemPrompt = defaultSystemPrompt) => {
    const response = await client.messages.create({
      model: defaultModel,
      messages: [{ role: 'system', content: systemPrompt }, ...messages]
    })
    return response.content[0].text
  },
  stream: async messages => { throw new Error('Not implemented') }
}
