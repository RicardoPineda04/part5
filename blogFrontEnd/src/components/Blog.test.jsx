import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'

import Blog from './Blog'
import BlogInfo from './BlogInfo'

describe('blog', () => {
    const renderBlog = {
        title: 'Test Title',
        url: 'http://test.com',
        author: 'Test Author',
        likes: 0
    }

    test('Show title & author by default', () => {
        render(<Blog blog={renderBlog} handleLike={vi.fn()} handleDelete={vi.fn()}/>)

        expect(screen.getByText('Test Title', { exact: false })).toBeDefined()
        expect(screen.queryByText('http://example.com', { exact: false })).toBeNull()
    })

    test('show url and likes when clicked', async () =>{
        const user = userEvent.setup()
        render(<Blog blog={renderBlog} handleLike={vi.fn()} handleDelete={vi.fn()}/>)
        const button = screen.getByText('view')
        await user.click(button)
    
        expect(screen.getByText('http://test.com', { exact: false })).toBeDefined()
        expect(screen.getByText('likes', { exact: false })).toBeDefined()
    })

    test('like button clicked twice', async () => {
        const user = userEvent.setup()
        const handleLike = vi.fn()
        render(<BlogInfo blog={renderBlog} vote={handleLike} deleteBlog={vi.fn()}/>)

        const button = screen.getByText('like')
        await user.click(button)
        await user.click(button)

        expect(handleLike.mock.calls).toHaveLength(2)
    })
})