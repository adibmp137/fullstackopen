import { useState } from 'react'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(true)
  
  // Debug: Let's see what we're actually receiving
  console.log('Blog object:', blog)
  console.log('Blog user:', blog.user)
  console.log('Blog user type:', typeof blog.user)

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
          <button>like</button>
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