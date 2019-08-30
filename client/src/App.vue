<template>
  <div id="app">
    <Logo />
    <router-view />
  </div>
</template>

<script>
import Logo from './components/Logo.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'app',
  components: { Logo },
  computed: {
    ...mapGetters(['getAllUsers'])
  }
}
</script>





