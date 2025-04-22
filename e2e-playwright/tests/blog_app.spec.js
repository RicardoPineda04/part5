const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createNote } = require('./helpers')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // const locator = await page.getByText('Logout')
    // if (await locator.isVisible()){
    //   await page.getByText('Logout').click()
    // }
    await request.post('http://localhost:5173/api/testing/reset')
    await request.post('http://localhost:5173/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.goto('http://localhost:5173')

    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials.')
      await expect(page.getByText('Matti Luukkainen logged')).not.toBeVisible()
    })
  })
})