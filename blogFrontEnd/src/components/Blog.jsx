import {useState} from 'react'
import BlogInfo from './BlogInfo'
import PropTypes from 'prop-types'

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

Blog.propTypes = {
  blog: PropTypes.shape({
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    user: PropTypes.object,
  }).isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired
}
  
export default Blog