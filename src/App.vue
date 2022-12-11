<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
  props: ['session'],
  computed: {
    authenticated() {
      return this.$root.session.user != null;
    }
  },
  mounted() {
    console.log(this.$root.session.user)
  }
}
</script>

<style>
#app {
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}

html {
  background-size: cover;
  margin: 0;
  padding: 0;
}
</style>