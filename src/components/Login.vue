<template>
  <div class="container-fluid d-flex flex-column justify-content-start align-items-center vh-100">
    <div class="row" style="width: 450px; margin-top: 50px;">
      <div class="logo mb-5">
        <img class="mb-3" src="/images/VR-ISA.png" />
        <h1 class="mb-3">Laboratorios Virtuales y Remotos</h1>
        <h3 class="mb-3">UCM - DACYA</h3>
      </div>

      <form class="mx-auto" id="login" v-on:submit="submit">
        <div class="row mb-3">
          <label for="username" class="visually-hidden">Usuario:</label>
          <div class="input-group">
            <div class="btn"><i class="bi bi-person align-midle"></i></div>
            <input class="form-control" v-model="username" type="text" name="username" placeholder="Usuario"
              id="username" required autofocus>
          </div>
        </div>

        <div class="row mb-5">
          <label for="password" class="visually-hidden">Contraseña:</label>
          <div class="input-group">
            <div class="btn"><i class="bi bi-key"></i></div>
            <input v-model="password" type="password" name="password" placeholder="Contraseña" id="password"
              class="form-control">
          </div>
        </div>

        <button type="submit" class="form-control btn btn-primary" value="Submit">Entrar</button>
      </form>
      <div v-if="message.length > 0" class="alert alert-warning mt-3" role="alert">{{ message }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activities: [],
      title: 'VRLABS',
      message: '',
      username: '',
      password: '',
    };
  },
  methods: {
    submit(ev) {
      ev.preventDefault();
      this.$root.session
        .login(this.username, this.password)
        .then((user) => {
          this.$router.push('/home');
        })
        .catch((error) => {
          this.message = error.message;
        });
    },
  },

  beforeRouteEnter(to, from, next) {
    next(async (vm) => {
      const user = await vm.$root.session.authenticate().catch((error) => { });
      console.log('USER')
      console.log(user)
      // if (!user) window.location.href = '/';
      // return vm.$root.session.user ? '/home' : '/';
    });
  },

  // mounted() {
  //   if (this.$root.session && this.$root.session.user) {
  //     this.$router.push('/home');
  //   }
  // },
};
</script>

<style scoped>
/* .login-block {
  padding: 20px;
  margin: 0 auto;
}

.login-block input {
  width: 100%;
  height: 42px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
  font-size: 14px;
  padding: 0 20px 0 50px;
} */

/* .login-block input#username {
  background: #fff url(../images/username_icon.png) 20px top no-repeat;
  background-size: 16px 80px;
}

.login-block input#password {
  background: #fff url(../images/password_icon.png) 20px top no-repeat;
  background-size: 16px 80px;
} */
</style>