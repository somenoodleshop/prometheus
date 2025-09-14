import Anthropic from '@anthropic-ai/sdk'

const { ANTHROPIC_TOKEN } = process.env

const client = new Anthropic({ apiKey: ANTHROPIC_TOKEN })

const defaultSystemPrompt = 'You are Claude, an AI assistant created by Anthropic. You are helpful, harmless, and honest. You aim to provide accurate, thoughtful responses while being clear and concise in your communication.'

const defaultModel = 'claude-opus-4-0'

const tool = {
  name: 'format_response',
  description: 'Format the response with title and content',
  input_schema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'A concise title for the conversation'
      },
      response: {
        type: 'string',
        description: 'The actual response to the user'
      }
    },
    required: ['title', 'response']
  }
}

export default {
  query: async (messages, systemPrompt = defaultSystemPrompt) => {
    const response = await client.messages.create({
      model: defaultModel,
      messages: [{ role: 'system', content: systemPrompt }, ...messages]
    })
    return response.content[0].text
  },
  session: async (messages) => { throw new Error('Not implemented') },
  stream: async messages => { throw new Error('Not implemented') }
}
