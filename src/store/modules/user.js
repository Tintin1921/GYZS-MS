import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { getInfo, setInfo, removeInfo } from '@/utils/auth'
import { resetRouter } from '@/router'
import CryptoJS from 'crypto-js'

const getDefaultState = () => {
  return {
    'token': getToken(),
    'role': null,
    'verify': false
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLE: (state, info) => {
    state.info = info
  },
  SET_VERIFY: (state, verify) => {
    state.verify = verify
  }
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    // 加密用户名和密码
    const { username, captchaCode } = userInfo
    // 为本地开发需求 此处设置了离线登录的用户名和密码 在正式版中会删除这一功能
    const password = CryptoJS.SHA256(userInfo.password).toString()
    if (username === 'admins' && password === 'fa956b808c8f8e3b59be14d7d584761e041a8359d58ba7e1829f12605d76203a' && captchaCode === 'admins') {
      return new Promise((resolve, reject) => {
        const data = {
          'employeeId': '333',
          'employeeName': 'admin',
          'username': 'admin',
          'workNum': '000000',
          'token': '59cba2a2-4033-8244-a8c0f455dca6'
        }
        commit('SET_ROLE', data.employeeId)
        commit('SET_TOKEN', data.token)
        sessionStorage.setItem('route', JSON.stringify(data.routeList))
        delete data.routeList
        setInfo(JSON.stringify(data))
        setToken(data.token)
        resolve()
      })
    }
    return new Promise((resolve, reject) => {
      // 此处是正常的登录验证
      login({ 'username': username, 'password': password, 'captchaCode': captchaCode }).then(response => {
        const { data } = response
        commit('SET_ROLE', data.employeeId)
        commit('SET_TOKEN', data.token)
        sessionStorage.setItem('route', JSON.stringify(data.routeList))
        delete data.routeList
        setInfo(JSON.stringify(data))
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取职工角色登录数据
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_VERIFY', true)
      if (state.role) {
        resolve(state.role)
      } else {
        resolve(JSON.parse(getInfo()).employeeId)
      }
    })
  },

  // 用户登出
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeInfo()
        removeToken()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 移除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeInfo()
      removeToken()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

