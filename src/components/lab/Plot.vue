<template>
  <div class="card">
    <div class="card-header">Plot</div>
    <div class="card-body">
      <div class="row">
        <!-- div class="col col-2">
          <input type="range" class="form-range" style="transform: rotate(-90deg)" min="1" max="50" value="5">
        </div -->
        <!-- div class="col col-10" -->
        <div ref="dash" class="dash-root"></div>
        <!-- /div -->
      </div>
      <div class="row">
        <div class="col">
          <input type="range" class="form-range" min="1" max="50" value="5" id="myRange">
        </div>
      </div>
      <div class="row">
        <div v-for="s in Object.keys(this.graph.signals)" :key="s" class="col">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" :model="graph.signals[s].show" :name="s" />
            <label class="form-check-label small" :for="s">
              {{ s }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: String,
    signals: Object,
    graph: Object,
    time_axis: { type: Boolean, default: true },
  },
  data() {
    return {
      glyph: 'line',
      title: this.title,
      xaxis_label: 'Tiempo (s)',
      yaxis_label: 'Valor',
      plot: null,
      period: 1000,
      updating: true,
      colors: [
        '#ff0000',
        '#0000ff',
        '#00ffff',
        '#00ff00',
        '#ffff00',
        '#ff00ff',
      ],
      source: new Bokeh.ColumnDataSource(this.signals),
    };
  },
  methods: {
    createPlot() {
      console.log('CREATE PLOT')
      this.plot = new Bokeh.Plotting.Figure({
        title: this.graph.title,
        x_range: new Bokeh.Range1d({ start: -5, end: 0 }),
        y_range: new Bokeh.Range1d({ start: -12, end: 12 }),
        sizing_mode: 'stretch_width',
        plot_width: 400,
        plot_height: 400,
        // background_fill_color: '#000000',
        // border_fill_color: '#000000',
      });
      this.plot.toolbar.logo = undefined;
      this.plot.add_tools(new Bokeh.SaveTool(), new Bokeh.HoverTool());
      this.plot.toolbar_location = 'right';
      // add axes to the plot
      // var xaxis = new Bokeh.LinearAxis({
      //   axis_line_color: null,
      //   axis_label: xaxis_label,
      //   // axis_label_text_color: '#000000',
      //   // major_label_text_color: '#000000',
      // });
      // var yaxis = new Bokeh.LinearAxis({
      //   axis_line_color: null,
      //   axis_label: yaxis_label,
      //   // axis_label_text_color: '#ffff00',
      //   // major_label_text_color: '#ffff00',
      // });
      // this.plot.add_layout(xaxis, 'below');
      // this.plot.add_layout(yaxis, 'left');
      // // add grids to the plot
      // var xgrid = new Bokeh.Grid({
      //   ticker: xaxis.ticker,
      //   dimension: 0,
      //   // grid_line_dash: [5, 5],
      //   grid_line_width: 1,
      // });
      // var ygrid = new Bokeh.Grid({
      //   ticker: yaxis.ticker,
      //   dimension: 1,
      //   // grid_line_dash: [2, 2],
      //   grid_line_width: 1,
      // });
      // this.plot.add_layout(xgrid);
      // this.plot.add_layout(ygrid);
      let nextColor = 0;
      for (const [signal, info] of Object.entries(this.graph.signals)) {
        this.addLine(info.x_axis, info.y_axis, {
          line_color: this.colors[nextColor],
          line_width: 2,
          line_dash: [1, 0],
          glyph: 'line',
        });
        this.addLine(info.x_axis, info.y_axis, {
          line_color: this.colors[nextColor],
          line_dash: [1, 0],
          glyph: 'circle',
          size: 4,
        });
        nextColor = (nextColor + 1) % this.colors.length;
      }
    },
    addLine(x, y, style) {
      const Glyphs = { line: Bokeh.Line, circle: Bokeh.Circle };
      var options = Object.assign(style);
      options.x = { field: x };
      options.y = { field: y };
      var line = new Glyphs[options.glyph](options);
      this.plot.add_glyph(line, this.source);
    },
    update() {
      const timespan = 5;
      const t = this.signals.time.slice(-1)[0];
      if (t && this.graph.properties.x_auto) {
        this.plot.x_range.start = t - timespan;
        this.plot.x_range.end = t;
      }
      this.source.data = this.signals;
      this.source.change.emit();
      if (this.updating) {
        setTimeout(() => this.update(), this.period);
      }
    },
  },
  async mounted() {
    this.createPlot();
    let doc = new Bokeh.Document();
    doc.add_root(this.plot);
    Bokeh.embed.add_document_standalone(
      doc,
      this.$el.querySelector('.dash-root')
    );
    this.update();
  },
};
</script>
