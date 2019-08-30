export default {
  //Só chamar esse método na hora do login
  recordNotesToState(state, notes) {
    state.notes = notes;
  },
  recordUserToState(state, user) {
    state.user = user;
  }
}