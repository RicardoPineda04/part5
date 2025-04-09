import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import BlogForm from './BlogForm'
import { describe } from 'vitest'

describe('BlogForm', () => {
    test('onSumbit new form with correct data', async () => {
        const user = userEvent.setup()
        const createBlog = vi.fn()

        render(<BlogForm createBlog={createBlog}/>)
        
        const title = screen.getByTestId('title')
        const url = screen.getByTestId('url')
        const author = screen.getByTestId('author')
        const button = screen.getByText('Send')

        await user.type(title, 'Testing the testing')
        await user.type(url, 'http://example.com')
        await user.type(author, 'Ted Tester')
        await user.click(button)

        expect(createBlog.mock.calls).toHaveLength(1)
        expect(createBlog.mock.calls[0][0]).toEqual({
            title: 'Testing the testing',
            url: 'http://example.com',
            author: 'Ted Tester'
        })
    })
})