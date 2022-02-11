const express = require('express')
const http = require('http')
const start = require('../scripts/start')
const download = require('npm-gitee-lw')
const fs = require('fs')
const rimraf = require('rimraf')

const isDirExist = (path) => {
  try {
    fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK)
    return true
  } catch (err) {
    return false
  }
}
module.exports = function (port = 3000, cb = null) {
  const app = express()
  app.use(express.static('dist'))
  app.use(express.json())

  app.post('/create', async (req, res) => {
    const { menus, pages, path } = req.body
    await downloadProject(path)
    start(JSON.parse(menus), JSON.parse(pages), path)
    res.status(200).end()
  })

  app.get('/dir', (req, res) => {
    res.json({ data: open(req.query.path) })
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

function downloadProject(path) {
  if (!path) return
  const url = 'gitee:guomingyao/my-vite-app' // TODO
  return new Promise((resolve, reject) => {
    const startLoad = () => {
      download(url, path, { clone: true }, (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    }
    if (isDirExist(path)) {
      rimraf(path, (err) => {
        if (err) {
          return reject(err)
        }
        startLoad()
      })
    } else {
      startLoad()
    }
  })
}

function open(name) {
  return fs.readdirSync(name).filter((item) => !item.startsWith('.') && fs.lstatSync(`${name}/${item}`).isDirectory())
}
