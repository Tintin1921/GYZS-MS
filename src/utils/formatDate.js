export function formatDate(item) {
  const date = new Date(item)
  const year = date.getFullYear()
  const month = formatNumber(date.getMonth() + 1)
  const day = formatNumber(date.getDate())
  const hour = formatNumber(date.getHours())
  const minute = formatNumber(date.getMinutes())
  const second = formatNumber(date.getSeconds())
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}

export function formatLocalDate(item) {
  const date = new Date(item)
  const year = date.getFullYear()
  const month = formatNumber(date.getMonth() + 1)
  const day = formatNumber(date.getDate())
  return year + '-' + month + '-' + day
}

export function formatNumber(num) {
  return num < 10 ? '0' + num : num
}
