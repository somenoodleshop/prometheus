import http from 'node:http'
import https from 'node:https'

const protocol = { http, https }

const agent = p => new protocol[p.protocol === 'http:' ? 'http' : 'https'].Agent({ keepAlive: true })

const metadata = (method, data, headers = {}) => ({
  method,
  body: JSON.stringify(data),
  headers: { 'Content-Type': 'application/json', ...headers },
  agent
})

const res = res => res.ok
  ? res.json().then(d => d).catch(() => res.status)
  : Promise.reject(new Error(res))

export default {
  get: (url, headers = {}) => fetch(url, { headers, agent }).then(res),
  ...['delete', 'patch', 'post', 'put'].reduce((acc, method) => ({
    ...acc,
    [method]: (url, body, headers = {}) => fetch(url, metadata(method, body, headers))
      .then(res)
  }), {})
}
