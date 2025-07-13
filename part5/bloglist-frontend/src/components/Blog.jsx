import { useState } from 'react'

const Blog = ({ blog , updateLikes }) => {
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
      <div style={blogStyle}>
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
export default Blog