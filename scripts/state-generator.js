module.exports = function menu2state(menus) {
  return `
export default {
  showLoading: false,
  curMenuKey: "",
  menus: ${JSON.stringify(menus)},
};
`
}
