const express = require('express')
const http = require('http')
const ora = require('ora')
const openBrowser = require('../utils/openBrowser')
const start = require('../scripts/start')

function httpServer(port = 3003, cb = null) {
  const app = express()
  app.use(express.static('dist'))
  app.use(express.json())

  app.post('/create', (req, res) => {
    const { menus, pages } = req.body
    start(menus, pages)
    res.status(200).end()
  })

  const httpServer = http.createServer(app)
  httpServer.listen(
    {
      host: 'localhost',
      port,
    },
    () => {
      cb && cb(`http://localhost:${port}`)
    }
  )

  return httpServer
}

function startServer() {
  const spinner = ora('Starting server ... ').start()
  httpServer(3000, (url) => {
    spinner.succeed(`🚀 Ready on ${url}`)
    openBrowser(url)
  })
  return
}

module.exports = startServer()
