<template>
  <div>
    <nav-bar></nav-bar>
    <div class="container-fluid">
      <div class="card">
        <div class="card-header text-center">
          <div class="row align-middle">
            <div v-if="started" class="col">
              <button v-show="counter == 0" @click="warnStop()" type="button" class="btn btn-outline-danger"><i
                  class="bi bi-stop"></i>Terminar actividad</button>
            </div>
            <div v-else class="col">
              <button @click="start()" type="button" class="btn btn-outline-success"><i class="bi bi-play" />Comenzar
                Actividad</button>
            </div>
          </div>
          <div v-if="showDescription" class="row">
            <div class="row mb-3">
              <h3>¿Estás seguro de que deseas terminar la sesión?</h3>
            </div>
            <div class="row">
              <div class="col"></div>
              <div class="col"><button @click="cancelStop" class="btn btn-sm btn-outline-primary">No, vuelve a la
                  actividad</button></div>
              <div class="col"><span class="text-primary">{{ counterMessage }}</span></div>
              <div class="col"><button @click="stop()" class="btn btn-sm btn-outline-success">Sí, quiero salir de
                  aquí</button></div>
              <div class="col"></div>
            </div>
          </div>
        </div>
        <div class="card-body">

          <!-- Remote Laboratory -->
          <div v-if="started" class="container-fluid">
            <slot name="content">
              <!-- Embedded version -->
              <div v-show="extern" class="row row-cols-1 row-cols-lg-3 row-cols-xl-4">
                <div class="col col-lg-8 col-xl-10">
                  <div class="container-fluid" v-html="lab"></div>
                </div>
                <div class="col col-lg-4 col-xl-2"></div>
                <!--div class="row row-cols-1 row-cols-sm-2"-->
                <!-- /div-->
              </div>

              <!-- Built-in version -->
              <div v-show="builtin" class="row">
                <h1 class="text-center text-primary fw-bold" style="color: #990033">{{ activity }}</h1>
              </div>
              <div v-show="builtin" class="row row-cols-1 row-cols-sm-2 row-cols-lg-3">
                <Plot v-for="i in graphs.keys()" id="plote" :graph="graphs[i]" :signals="signals">{{ i }}</Plot>
                <ControlPanel :labcontrol="labcontrol" :controllerModel="controllerModel" :controls="controls[0]">
                </ControlPanel>
              </div>
            </slot>

          </div>

          <!-- Activity description -->
          <div v-else class="container-fluid" v-html="help"></div>

        </div>
        <div class="card-footer">
          <div v-if="started" class="col">
            <h6>Tiempo restante: <span class="text-primary fw-bold">{{ remaining }}</span></h6>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from './Modal.vue';
import ControlPanel from './lab/ControlPanel.vue';
import Plot from './lab/Plot.vue';
import NavBar from './NavBar.vue';

export default {
  components: {
    Modal,
    ControlPanel,
    Plot,
    NavBar
  },
  props: {
    builtin: Boolean,
  },
  data() {
    return {
      activity: '',
      lab: '',
      started: false,
      labcontrol: new LabInstance('127.0.0.1', '8080', {
        onsignals: this.onsignals,
        ondisconnect: this.ondisconnect,
      }),
      counter: 0,
      disconnectionTimeout: 20,
      waitingForDisconnection: false,
      help: '',
      signals: { time: [], ref: [], u: [], y: [] },
      graphs: [],
      controls: [],
      controllerModel: {},
      remainingSeconds: 0,
      clock: setInterval(() => {
        if (this.remainingSeconds > 0) {
          this.remainingSeconds--;
        }
      }, 1000),
    };
  },
  computed: {
    remaining() {
      const format = (x) => Math.floor(x).toString().padStart(2, '0');
      const minutes = format(this.remainingSeconds / 60);
      const seconds = format(this.remainingSeconds % 60);
      return minutes > 0 ? `${minutes}:${seconds}` : seconds;
    },
    extern() {
      return !this.builtin;
    },
    remote() {
      return this.$root.session.getRemoteURL(this.activity);
    },
    counterMessage() {
      return `Desconexión en ${this.counter} segundos`;
    },
    showDescription() {
      return this.counter > 0;
    },
  },
  methods: {
    getSource(i) {
      return this.source[i];
    },
    onsignals(data) {
      const MAX_POINTS = 100;
      data.forEach((state) => {
        if (!state || state['variable'] != 'evolution' || !state['value']) {
          return;
        }
        try {
          Object.keys(this.signals).forEach((s, i) => {
            this.signals[s].push(state['value'][i]);
          });
        } catch (e) {
          console.log(e);
        }
      });
      Object.keys(this.signals).forEach((s, i) => {
        var excess = this.signals[s].length - MAX_POINTS;
        if (excess > 0) {
          this.signals[s].splice(0, excess);
        }
      });
    },
    ondisconnect(reason) {
      console.log(`VUE Disconnect: ${reason}`);
      if (reason === 'io client disconnect') {
      } else if (reason === 'io server disconnect') {
      } else {
      }
    },
    async start() {
      this.signals = { time: [], ref: [], u: [], y: [] };
      const session = this.$root.session;
      session
        .start(this.activity)
        .then((response) => {
          const activity = session.activity;
          this.remainingSeconds = Math.floor(activity.exp - Date.now() / 1000);
          this.controllerModel = activity.model;
          this.viewModel = activity.viewmodel;
          this.graphs = activity.viewmodel.graphs;
          this.controls = activity.viewmodel.controls;

          return this.builtin
            ? this.labcontrol.connect()
            : session.get(this.remote).then((response) => response.text());
        })
        .then((config) => {
          if (!this.builtin) {
            this.lab = config;
          }
          this.started = true;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    async warnStop() {
      if (this.builtin) {
        await this.labcontrol.disconnect();
      }
      const waitNextSecond = () => {
        if (this.waitingForDisconnection) {
          this.counter--;
          setTimeout(waitNextSecond, 1000);
        }
        if (this.counter > 0 || !this.waitingForDisconnection) {
          return;
        }
        this.stop();
      };
      this.waitingForDisconnection = true;
      this.counter = this.disconnectionTimeout;
      waitNextSecond();
    },
    cancelStop() {
      this.waitingForDisconnection = false;
      this.counter = 0;
      if (this.builtin) {
        this.labcontrol
          .connect()
          .then((response) => {
            this.started = true;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    stop() {
      this.started = false;
      this.waitingForDisconnection = false;
      this.counter = 0;
    },
  },
  beforeRouteEnter(to, from, next) {
    const activity = to.query.name;
    next((vm) => {
      vm.activity = activity;
      vm.$root.session
        .getHelp(vm.activity)
        .then((response) => {
          vm.help = response;
        })
        .catch((error) => {
          vm.help = error.message;
        });
    });
  },
  mounted() {
    for (const v of this.graphs.keys()) {
      console.log(v);

    }
    // const tour = new Shepherd.Tour({
    //   defaultStepOptions: {
    //     cancelIcon: {
    //       enabled: true,
    //     },
    //     classes: 'class-1 class-2',
    //     scrollTo: { behavior: 'smooth', block: 'center' },
    //   },
    // });

    //   tour.addStep({
    //     title: 'Creating a Shepherd Tour',
    //     text: `Creating a Shepherd tour is easy. too!\
    // Just create a \`Tour\` instance, and add as many steps as you want.`,
    //     attachTo: {
    //       element: '.hero-example',
    //       on: 'bottom',
    //     },
    //     buttons: [
    //       {
    //         action() {
    //           return this.back();
    //         },
    //         classes: 'shepherd-button-secondary',
    //         text: 'Back',
    //       },
    //       {
    //         action() {
    //           return this.next();
    //         },
    //         text: 'Next',
    //       },
    //     ],
    //     id: 'creating',
    //   });

    //   tour.start();
  },
};
</script>
