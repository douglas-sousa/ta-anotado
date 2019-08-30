<template>
  <div class="principal-view">
    <div class="buttons">
      <b-dropdown id="dropdown-1" class="m-md-2" variant="warning" right dropleft>
        <template slot="button-content">
          <i class="fas fa-user-circle"></i> {{ tUser.username }}
        </template>  
        <b-dropdown-item> <i class="far fa-id-badge"></i> Meu perfil </b-dropdown-item>
        <b-dropdown-item> <i class="fas fa-sign-out-alt"></i> Desconectar-me </b-dropdown-item>
      </b-dropdown>
    </div>
    <!-- ESPAÇO -->
    <Notas/>
  </div>
</template>

<script>
import Notas from '../components/Notas';
import NoteService from '../service/Note';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'Principal',
  components: {
    Notas
  },
  data() {
    return {
      tUser : { username: '', _id: ''},
    }
  },
  methods: {
    ...mapGetters(['user']),
    ...mapActions(['recordNotes'])
  },
  async created() {
    this.tUser = await this.user();
    let call = await NoteService.getUserNotes(this.tUser._id);
    let notes = await call.json();
    this.recordNotes(notes);
  }
}
</script>