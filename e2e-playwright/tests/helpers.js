const loginWith = async (page, username, password)  => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'New Blog' }).click()
    await page.getByTestId('title').fill(title)
    await page.getByTestId('author').fill(author)
    await page.getByTestId('url').fill(url)
    await page.getByRole('button', { name: 'Create' }).click()
}

const likeTimes = async (page, button, n) => {
    for (let i = 0; i<n; i++) {
      await button.click()
      await page.getByText(`likes ${i+1}`).waitFor()
    }
}
export { loginWith, createBlog, likeTimes}