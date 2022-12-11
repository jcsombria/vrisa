<template>
  <div class="container d-flex">
    <div v-for="item in model" :key="item.name" class="select">
      <div class="select-block mb-3">
        <h1>{{ item.name }}</h1>
        <p align="center">
          <router-link :to="item.path">
            <i :class="item.icon" style="font-size: 5rem;"></i>
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: [
        { name: 'Actividades', icon: 'bi bi-tools', path: '/admin/activity' },
        { name: 'Vista', icon: 'bi bi-tv', path: '/admin/view' },
        { name: 'Controlador', icon: 'bi bi-cpu', path: '/admin/controller' },
        { name: 'Usuarios', icon: 'bi bi-people', path: '/admin/users' },
        { name: 'Cursos', icon: 'bi bi-wrench', path: '/admin/courses' },
      ],
    };
  },
};
</script>