module.exports = function menu2route(menus) {
  const deps = []
  const routes = tree2string(array2tree(menus))
  function array2tree(arr, parent) {
    const data = JSON.parse(JSON.stringify(arr))
    function loop(p) {
      return [...data].reduce((acc, cur) => {
        if (p === cur?.parent) {
          const children = loop(cur.key)
          const route = {
            name: cur.key,
            path: cur.path,
            component: cur.key,
          }
          if (children?.length > 0) {
            route.children = children
            delete route.component
          } else {
            deps.push(`const ${cur.key} = () => import('../views/${cur.key}.vue');`)
          }
          acc.push(route)
        }
        return acc
      }, [])
    }
    return loop(parent)
  }

  function tree2string(tree) {
    const result = []
    tree.forEach((item) => {
      const keys = Object.keys(item)
      const route = keys.map((key) => {
        if (Array.isArray(item[key])) {
          return `${key}: [${tree2string(item[key])}]`
        } else if (key === 'component') {
          return `${key}: ${item[key]}`
        } else {
          return `${key}: '${item[key]}'`
        }
      })
      result.push(`{${route.join(',')}},`)
    })
    return result
  }

  return `
${deps.join('\n')}

export default [
${routes.join('\n')}
]`
}
