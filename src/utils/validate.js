export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function validUsername(str) {
  const length = str.length
  if (length === 0) {
    return false
  } else {
    // 用户输入字符二次校验
    return true
    // return !/[^a-zA-Z0-9@._-]/g.test(str)
  }
}
