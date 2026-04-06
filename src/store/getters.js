const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  verify: state => state.user.verify,
  permission_routes: state => state.permission.routes
}
export default getters
