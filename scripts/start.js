/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const mkdirp = require('mkdirp')
const getDirName = require('path').dirname
const configs2html = require('./html-generator.js')
const menu2route = require('./route-generator.js')

function writeFile(path, content) {
  mkdirp(getDirName(path), (err) => {
    if (err) return console.error('err:', err)
    fs.writeFile(path, content, 'utf-8', (err) => {
      err && console.error(err)
    })
  })
}
module.exports = function (menus, pages, directory) {
  Object.keys(pages).forEach((key) => writeFile(`${directory}/src/views/${key}.vue`, configs2html(pages[key])))
  writeFile(`${directory}/src/router/routes.ts`, menu2route(menus))
  writeFile(
    `${directory}/src/router/index.ts`,
    `import { createRouter, createWebHashHistory } from 'vue-router'
  import routes from './routes'

  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  })

  export default router
  `
  )
}
