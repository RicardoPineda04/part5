import blogService from '../services/blogs'
const BlogInfo = ({blog, vote, deleteBlog}) => {
    const nameOfUser = blog.user ? blog.user.name : 'anonymous'

    const updateLikes = () => {
        const updatedBlog = {
            ...blog,
            likes: blog.likes + 1
        }
        vote(updatedBlog)            
    }
    
    const removeBlog = () => {
        deleteBlog(blog)
    }
    return(
        <div>
            <div>
                <a href={blog.url}>{blog.url}</a>
            </div>
            <div>
                likes {blog.likes}
                <button onClick = {updateLikes}>
                like
                </button>
            </div>
            <div>
                {nameOfUser}
            </div>
            <div>
                <button onClick= {removeBlog} >Remove</button>
            </div>
        </div>
    )
}

export default BlogInfo