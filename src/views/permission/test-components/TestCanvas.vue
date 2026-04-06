<template>
  <div>
    <grid-layout
      :layout.sync="layout"
      :col-num="12"
      :row-height="24"
      :is-draggable="true"
      :is-resizable="true"
      :vertical-compact="true"
      :use-css-transforms="true"
      @layout-updated="handleLayoutChange"
    >
      <grid-item
        v-for="item in layout"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        class="draggable-item"
      >
        <simpleChart :id="item.i" ref="chartComponents" />
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import { GridLayout, GridItem } from 'vue-grid-layout'
import simpleChart from './simpleChart.vue'

export default {
  components: {
    GridLayout,
    GridItem,
    simpleChart
  },
  props: {
    layout: {
      type: Array,
      required: true
    }
  },
  methods: {
    handleLayoutChange() {
      if (this.$refs.chartComponents) {
        this.$nextTick(() => {
          this.$refs.chartComponents.forEach(chart => {
            if (chart && chart.resizeChart) {
              chart.resizeChart()
            }
          })
        })
      }
    }
  }
}
</script>

<style scoped>

.draggable-item {
    touch-action: none;
  }

.vue-grid-layout {
    background: #fff;
}

.vue-grid-item:not(.vue-grid-placeholder) {
    border-radius: .1rem;
    background: #fff;
    border: 1px solid #3888fa;
}

</style>
