<template>
  <div>
    <nav-bar></nav-bar>
    <div v-if="$root.session.user" class="row row-cols-1 row-cols-md-auto mx-3">
      <div class="col col-md-7 col-lg-8 col-xl-9">
        <div class="card text-center h-100">
          <div class="card-header">
            <h5 class="text-center">Actividades Disponibles</h5>
          </div>
          <div class="card-body d-flex justify-content-center">
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 row-cols-xxl-4">
              <div v-for="a in activities" v-bind:key="a.name" class="col" data-bs-toggle="tooltip"
                data-bs-placement="top" :title="a.description">
                <div class="card-header fw-bold bg-info">{{ a.name }}</div>
                <div class="card text-center rounded mb-3">
                  <img :src=a.image onerror="this.src='/images/vrlabs/VR-ISA-placeholder.png';" class="card-img-top img-fluid p-2 rounded-3"
                    alt="Imagen de la actividad">
                  <div class="card-body h-100">
                    <!-- h6 class="card-title fw-bold">{{a.name}}</h6 -->
                    <!-- p class="card-text">{{a.description}}</p -->
                    <router-link v-if="a.state == 'idle'" :to="a.url" class="btn btn-outline-success">Entra en esta
                      actividad</router-link>
                    <router-link v-else :to="a.url" class="btn btn-outline-danger">Actividad ocupada</router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col col-md-5 col-lg-4 col-xl-3">
        <div class="card">
          <div class="card-header text-nowrap">
            <h5 class="text-center">Últimos Experimentos</h5>
          </div>
          <div class="card-body" id="data">
            <div v-for="e in experiments" v-bind:key="e.date" class="container-fluid">
              <div class="row">
                <a href="/download/{{e.name}}">
                  <i class="bi bi-download mx-3"></i>{{ e.date }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from './NavBar.vue';

export default {
  components: {
    NavBar
  },
  data() {
    return {
      user: {},
      activities: [],
      experiments: [],
    };
  },
  methods: {
    reloadActivities() {
      this.$root.session
        .query('user/get', {
          where: { username: this.$root.session.user.username },
          include: ['activity'],
        })
        .then(async (response) => {
          this.user = await response.json();
          this.activities = this.user[0].Activities.map((a) => {
            return {
              name: a.name,
              description: a.description,
              image: `activities/${a.image}`,
              url: `remotelab?name=${a.name}`,
              state: a.state,
            };
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  async mounted() {
    this.experiments = await this.$root.session.getExperiments();
    this.reloadActivities();
  },
};
</script>