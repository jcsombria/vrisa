<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary bg-gradient text-light fw-bold p-0 mb-3">
      <div class="container-fluid">
        <router-link to="/home" class="navbar-brand">
          <img class="me-2" width="32" height="32" src="/images/VR-ISA-sm.png" />
          VR-ISA Labs
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <div class="dropdown">
              <button class="btn btn-primary text-light dropdown-toggle" type="button" id="activitiesMenu"
                data-bs-toggle="dropdown" aria-expanded="false">
                <i class="mx-1 bi bi-hammer"></i>Activities
              </button>
              <ul class="dropdown-menu" aria-labelledby="activitiesMenu">
                <!-- % activities.forEach(a => { % >
              <li><router-link to="activity?name=<%= a.name %>" class="dropdown-item fw-bold btn btn-danger btn-outline"><i class="mx-1 bi bi-hammer"></i>< % = a.name %></router-link></li-->
              </ul>
            </div>
            <li v-if="isAdmin" class="nav-item text-light">
              <router-link class="nav-link" to="/admin"><i class="mx-1 bi bi-gear"></i>Administration</router-link>
            </li>
          </ul>
          <div class="dropdown">
            <button class="btn btn-primary text-light dropdown-toggle" type="button" id="session"
              data-bs-toggle="dropdown" aria-expanded="false">
              {{ displayName }}
              <img class="mx-2 logout" src="/images/user_icon.png" width="40" height="36" />
            </button>
            <ul class="dropdown-menu" aria-labelledby="session">
              <li><router-link to="/" @click="session.logout"
                  class="dropdown-item fw-bold btn btn-danger btn-outline">Cerrar Sesión</router-link></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { onBeforeUpdate, onMounted, computed, ref, inject } from 'vue';

const session = inject('session');
const user = computed(() => session.user);
const isAdmin = computed(() => session.user && session.user.isAdmin);
const displayName = computed(() => session.user && session.user.displayName);
let authenticated = ref(false);


onBeforeUpdate(() => {
  console.log('BEFORE UPDATE')
  authenticated.value = session && session.authenticated;
  console.log(`The authenticated value is: ${authenticated}`)
})

onMounted(() => {
  console.log('MOUNTED')
  console.log(session)
  // authenticated.value = session.authenticated ? true : false;
  // console.log(`The authenticated value is: ${authenticated}`)
});
</script>

<style scoped>
.logout-block span {
  color: #fff;
  font-size: 20px;
  vertical-align: middle;
}

.logout-block img {
  vertical-align: middle;
}

.logout {
  background: #ff656c;
  box-sizing: border-box;
  border-radius: 5px;
  color: #fff;
  outline: none;
  vertical-align: middle;
  text-transform: uppercase;
}
</style>