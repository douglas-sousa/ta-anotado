export default {
  recordNotes({ commit }, notes) {
    commit('recordNotesToState', notes);
  },
  recordUser({ commit }, user) {
    commit('recordUserToState', user)
  }
}

/* Exemplo de uso de action com getter
async addNewUser({ commit, getters }, newUser) {
  let confirmation = await getters.getSpecificUser(newUser);
  if(confirmation) return 'Usuário já existe!';
  commit('addToState', newUser)
}
*/