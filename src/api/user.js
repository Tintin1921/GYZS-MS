import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/api/auth/doLogin',
    method: 'post',
    data: data
  })
}

// 获取所有职工信息
export function getAllUserInfo(data) {
  return request({
    url: '/api/system/employees/with-roles',
    method: 'get',
    params: data
  })
}

// 修改密码
export function updatePwd(data) {
  return request({
    url: '/api/auth/logout',
    method: 'patch',
    data: data
  })
}

// 获取登录验证码
export function generate() {
  return request({
    url: '/api/auth/captcha/generate',
    method: 'get',
    responseType: 'blob'
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'get',
    withCredentials: true
  })
}
