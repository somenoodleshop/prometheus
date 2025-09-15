export const openAISession  = {
  type: 'json_schema',
  json_schema: {
    name: 'new_session',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        response: { type: 'string' }
      },
      required: ['title', 'response'],
      additionalProperties: false
    },
    strict: true
  }
}

export const anthropicSession = {
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
