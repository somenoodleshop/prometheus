import Anthropic from '@anthropic-ai/sdk'

const { ANTHROPIC_TOKEN } = process.env

const client = new Anthropic({ apiKey: ANTHROPIC_TOKEN })

export default {
  query: async messages => {
    const response = await client.messages.create({
      model: 'claude-opus-4-0',
      messages
    })
    return response.content[0].text
  }
}
