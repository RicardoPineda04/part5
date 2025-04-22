const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const userExtractor = require('../utils/middleware').userExtractor

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

const getToken = request => {
  const token = request.get('authorization')
  if(token && token.startsWith('Bearer ')){
    return token.replace('Bearer ', '')
  }
  return null
}

blogRouter.post('/', userExtractor, async (request, response) => { 
  const user = request.user
  if(!user){
    return response.status(401).json({ error: 'user missing'})
  }
  if(request.body.title === undefined || request.body.url === undefined){
    return response.status(400).json({ error: 'Title or URL is missing'})
  }
  const newBlog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user.id
  }
  const blog = new Blog(newBlog)
  
  const savedBlog = await blog.save()
  user.blogs = user.blogs?.concat(savedBlog.id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogRouter.put('/:id', async (request, response) =>{
  const body = request.body

  const updateBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updateBlog, { new: true}).populate('user')
  response.json(updatedBlog)
})

blogRouter.delete('/:id', userExtractor, async(request, response) => {
  const blog = await Blog.findById(request.params.id);
  const user = request.user
  if(blog.user.toString() === user.id.toString()){
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }else{
    return response.status(401).json({error: 'Unauthorized'})
  } 
})

module.exports = blogRouter