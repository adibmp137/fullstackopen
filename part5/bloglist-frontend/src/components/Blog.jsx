import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog , updateLikes, deleteBlog }) => {
  const [visible, setVisible] = useState(true)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (!visible) {
    return (
      <div style={blogStyle} className='blog'>
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setVisible(!visible)}>hide</button>
          <br />
          {blog.url}
          <br />
          likes {blog.likes}
          <button onClick={() => updateLikes(blog.id)}>like</button>
          <br />
          {blog.user ? blog.user.name : 'Unknown user'}
          <br />
          <button onClick={() => deleteBlog(blog.id)}>remove</button>
        </div>
      </div>
    )
  }


  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>view</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      username: PropTypes.string
    })
  }).isRequired,
  updateLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired
}

export default Blog