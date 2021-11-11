const state = {
  currentSharedScreenId: '',
  currentSharedScreenWinObj: {}
}

const mutations = {
  setCurrentSharedScreenId(state, id) {
    state.currentSharedScreenId = id
  },
  setCurrentSharedScreenWinObj(state, obj) {
    state.currentSharedScreenWinObj = obj
  }
}

const actions = {
  setCurrentSharedScreenIdAction({ commit }, data) {
    commit('setCurrentSharedScreenId', data)
  },
  setCurrentSharedScreenWinObjAction({ commit }, data) {
    commit('setCurrentSharedScreenWinObj', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
