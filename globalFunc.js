const getLocalStorage = async page => {
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
}

const printConsole = async page => {
  // Enable console messages
  page.on('console', async message => {
    // const messageText = message.text()
    const args = await Promise.all(message.args().map(arg => arg.jsonValue()))
    console.log(`Console Args...:`, args)
    // console.log(`Console Message...:`, messageText)
  })
}

const getCaptcha = async page => {
  console.log('inside get captcha')
  // Determine the iframe's selector or index
  const iframeSelector = 'iframe[title="reCAPTCHA"]' // Replace with the actual selector or index

  // Switch to the iframe context
  const iframeElement = await page.waitForSelector(iframeSelector)
  const iframe = await iframeElement.contentFrame()

  // Now, search for the input element inside the iframe
  const inputElement = await iframe.$('input[type="hidden"][id="recaptcha-token"]')

  if (inputElement) {
    const token = await inputElement.evaluate(node => node.value)
    console.log('reCAPTCHA v3 Token:', token)
    return token
  } else {
    console.log('Element not found inside the iframe.')
    return null
  }
}

const waitForPageLoad = async page => {
  // Wait for the page to load completely (including network requests)
  await page.waitForNavigation({ waitUntil: 'networkidle0' })
}

exports.getLocalStorage = getLocalStorage
exports.printConsole = printConsole
exports.getCaptcha = getCaptcha
exports.waitForPageLoad = waitForPageLoad