const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}

const favoriteBlog = (blogs) => {
  if (!blogs || blogs.length === 0) return null
  return blogs.reduce((fav, blog) => (fav.likes >= blog.likes ? fav : blog))
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}