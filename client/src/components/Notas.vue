<template>
  <div class="notas-component">
    <!--<NotaModal ref="noteModal" :props="noteData"/>-->
    <b-container>
        <div id="add-note"> 
          <router-link :to="{ name: 'NotaMod' }"> 
            <i class="fas fa-plus-circle"></i> anotação 
          </router-link> 
        </div>
        <div class="note-group">
          <div class="individual-note" v-for="(note, index) in newNotes" :key="note._id" ref="ind-note">
            <b-card title-tag="title" header-tag="header" footer-tag="footer"
              header-bg-variant="warning" header-text-variant="white"
              border-variant="warning" class="main-card"
            >
              <h6 slot="header" class="mb-0">
                {{ note.deadline.split('-').reverse().join('/') }}
                <router-link :to="{ name: 'NotaMod', params: note }">
                  <i class="fas fa-edit" v-b-tooltip.hover title="Clique para editar a anotação"></i>
                </router-link>
              </h6>
              <b-card-title> {{ note.title }}</b-card-title>
              <b-card-text> {{ note.text }} </b-card-text>
              <h6 slot="footer" align="right" class="del-footer" @click="delNote(index)"> 
                Apagar anotação <i class="fas fa-times-circle"></i> 
              </h6>
            </b-card>
          </div>
        </div>
    </b-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import NoteService from '../service/Note';
//import NotaMod from './NotaMod.vue';
export default {
  //components: { NotaMod },
  data() {
    return {
      newNotes: [], 
      defaultDeadline: 'Sem data fim',
      wantUpdate: false,
      wantAddNote: false,
      noteData: []
    }
  },
  computed: {
    ...mapGetters(['allNotes', 'user'])
  },
  watch: {
    allNotes() {
      this.newNotes = this.dateFormatter(this.allNotes);
    }
  },
  methods: {
    ...mapActions(['recordNotes']),
    dateFormatter(notes) {
      //Recebendo um clone por valor de allNotes
      let clone = JSON.parse(JSON.stringify(notes));
      //Formatando as datas de newNotes
      for(let i = 0; i < clone.length; i++) {
        if(new Date(clone[i].deadline).getFullYear() != '9999') {
          //toLocaleString vai formatar a data separando o dia das horas. O dia estará no índice 0
          const formattedDate = new Date(clone[i].deadline).toLocaleString().split(',')[0];
          //Para o input date o formato deve ser ano-mês-dia
          clone[i].deadline = formattedDate.split('/').reverse().join('-');
          continue;
        }
        clone[i].deadline = this.defaultDeadline;
      }
      return clone;
    },
    async delNote(i) {
      let confirmation = await NoteService.deleteNote(this.user._id, this.allNotes[i]._id);
      if(confirmation.status === 200) {
        let call = await NoteService.getUserNotes(this.user._id);
        let notes = await call.json();
        this.recordNotes(notes);
      }
    },
    showAddNoteMod() {
      //this.$refs['noteModal'].$refs['xmodal'].show();
    },
    showModifyNoteMod(note) {
      //this.noteData = note;
      //this.$refs['noteModal'].$refs['xmodal'].show();
    }
  }
}
</script>

