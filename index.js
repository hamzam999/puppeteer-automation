// import puppeteer from 'puppeteer'

const puppeteer = require('puppeteer')
const { printConsole, getLocalStorage } = require('./globalFunc')

const browser_url = 'https://demo.braina.live/'
const api_url = 'https://con.braina.live/'

const setHeaderOpenUrl = async page => {
  //set headers
  await page.setExtraHTTPHeaders({
    accept: 'application/json',
    Origin: browser_url,
  })

  // Navigate the page to a URL
  await page.goto(browser_url)
}

const interceptRequests = async page => {
  // Enable request interception
  await page.setRequestInterception(true)

  // Listen for network requests
  page.on('request', request => {
    request.continue() // Allow the request to proceed
  })

  // Listen for api_url responses
  page.on('response', async response => {
    // console.log('response.......')
    if (response.url().startsWith(api_url) || response.url().startsWith('https://www.google.com/recaptcha/enterprise')) {
      // Replace with the actual API URL
      const responseBody = await response.text()
      // console.log('API Response1:', responseBody)
      // console.log()
    }
    // console.log('response.......2')
  })
}

const signupuser = async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ args: ['--disable-features=IsolateOrigins,site-per-process,SitePerProcess', '--flag-switches-begin --disable-site-isolation-trials --flag-switches-end'], headless: 'new' })
  const page = await browser.newPage()

  setHeaderOpenUrl(page)
  interceptRequests(page)
  printConsole(page)
  // Fill the input element and click the checkbox
  await page.locator('input[type="email"]').fill('test@ith.tech')
  await page.click('input[type="checkbox"]')
  await page.click('button[type="submit"]')
  getLocalStorage(page)

  // // Get the value of the input element and checkbox
  // const inputValue = await page.evaluate(() => {
  //   const inputElement = document.querySelector('input[type="email"]')
  //   return inputElement ? inputElement.value : null
  // })

  // const checkboxValue = await page.evaluate(() => {
  //   const checkboxElement = document.querySelector('input[type="checkbox"]')
  //   return checkboxElement ? checkboxElement.checked : false
  // })

  // console.log('Input Value:', inputValue)
  // console.log('Checkbox Value:', checkboxValue)

  // Use page.evaluate to access localStorage items
  const localStorageData = await page.evaluate(() => {
    // Access localStorage and convert it to an object
    const localStorageObject = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      const value = localStorage.getItem(key)
      localStorageObject[key] = value
    }
    return localStorageObject
  })

  // Print the retrieved localStorage data
  console.log('localStorage data:', localStorageData)

  await browser.close()
}

signupuser()
