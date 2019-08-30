<template>
  <div class="inicial-view">
    <b-nav tabs>
      <b-nav-item>
        <router-link to="/entre"> 
          <i class="fas fa-sign-in-alt"></i> Entre
          / <i class="fas fa-user-plus"></i> Cadastre-se! </router-link>
      </b-nav-item>
      <b-nav-item>
        <router-link to="/contato"> <i class="fas fa-id-card"></i> Contato </router-link>
      </b-nav-item>
    </b-nav>
    
    <b-container>
      <p> Quer um local agradável para ter registrado seus compromissos? </p>
      <p> Venha fazer parte do Tá Anotado! </p>
      <p> Receba por emails alertas do término do prazo de suas anotações </p>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Inicial',
  components: {}
}
</script>

