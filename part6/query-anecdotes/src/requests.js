import axios from 'axios'

export const getNotes = () =>
  axios.get('http://localhost:3002/anecdotes').then(res => res.data)