import { asyncRoutes, constantRoutes } from '@/router'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

function filterRouter(asyncRoutes, filterData) {
  const bMap = new Map(filterData.map(item => [item.path, item.children.map(c => c.name)]))
  return asyncRoutes
    .filter(aItem => bMap.has(aItem.path))
    .map(aItem => ({
      ...aItem,
      children: aItem.children.filter(child => bMap.get(aItem.path).includes(child.name))
    }))
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes = []
      // 如果是管理员则获取所有权限
      if (roles === '333') {
        commit('SET_ROUTES', asyncRoutes)
        resolve(state.routes)
      } else {
        const data = JSON.parse(sessionStorage.getItem('route'))
        const OriginRouterMap = new Set(asyncRoutes.map(obj => obj.path))
        const filterData = data.filter(obj => OriginRouterMap.has(obj.path) && obj.children.length > 0)
          .map(({ path, children }) => ({ path, children }))
        const [objA] = asyncRoutes.filter(obj => obj.path === '*')
        const [objB] = asyncRoutes.filter(obj => obj.path === '/profile')
        accessedRoutes = filterRouter(asyncRoutes, filterData)
        accessedRoutes.push(objB)
        accessedRoutes.push(objA)
        commit('SET_ROUTES', accessedRoutes)
        resolve(state.routes)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
