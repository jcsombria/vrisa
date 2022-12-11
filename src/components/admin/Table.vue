<template>
  <edition-panel>
    <div class="table-responsive">
      <table class="table table-sm table-striped table-hover table-bordered caption-top" id="viewsTable">
        <caption>{{ title }}</caption>
        <thead>
          <tr>
            <th class="align-middle" scope="col"><input type="checkbox" /></th>
            <th class="align-middle" scope="col"></th>
            <th class="align-middle" scope="col"></th>
            <template v-for="c in columns">
              <th class="align-middle" scope="col">{{ c }}</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in model" :key="v.id">
            <td class="align-middle"><input type="checkbox" /></td>
            <td class="align-middle"><i @click="edit(v.name)" class="bi bi-pencil" style="cursor:pointer"></i></td>
            <td class="align-middle"><i @click="remove(v.name)" class="bi bi-trash" style="cursor:pointer"></i></td>
            <template v-for="f in fields">
              <th v-if="f['strong']" class="align-middle" scope="row">{{ fields_value(v, f['key']) }}</th>
              <td v-else class="align-middle">{{ fields_value(v, f['key']) }}</td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </edition-panel>
</template>

<script>
import EditionPanel from './EditionPanel.vue';
export default {
  components: {
    EditionPanel,
  },
  props: ['title', 'columns', 'fields', 'fields_display', 'model_name'],
  data() {
    return {
      model: [],
      query: {
        // include: ['view', 'controller'],
      },
    };
  },
  methods: {
    fields_value(row, key) {
      return this.fields_display && key in this.fields_display
        ? this.fields_display[key](row)
        : row[key];
    },
    reload() {
      this.$root.session.query(`${this.model_name}/get`, this.query)
        .then(async (response) => {
          this.model = await response.json();
        })
        .catch((error) => {
          console.log(error);
          // showMessage(`Cannot load ${this.model_name} from server.`, 'modalGenericMessage');
        });
    },
    edit(entity) {
      // console.log(`/${this.model_name}/${entity.name}`);
      // this.$router.push(`/${this.model_name}/${entity.name}`);
    },
    remove(entity) {
      // console.log(entity);
      // post(
      //   `/admin/q/${this.model_name}/delete`,
      //   JSON.stringify({ where: { name: entity } }),
      //   (result) => {
      //     location.reload();
      //   },
      //   (error) => {
      //     console.log(error);
      //   }
      // );
    },
  },
  mounted() {
    this.reload();
  },
}
</script>