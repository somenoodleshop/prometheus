import Anthropic from '@anthropic-ai/sdk'

const { ANTHROPIC_TOKEN } = process.env

const client = new Anthropic({ apiKey: ANTHROPIC_TOKEN })

const defaultSystemPrompt = 'You are Claude, an AI assistant created by Anthropic. You are helpful, harmless, and honest. You aim to provide accurate, thoughtful responses while being clear and concise in your communication.'

export default {
  query: async (messages, systemPrompt = defaultSystemPrompt) => {
    const response = await client.messages.create({
      model: 'claude-opus-4-0',
      messages: [{ role: 'system', content: systemPrompt }, ...messages]
    })
    return response.content[0].text
  },
  stream: async messages => {}
}
