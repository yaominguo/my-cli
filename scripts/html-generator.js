module.exports = function configs2html(configs) {
  const data = configs.sort((a, b) => a.x - b.x).sort((a, b) => a.y - b.y)
  const scripts = []
  const children = data.map((item, i) => {
    const props = Object.keys(item.props)
      .map((key) => {
        if (key.startsWith('__')) {
          return ''
        }
        if (typeof item.props[key] === 'string') {
          return `${key}="${item.props[key]}"`
        } else {
          if (typeof item.props[key] === 'object') {
            scripts.push(`const ${key} = ${JSON.stringify(item.props[key])}`)
            return `:${key}="${key}"`
          } else {
            return `:${key}="${item.props[key]}"`
          }
        }
      })
      .join(' ')

    let lastItem = configs[i - 1]
    let occupy = ''
    if (lastItem && lastItem?.y !== item.y) {
      const lastRowWidth = data.filter((e) => e.y === lastItem.y).reduce((acc, cur) => acc + cur.w, 0)
      if (lastRowWidth !== 12) {
        occupy = `<n-grid-item :span="${12 - lastRowWidth}" />`
      }
    }

    return `
      ${occupy}
      <n-grid-item
          :span="${item.w}"
        >
          <${item.tag} ${props}>
            ${item.props.value ? item.props.value : ''}
          </${item.tag}>
        </n-grid-item>
      `
  })
  return `
  <template>
    <n-grid :cols="12" :x-gap="8" :y-gap="8">
    ${children.join('')}
    </n-grid>
  </template>

  <script lang="ts" setup>
  ${scripts.length > 0 ? scripts.join('\n') : ''}
  </script>

  <style lang="stylus" scoped></style>
  `
}
