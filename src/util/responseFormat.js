export const openAISession  = {
  type: 'json_schema',
  json_schema: {
    name: 'new_session',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        message: { type: 'string' }
      },
      required: ['title', 'message'],
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
      title: { type: 'string' },
      message: { type: 'string' }
    },
    required: ['title', 'message']
  }
}
