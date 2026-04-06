// 生产线去重
export function uniqueRoute(data) {
  const value = data.map(item => {
    return item.segmentCode.substring(0, 3).substring(2)
  })
  const tmp = [...new Set(value)]
  return tmp.map(item => ({ label: item + '线', value: item }))
}
// 工序去重
export function uniqueProcess(data) {
  const value = data.map(item => item.segmentName)
  const tmp = [...new Set(value)]
  // 目前只开放烘丝线
  const index = tmp.findIndex(item => item.includes('烘丝'))
  const newTmp = [tmp[index]]
  return newTmp.map(item => ({ label: item, value: item }))
}
// 牌号去重
export function uniqueBrand(data) {
  const value = data.map(item => item['proName'])
  const tmp = [...new Set(value)]
  return tmp.map(item => ({ label: item, value: item }))
}
