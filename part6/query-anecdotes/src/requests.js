import axios from 'axios'

const baseUrl = 'http://localhost:3002/anecdotes'

export const get = () =>
  axios.get(baseUrl).then(res => res.data)

export const create = newNote =>
  axios.post(baseUrl, newNote).then(res => res.data)

export const update = updatedNote =>
  axios.put(`${baseUrl}/${updatedNote.id}`, updatedNote).then(res => res.data)