import {useState} from 'react'

const BlogForm = ({createBlog}) => {
    const [title, setTitle] = useState('') 
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('') 

    const handleNewBlog = (event) => {
        event.preventDefault()
        createBlog({
            title,
            author,
            url
        })
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div>
            <h2>Create new blog</h2>
            <form onSubmit={handleNewBlog}>
                <div>
                    Title
                    <input
                    type="text"
                    value={title}
                    name="Title"
                    onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                    Author
                    <input
                    type="text"
                    value={author}
                    name="Author"
                    onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    URL
                    <input
                    type="text"
                    value={url}
                    name="URL"
                    onChange={({ target }) => setUrl(target.value)}
                    />
                </div>
                <button type="submit">Send</button>
            </form>
        </div>
    )
}

  export default BlogForm