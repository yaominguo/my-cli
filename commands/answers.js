const program = require('commander')
const option = program.parse(process.argv).args[1]
const defaultName = typeof option === 'string' ? option : 'my-project'
const templateList = require(`${__dirname}/templates.json`)
const templateOptions = Object.keys(templateList) || []
const fs = require('fs')
const {prompt} = require('inquirer')

const isDirExist = (name) => {
  try {
    fs.accessSync(`./${name}`, fs.constants.R_OK | fs.constants.W_OK);
    return true
  } catch (err) {
    return false
  }
}

const collectOtherInfo = async (name) => {
  const prompts = [
    {
      type: 'list',
      name: 'template',
      message: 'Choose project template',
      choices: templateOptions,
      default: templateOptions[0],
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description',
      default: 'My Project',
      filter(val) {
        return val.trim()
      },
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author name',
      default: 'Guo',
      filter(val) {
        return val.trim()
      },
    }
  ]
 const {template, ...answers} = await prompt(prompts)
 return {
    name,
    template,
    isDirExist: isDirExist(name),
    url: templateList[template]['url'],
    ...answers,
  }
}

const startCollectInfo = async () => {
  const prompts = [
    {
      type: 'input',
      name: 'name',
      message: 'Project name',
      default: defaultName,
      filter(val) {
        return val.trim()
      },
      validate(val) {
        const validate = (val.trim().split(' ').length === 1)
        return validate || 'Project name is not allowed to have spaces.'
      },
    },
    {
      type: "confirm",
      message: "Folder already exist, overwrite it or not? \n 存在同名文件夹，是否覆盖？",
      name: "overwrite",
      when: function({name}) {
        return isDirExist(name)
      },
    },
  ]
  const {name, overwrite} = await prompt(prompts)
  if (isDirExist(name)) {
    if (overwrite) return await collectOtherInfo(name)
    return  await startCollectInfo()
  }
  return await collectOtherInfo(name)
}

module.exports = startCollectInfo
