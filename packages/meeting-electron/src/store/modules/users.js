const state = {
  loginUserInfo: {}
}

const mutations = {
  setLoginUserInfo(state, info) {
    state.loginUserInfo = info
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
