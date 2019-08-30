const _today = `${new Date().getFullYear()}-${("0" + (new Date().getMonth()+1)).slice(-2)}-${("0" + new Date().getDate()).slice(-2)}`;

export default {
  allNotes(state) {
    return state.notes ? state.notes : null;
  },
  user(state) {
    return (state.user) ? {
      _id: state.user._id,
      username: state.user.username
    }
    : null;
  },
  today() {
    return _today;
  },
  newNoteReset() {
    return {
      dateStatusIcon: 'fas fa-minus-circle',
      hasDate: true,
      hasntDate: false,
      spanButton: 'Desabilitar data',
      title: 'Título da anotação',
      deadline: _today,
      text: 'Conteúdo da anotação vem aqui',
      existingNote: false,
      saveBtnMsg: 'Criar novo lembrete'
    }
  }
}