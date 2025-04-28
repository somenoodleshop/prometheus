export const newSession = {
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
