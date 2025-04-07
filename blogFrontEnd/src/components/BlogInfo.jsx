import PropTypes from "prop-types"

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

BlogInfo.propTypes = {
    blog: PropTypes.shape({
        url: PropTypes.string.isRequired,
        likes: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        user: PropTypes.object,
    }).isRequired,
    vote: PropTypes.func.isRequired,
    deleteBlog: PropTypes.func.isRequired
}

export default BlogInfo