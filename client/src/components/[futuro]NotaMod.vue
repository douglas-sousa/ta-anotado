<template>
  <b-modal id="note-modal-component" ref="xmodal">
    <b-card title-tag="title" header-tag="header" footer-tag="footer"
      header-bg-variant="warning" header-text-variant="white"
      border-variant="warning"
    >
      <div slot="header" class="mb-0" ref="div-header">
        <div class="hasDate" v-show="hasDate">
          <input type="date" v-model="deadline"
            v-b-tooltip.hover title="Campo opcional. Clique em 'Desabilitar data' para não inserir"
          >
          <span class="change-date-status" @click="changeDateStatus" ref="change-date-status"> 
            {{ spanButton }} <i :class="dateStatusIcon"></i> 
          </span>
        </div>
        <div class="hasntDate" v-show="hasntDate">
          <h6 ref="h6-deadline"
            v-b-tooltip.hover title="Campo desabilitado. Clique em 'Habilitar data' para inserir"
          >
            {{ deadline }}
            <span class="change-date-status" @click="changeDateStatus" ref="change-date-status"> 
              {{ spanButton }} <i :class="dateStatusIcon"></i> 
            </span>
          </h6>
        </div>
      </div>
      <b-card-title> <input type="text" v-model="title"> </b-card-title>
      <b-card-text> <textarea rows="8" cols="55" v-model="text"> </textarea> </b-card-text>
      <h6 slot="footer" align="right" class="reset-note" @click="reset"> 
        <span> Apagar <i class="fas fa-eraser"></i> </span> 
      </h6>
    </b-card>
  </b-modal>
</template>

<script>
export default {
  name: 'NotaModal',
  data() {
    return {
      dateStatusIcon: 'fas fa-minus-circle',
      hasDate: true,
      hasntDate: !hasDate,
      spanButton: 'Desabilitar data',
      title: 'Título da anotação',
      deadline: `${new Date().getFullYear()}-${("0" + (new Date().getMonth()+1)).slice(-2)}-${("0" + new Date().getDate()).slice(-2)}`,
      text: 'Conteúdo da anotação vem aqui',
      payload: {},
      backupPayload: {}
    }
  },
  watch: {
    hasDate(newValue) {
      if(!!newValue) {
        this.spanButton = 'Desabilitar data';
        this.dateStatusIcon = 'fas fa-minus-circle';
        return;
      }
      this.spanButton = 'Habilitar data';
      this.dateStatusIcon = 'fas fa-plus-circle';
    }
  },
  methods: {
    reset() {
      if(this.backupPayload) {
        this.title = this.backupPayload.title;
        this.deadline = this.backupPayload.deadline;
        this.text = this.backupPayload.text;

        if(this.backupPayload.deadline === 'Sem data fim') {
          this.hasDate = false;
          this.hasntDate = !this.hasDate;
          this.spanButton = 'Habilitar data';
          this.dateStatusIcon = 'fas fa-plus-circle';
          return;
        }
        this.spanButton = 'Desabilitar data';
        this.dateStatusIcon = 'fas fa-minus-circle';
        return;
      }
      this.hasDate = true;
      this.hasntDate = !this.hasDate;
      this.title = 'Título da anotação';
      this.deadline = `${new Date().getFullYear()}-${("0" + (new Date().getMonth()+1)).slice(-2)}-${("0" + new Date().getDate()).slice(-2)}`;
      this.text = 'Conteúdo da anotação vem aqui';

      this.spanButton = 'Desabilitar data';
      this.dateStatusIcon = 'fas fa-minus-circle';
    },
    changeDateStatus() {
      this.hasDate = !this.hasDate;
      this.hasntDate = !this.hasDate;
    }
  },
  mounted() {
    this.$refs['xmodal'].$on('shown', async(bvEvent, modalId) => {
      this.payload = await this.$attrs.props;
      this.backupPayload = this.payload;
      //Quando o $attrs vem vazio, ele cria uma propriedade length de valor 0
      //Senão o valor vem preenchido com os dados atribuídos
      //if(!!this.payload && this.payload.length === 0) {
        //return;
      //}
      let { text, deadline, title } = this.payload;
      if(deadline === 'Sem data fim') {
        this.hasDate = !this.hasDate;
        this.hasntDate = !this.hasDate;
      } 
      this.text = text; 
      this.deadline = deadline;
      this.title = title;
    })
    this.$refs['xmodal'].$on('close', (bvEvent, modalId) => {
      this.$attrs.props = [];
      this.payload = {}
      this.reset();
    })
  }
}
</script>

