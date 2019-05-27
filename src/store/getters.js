const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  userData: state => state.user.userData,
  permission_routes: state => state.permission.routes
}
export default getters
