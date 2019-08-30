<template>
  <div class="notamod-view">
    <b-card title-tag="title" header-tag="header" footer-tag="footer"
      header-bg-variant="warning" header-text-variant="white"
      border-variant="warning"
    >
      <div slot="header" class="mb-0" ref="div-header">
        <div class="hasDate" v-show="ntdt.hasDate">
          <input type="date" v-model="ntdt.deadline"
            v-b-tooltip.hover title="Campo opcional. Clique em 'Desabilitar data' para não inserir"
          >
          <span class="change-date-status" @click="changeDateStatus" ref="change-date-status"> 
            <i :class="ntdt.dateStatusIcon"></i> {{ ntdt.spanButton }}
          </span>
        </div>
        <div class="hasntDate" v-show="ntdt.hasntDate">
          <h6 ref="h6-deadline"
            v-b-tooltip.hover ntdt.title="Campo desabilitado. Clique em 'Habilitar data' para inserir"
          >
            {{ ntdt.deadline }}
            <span style="float: right" class="change-date-status" @click="changeDateStatus" ref="change-date-status"> 
              <i :class="ntdt.dateStatusIcon"></i> {{ ntdt.spanButton }}
            </span>
          </h6>
        </div>
      </div>
      <b-card-title> <input type="text" v-model="ntdt.title"> </b-card-title>
      <b-card-text> <textarea rows="8" cols="55" v-model="ntdt.text"> </textarea> </b-card-text>
      <h6 slot="footer" align="right" class="reset-note">
        <b-button 
          variant="outline-warning" 
          class="btn-msg" 
          @click="save"
          :disabled="
            ntdt.title == 'Título da anotacao' || ntdt.title == '' ||
            ntdt.text == 'Conteúdo da anotação vem aqui' || ntdt.text == ''
          "
        > 
          {{ ntdt.saveBtnMsg }} <i class="far fa-save"></i>
        </b-button> 
        <b-button variant="outline-danger" @click="reset"> 
          Reverter alterações <i class="fas fa-eraser"></i> 
        </b-button> 
      </h6>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import NoteService from '../service/Note';

export default {
  name: 'NotaMod',
  data() {
    return {
      ntdt: {
        dateStatusIcon: 'fas fa-minus-circle',
        hasDate: true,
        hasntDate: false,
        spanButton: 'Desabilitar data',
        title: 'Título da anotação',
        deadline: `${new Date().getFullYear()}-${("0" + (new Date().getMonth()+1)).slice(-2)}-${("0" + new Date().getDate()).slice(-2)}`,
        text: 'Conteúdo da anotação vem aqui',
        existingNote: false,
        saveBtnMsg: 'Criar novo lembrete'
      }
    }
  },
  computed: {
    ...mapGetters(['user', 'today', 'newNoteReset'])
  },
  methods: {
    invert(date) {
      this.ntdt.hasDate = date;
      this.ntdt.hasntDate = !this.ntdt.hasDate;

      if(this.ntdt.hasDate) {
        this.ntdt.spanButton = 'Desabilitar data';
        this.ntdt.dateStatusIcon = 'fas fa-minus-circle';
        this.ntdt.deadline = this.today;
        return;
      }
      this.ntdt.spanButton = 'Habilitar data';
      this.ntdt.dateStatusIcon = 'fas fa-plus-circle';
      this.ntdt.deadline = 'Sem data fim';

    },
    reset() {
      if(this.$route.params && !!this.$route.params.text) {
        return;
      }
      let ks = Object.keys(this.ntdt);
      for(let i = 0; i < ks.length; i++) {
        this.ntdt[ks[i]] = this.newNoteReset[ks[i]];
      }
      console.log(this.ntdt);

    },
    changeDateStatus() {
      this.invert(!this.ntdt.hasDate);
    },
    async save() {
      console.log(this.$route);
      if(!this.ntdt.existingNote) {
        if(this.ntdt.deadline === this.today) this.ntdt.deadline = 'today';
        let confirmation = await NoteService.createNote(
          this.user._id, this.ntdt.title, this.ntdt.deadline, this.ntdt.text
        );
        console.log(confirmation);
        alert('Novo lembrete criado com sucesso');
        this.$router.push('principal');
        return;
      }
      if(this.ntdt.deadline === this.today) this.ntdt.deadline = 'today';
      let confirmation = await NoteService.updateNote(
        this.user._id, this.$route.params._id, this.ntdt.title, this.ntdt.deadline, this.ntdt.text
      );
      console.log(confirmation);
      alert('Lembrete alterado com sucesso');
      this.$router.push('principal');
    }
  },
  created() {
    if(this.$route.params && !!this.$route.params.text) {
      this.ntdt.existingNote = true;
      this.ntdt.saveBtnMsg = 'Salvar alterações';
      let { text, deadline, title } = this.$route.params;
      if(ntdt.deadline === 'Sem data fim') {
        this.invert(!this.ntdt.hasDate);
      } 
      this.ntdt.text = ntdt.text; 
      this.ntdt.deadline = ntdt.deadline;
      this.ntdt.title = ntdt.title;
    }
  }
}
</script>

