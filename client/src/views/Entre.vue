<template>
  <div>
    <b-container>
      <b-form @submit.prevent="signIn" v-if="alreadyUser">
        <b-form-group id="input-group-1" label-for="input-1">
          <template slot="label"> <i class="fas fa-signature"></i> Nome de usuário: </template>
          <b-form-input
            id="input-1"
            v-model="form.username"
            type="text"
            required
            placeholder="Digite seu nome de usuário"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label-for="input-2">
          <template slot="label"> <i class='fas fa-lock'></i> Sua senha: </template>
          <b-form-input
            id="input-2"
            v-model="form.password"
            type="password"
            required
            placeholder="Digite sua senha"
            description="Verifique que não há ninguém te observando!"
          ></b-form-input>
        </b-form-group>

        <b-button 
          type="submit" 
          variant="primary" 
          :disabled="form.password.length <= 0 || form.username.length <= 0"> 
          Entrar 
        </b-button>
        <b-button @click="wantRegister" variant="danger"> Quero me cadastrar! </b-button>
      </b-form>
      <!-- Fim do form para entrar -->

      <b-form @submit.prevent="signUp" v-if="registering">
        <b-form-group id="input-group-4" label="Email:" label-for="input-4">
          <template slot="label"> <i class="far fa-envelope"></i> Email: </template>
          <b-form-input
            id="input-4"
            v-model="newMember.email"
            type="email"
            required
            placeholder="Informe o seu email"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-1" label="Nome de usuário:" label-for="input-1">
          <template slot="label"> <i class="fas fa-signature"></i> Nome de usuário: </template>
          <b-form-input
            id="input-1"
            v-model="newMember.username"
            type="text"
            required
            placeholder="Escolha um nome de usuário"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label-for="input-2">
          <template slot="label"> <i class='fas fa-lock'></i> Sua senha: </template>
          <b-form-input
            id="input-2"
            v-model="newMember.password"
            type="password"
            required
            placeholder="Escolha uma senha"
            description="Verifique que não há ninguém te observando!"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-3" label-for="input-3">
          <template slot="label"> <i class='fas fa-lock'></i> Confirme senha: </template>
          <b-form-input
            id="input-3"
            v-model="newMember.confirmPassword"
            type="password"
            required
            placeholder="Redigite a senha informada acima"
          ></b-form-input>
        </b-form-group>

        <b-button 
          type="submit" 
          variant="primary"
          :disabled="
            newMember.email.length <= 0 || newMember.password.length <= 0 || 
            newMember.username.length <= 0 || newMember.confirmPassword <= 0"
        > 
          Cadastre-me agora! 
        </b-button>
        <b-button @click="wantLogin" variant="danger"> Já sou cadastrado! </b-button>
      </b-form>
      <br>
      <b-alert variant="danger" v-model="error.bool" dismissible> {{ error.msg }} </b-alert>
    </b-container>

    <b-nav tabs>
      <b-nav-item>
        <router-link to="/"> <i class="fas fa-home"></i> Voltar a página inicial </router-link>
      </b-nav-item>
    </b-nav>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import MemberService from '../service/Member';

export default {
  name: 'Entre',
  data() {
    return {
      error: { bool: false, msg: '' },
      alreadyUser: true,
      registering: false,
      form: { username: '', password: '' },
      newMember: { email: '', username: '', password: '', confirmPassword: '' }
    }
  },
  methods: {
    ...mapActions(['recordUser']),
    async signIn() {
      console.log("Entrando...");
      const { username, password } = this.form;
      let confirmation = await MemberService.authMember({
        username,
        password
      });
      if(confirmation.status !== 200) {
        let json = await confirmation.json();
        this.error.msg = json.response;
        this.error.bool = !!this.error.msg;
        return;
      }
      //Quardar no state um objeto do usuário logado junto de suas anotações
      let tUser = await MemberService.thisMember(username);
      this.recordUser(await tUser.json());
      let tn_verifier = await confirmation.json();
      localStorage.setItem('tn-token', tn_verifier.token);
      this.$router.push('principal');
      //Resetando os valores de form
      this.resetData(this.form);
    },
    async signUp() {
      const { email, username, password, confirmPassword } = this.newMember;
      
      if(password === confirmPassword) {
        let confirmation = await MemberService.createMember({ email, username, password });
        if(confirmation.status !== 201) {
          let json = await confirmation.json();
          this.error.msg = json.response;
          this.error.bool = !!this.error.msg;
          return;
        }
        //Redirecionando para a área de login
        this.wantLogin();
        alert("Usuário criado com sucesso!");
        return;
      }
      this.error.msg = "As senhas não coincidem!";
      this.error.bool = !!this.error.msg;
    },
    wantRegister() {
      this.resetData(this.form, this.newMember);
      this.alreadyUser = false;
      this.registering = true;
    },
    wantLogin() {
      this.resetData(this.form, this.newMember);
      this.alreadyUser = true;
      this.registering = false;
    },
    //Usando o rest operator no parâmetro para criar um vetor dos objetos passados
    resetData(...obj) {
      for(let indexObj = 0; indexObj < obj.length; indexObj++) {
        //Object.keys(o) retorna um vetor com o nome das propriedades do objeto passado
        let properties = Object.keys(obj[indexObj]);

        /*For dentro de for
        Iterando por todas as propriedades do objeto referenciado no momento
        e mutando os valores da propriedade para uma string vazia 
         */
        for(let indexProp = 0; indexProp < properties.length; indexProp++) {
          obj[indexObj][properties[indexProp]] = '';
        } 
      }
    }

  }
}
</script>

