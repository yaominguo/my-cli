const ora = require('ora')
const openBrowser = require('../utils/openBrowser')
const httpServer = require('../utils/httpServer')

function startServer(port) {
  const spinner = ora('Starting server ... ').start()
  httpServer(port, (url) => {
    spinner.succeed(`🚀 Ready on ${url}`)
    openBrowser(url)
  })
  return
}

module.exports = startServer(3333)
