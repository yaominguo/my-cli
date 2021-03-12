const chalk = require('chalk')
const download = require('npm-gitee-lw')
const ora = require('ora')
const fs = require('fs')
const answers = require('./answers')
const rimraf = require('rimraf')

const handleError = ({err, spinner}) => {
  if (err) {
    console.error(err)
    spinner.fail(err)
    spinner.stop()
    process.exit()
  }
}

const downloadProject = ({spinner, url, name, isDirExist}) => {
  return new Promise((resolve, reject) => {
    const startLoad = () => {
      download(url, `./${name}`, {clone: true}, err => {
        if (err) {
          handleError({err, spinner})
          return reject(err)
        }
        resolve()
      })
    }
    if (isDirExist) {
      rimraf(`./${name}`, err => {
        if (err) {
          handleError({err, spinner})
          return reject(err)
        }
        startLoad()
      })
    } else {
      startLoad()
    }
  })
}

const packageInfo = ({spinner, name, description, author}) => {
  return new Promise((resolve, reject) => {
    fs.readFile(`./${name}/package.json`, 'utf8', (err, data) => {
      if (err) {
        handleError({err, spinner})
        return reject(err)
      }
      const packageJson = JSON.parse(data)
      packageJson.name = name
      packageJson.description = description
      packageJson.author = author
      return resolve(JSON.stringify(packageJson, null, 2))
    })
  })
}

const updatePackageJson = ({spinner, name, data}) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`./${name}/package.json`, data, 'utf8', err => {
      if (err) {
        handleError({err, spinner})
        return reject(err)
      }
      resolve()
    })
  })
}

module.exports = async () => {
  const {name, description, author, url, isDirExist} = await answers()
  const spinner = ora('Wait a moment please, downloading from ').start()

  await downloadProject({spinner, url, name, isDirExist})
  spinner.succeed('Download complete. Generating project now ...')

  await updatePackageJson({spinner, name, data: await packageInfo({spinner, name, description, author})})
  spinner.succeed('Generate project complete!')

  spinner.stop()

  console.info(`
    ${chalk.bgWhite.black('--------Start your project--------')}
    ${chalk.yellow(`cd ${name}`)}
    ${chalk.yellow('npm install')}
    ${chalk.yellow('npm start')}
  `)
}