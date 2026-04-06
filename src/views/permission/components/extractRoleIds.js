// 从角色路由表中分离出roleId
export function extractRoleIds(dataArray) {
  return dataArray.reduce((acc, item) => {
    if ('routeId' in item) acc.push(item.routeId)
    if (Array.isArray(item.children)) {
      acc.push(...extractRoleIds(item.children))
    }
    return acc
  }, [])
}

// 从角色路由表中分离出子roleId
export function extractChildRoleIds(dataArray) {
  return dataArray.reduce((acc, item) => {
    if ('routeId' in item) acc.push(item.routeId)
    return acc
  }, [])
}
