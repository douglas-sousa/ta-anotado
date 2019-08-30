<template>
  <div class="contato-view">
    <b-nav tabs>
      <b-nav-item>
        <router-link to="/"> <i class="fas fa-home"></i> Página inicial </router-link>
      </b-nav-item>
    </b-nav>

    <b-container>
      <b-card
        border-variant="warning"
        header="Sobre o projeto"
        header-bg-variant="warning"
        header-text-variant="white"
        align="center"
      >
        <b-card-text> Projeto criado por Douglas RS </b-card-text>
        <b-card-text> GitHub: https://github.com/douglas-sousa </b-card-text>
        <b-card-text> Na criação do projeto foi usado Vue, Vuex, Vue-Router, Bootstrap-vue e Font Awesome </b-card-text>
      </b-card>
    </b-container>

  </div>
</template>

<script>
export default {
  name: 'Contato',
  components: {}
}
</script>


