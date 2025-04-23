const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, likeTimes } = require('./helpers')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('')
  })

  test('Login form is shown', async ({ page }) => {
    await page.goto('')

    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('Matti Luukkainen logged')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai3', 'wrong')
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials.')
      await expect(page.getByText('Matti Luukkainen logged')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'React patterns', 'Michael Chan', 'https://reactpatterns.com/')
      await expect(page.getByText('Blog created: React patterns, Michael Chan')).toBeVisible()
    })

    describe('blog exists', () =>{
      beforeEach(async ({ page }) => {
        await createBlog(page, 'React patterns', 'Michael Chan', 'https://reactpatterns.com/')
      })

      test('edit a blog', async ({ page}) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).not.toBeVisible()
      })

      test('Delete blog by the creator', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        page.on('dialog', async (dialog) => {
          await dialog.accept()
        })
        await page.getByRole('button', { name: 'remove' }).click()
        
        await expect(page.getByText('React patterns by Michael Chan')).not.toBeVisible()
      })

      test('Delete blog by other users', async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'mluukkai', 'salainen')

        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })

    describe('multiple blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Go To Statement Considered Harmful', 'Edsger W. Dijkstra', 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html')   
        await createBlog(page, 'Canonical string reduction', 'Edsger W. Dijkstra', 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html')
        await createBlog(page, 'First class tests', 'Robert C. Martin', 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll')
      })

      test('blogs are ordered by likes', async ({ page }) => {
        await page.getByText('Go To Statement Considered Harmful').getByRole('button', { name: 'view'}).click()
        await page.getByText('Canonical string reduction').getByRole('button', { name: 'view'}).click()
        await page.getByText('First class tests').getByRole('button', { name: 'view'}).click()

        await page.pause()
        const button1 = page.getByText('Go To Statement Considered Harmful').getByRole('button', { name: 'like'})
        await likeTimes(page, button1, 1)
        await page.getByText('Go To Statement Considered Harmful').getByRole('button', { name: 'hide'}).click()

        let button2 = page.getByText('Canonical string reduction').getByRole('button', { name: 'like'})
        await likeTimes(page, button2, 3)
        await page.getByText('Canonical string reduction').getByRole('button', { name: 'hide'}).click()

        let button3 = page.getByText('First class tests').getByRole('button', { name: 'like'})
        await likeTimes(page, button3, 2)
        await page.getByText('First class tests').getByRole('button', { name: 'hide'}).click()

        const blogDivs = await page.locator('div.blog').all()

        expect(blogDivs[0]).toHaveText('Canonical string reduction by Edsger W. Dijkstraview') 
        expect(blogDivs[1]).toHaveText('First class tests by Robert C. Martinview') 
        expect(blogDivs[2]).toHaveText('Go To Statement Considered Harmful by Edsger W. Dijkstraview') 
      })

    })

  })
})