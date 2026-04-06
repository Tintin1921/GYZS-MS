export function getRoleRouter(roleList, roleRouter, Routers) {
  const data = transformList(roleRouter.data)
  const allRole = roleList.data.map(item => item.key)
  for (let i = 0; i < allRole.length; i++) {
    const temp = filterData(data, allRole[i], allRole[i])
    const route = temp.map(obj => obj.path)
    roleList.data[i].routes = Routers.filter(obj => route.includes(obj.path) || obj.path === '')
  }
  function filterData(data, outerValue, innerValue) {
    return data.filter(item => {
      const outerMatch = item.roles.includes(outerValue)
      const innerMatch = !item.details || item.details.roles.includes(innerValue)
      return outerMatch && innerMatch
    })
  }
  function transformList(inputList) {
    return inputList.map(item => {
      const newItem = {}
      newItem.path = Object.keys(item)[0]
      newItem.roles = item[newItem.path]
      if (item.childs && item.childs.length > 0) {
        newItem.childs = transformList(item.childs)
      }
      return newItem
    })
  }
  return roleList
}
