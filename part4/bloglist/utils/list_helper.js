const _ = require('lodash')

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) return null
  const grouped = _.groupBy(blogs, 'author')
  const authorBlogs = _.map(grouped, (items, author) => ({ author, blogs: items.length }))
  return _.maxBy(authorBlogs, 'blogs')
}

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) return null
  const grouped = _.groupBy(blogs, 'author')
  const authorLikes = _.map(grouped, (items, author) => ({
    author,
    likes: _.sumBy(items, 'likes')
  }))
  return _.maxBy(authorLikes, 'likes')
}

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
  favoriteBlog,
  mostBlogs,
  mostLikes
}