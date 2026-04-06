import Cookies from 'js-cookie'

const TokenKey = 'token'
const InfoKey = 'info'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getInfo() {
  return Cookies.get(InfoKey)
}

export function setInfo(info) {
  return Cookies.set(InfoKey, info)
}

export function removeInfo() {
  return Cookies.remove(InfoKey)
}
