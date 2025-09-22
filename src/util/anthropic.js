import Anthropic from '@anthropic-ai/sdk'

import { anthropicSession } from './responseFormat.js'

const { ANTHROPIC_TOKEN } = process.env

const client = new Anthropic({ apiKey: ANTHROPIC_TOKEN })

const defaultSystemPrompt = 'You are Claude, an AI assistant created by Anthropic. You are helpful, harmless, and honest. You aim to provide accurate, thoughtful responses while being clear and concise in your communication.'

const defaultModel = 'claude-sonnet-4-20250514'

export default {
  session: async (messages, systemPrompt = defaultSystemPrompt) => {
    const response = await client.messages.create({
      model: defaultModel,
      max_tokens: 4096,
      system: systemPrompt,
      messages,
      tools: [anthropicSession],
      tool_choice: { type: 'tool', name: 'format_response' }
    })

    const { content = [] } = response
    const [{ input } = {}] = content
    return input
  },
  query: async (messages, systemPrompt = defaultSystemPrompt) => {
    const response = await client.messages.create({
      model: defaultModel,
      max_tokens: 4096,
      system: systemPrompt,
      messages
    })
    const { content = [] } = response
    const [{ text = '' } = {}] = content
    return text
  },
  stream: async messages => { throw new Error('Not implemented') }
}
