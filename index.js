// import puppeteer from 'puppeteer'

const puppeteer = require('puppeteer')
const { printConsole, getLocalStorage, getCaptcha } = require('./globalFunc')

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
  page.on('request', interceptedRequest => {
    if (interceptedRequest.isInterceptResolutionHandled()) {
      console.log('interception resolution handled.......')
      return
    }
    if (interceptedRequest.url().includes(api_url)) {
      console.log('=================================', interceptedRequest.url())
    } else {
      // console.log('abort interceptRequests')
    }
    interceptedRequest.continue()
  })

  // Listen for api_url responses
  page.on('response', async response => {
    let url = await response.url()
    if (
      !url.includes('google') &&
      !url.endsWith('.png') &&
      !url.endsWith('.jpg') &&
      !url.endsWith('.js') &&
      !url.endsWith('.json') &&
      !url.endsWith('.css') &&
      !url.endsWith('.ico') &&
      !url.includes('static') &&
      !url.includes('static') &&
      !url.includes('data:image') &&
      !url.includes('walletconnect')
    ) {
      console.log('response-------', url)
      console.log()
      const responseBody = await response.text()
      console.log('API Response1:', responseBody)
    }
  })
}

const fillSignupForm = async page => {
  // Fill the input element and click the checkbox
  await page.locator('input[type="email"]').fill('teste@ith.tech')
  await page.click('input[type="checkbox"]')
  await page.click('button[type="submit"]')
}

const signupuser = async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false, channel: 'chrome', args: ['--start-maximized'], defaultViewport: { width: 1920, height: 1080 } })
  const page = await browser.newPage()

  setHeaderOpenUrl(page)
  // interceptRequests(page)

  await printConsole(page) // print console
  const token = await getCaptcha(page)

  if (token) {
    fillSignupForm(page)
  } else {
    console.log('no token found', token)
    await browser.close()
  }

  await getLocalStorage(page)
}

signupuser()