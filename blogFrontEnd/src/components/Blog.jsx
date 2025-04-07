import {useState} from 'react'
import BlogInfo from './BlogInfo'

const Blog = ({ blog, handleLike, handleDelete}) => {
    const [verInfo, setVerInfo] = useState(false)
    const blogStyle = {
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5
    }

    const vote = (blog) => {
      handleLike(blog)
    }

    const deleteBlog = (blog) => {
      handleDelete(blog)
    }

    return (
    <div style={blogStyle}>
      {blog.title} por {blog.author}
      <button onClick={() => setVerInfo(!verInfo)}>
        {verInfo ? 'hide' : 'view'}
      </button>
      {verInfo && (
        <BlogInfo blog={blog} vote={vote} deleteBlog={deleteBlog}/>
      )}
           
    </div>  
  )
}
  
  export default Blog