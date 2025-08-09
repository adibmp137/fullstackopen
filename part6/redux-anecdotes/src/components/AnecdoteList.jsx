import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector( ({ filter , anecdotes }) => {
    const anecdotesToShow = anecdotes.filter( (anecdote) => 
      anecdote.content.toLowerCase().includes(filter.toLowerCase()) 
    )
    return filter === '' ? anecdotes : anecdotesToShow
  })

  const dispatch = useDispatch()

  const voteFunction = (anecdote) => {
    dispatch(vote(anecdote.id))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }

  return (
    <div>
      {[...anecdotes]
      .sort((a, b) => b.votes - a.votes)
      .map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteFunction(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList