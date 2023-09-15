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
    const messageText = message.text()
    // const args = await Promise.all(message.args().map(arg => arg.jsonValue()))
    console.log(`Console Message...:`, messageText)
  })
}

exports.getLocalStorage = getLocalStorage
exports.printConsole = printConsole
