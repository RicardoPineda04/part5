import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notificacion';
import BlogForm from './components/BlogForm'
import Togglable from './components/Toggable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  // const [title, setTitle] = useState('') 
  // const [author, setAuthor] = useState('')
  // const [url, setUrl] = useState('') 
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [typeMessage, setTypeMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const userLogged = window.localStorage.getItem('userInfo');
    if (userLogged){
      const user = JSON.parse(userLogged);
      setUser(user);
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  // const newBlogForm = () => (
  //   <form onSubmit={handleNewBlog}>
  //     <div>
  //       Title
  //         <input
  //         type="text"
  //         value={title}
  //         name="Title"
  //         onChange={({ target }) => setTitle(target.value)}
  //       />
  //     </div>
  //     <div>
  //       Author
  //         <input
  //         type="text"
  //         value={author}
  //         name="Author"
  //         onChange={({ target }) => setAuthor(target.value)}
  //       />
  //     </div>
  //     <div>
  //       URL
  //         <input
  //         type="text"
  //         value={url}
  //         name="URL"
  //         onChange={({ target }) => setUrl(target.value)}
  //       />
  //     </div>
  //     <button type="submit">Send</button>
  //   </form>
  // )

  const handleLogin = async(event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'userInfo', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage(`Wrong credentials. ${exception}`)
      setTypeMessage('error')
      setTimeout(() => {
        setMessage(null)
        setTypeMessage(null)
      }, 5000)
    }
  }

  const handleNewBlog = async(newBlog) => {
    blogFormRef.current.toggleVisibility()
    try{
      const createdBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(createdBlog))
      setMessage(`A new blog ${createdBlog.title} by ${createdBlog.author} added`)
      setTypeMessage('confirmation')
      setTimeout(() => {
        setMessage(null)
        setTypeMessage(null)
      }, 5000)
    }catch (exception) {
      setMessage(`Something went wrong. ${exception}`)
      setTypeMessage('error')
      setTimeout(() => {
        setMessage(null)
        setTypeMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('userInfo')
    setUser(null)
  }

  const handleLike = async (blog) =>{
    try {
      const res = await blogService.update(blog)
      if (res){
        setBlogs(blogs.map(b => b.id !== blog.id ? b : res))
      }
    }catch (error){
      console.error('Error updating blog:', error)
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        setMessage(`Blog ${blog.title} by ${blog.author} removed`)
        setTypeMessage('confirmation')
        setTimeout(() => {
          setMessage(null)
          setTypeMessage(null)
        }, 5000)
      } catch (error) {
        console.error('Error deleting blog:', error)
      }
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {loginForm()} 
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged</p>
      <button onClick={handleLogout}>Logout</button>
      <Notification message={message} typemessage={typeMessage}/>
      <Togglable buttonLabel='New Blog' ref={blogFormRef}>
        <BlogForm createBlog={handleNewBlog}/>
      </Togglable>
      {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={handleDelete}/>
      )}
    </div>
  )
}

export default App