<template>
  <div ref="chartComponents" class="chart" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons')

export default {
  props: {
    chart: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartInstance: null
    }
  },
  watch: {
    'chart': {
      deep: true,
      handler(val) {
        if (val.series.length > 0) {
          this.setOptions(val)
          this.chartInstance.resize()
        }
      }
    }
  },
  mounted() {
    this.chartInstance = echarts.init(this.$el, 'macarons')
    document.addEventListener('contextmenu', this.disableContextMenu, true)
  },
  beforeDestroy() {
    document.removeEventListener('contextmenu', this.disableContextMenu, false)
    if (!this.chartInstance) {
      return
    }
    this.chartInstance.dispose()
    this.chartInstance = null
  },
  methods: {
    disableContextMenu(event) {
      event.preventDefault()
    },
    setOptions({ series, xAxis, yAxis, graphic }) {
      this.chartInstance.setOption({
        xAxis: xAxis,
        yAxis: yAxis,
        series: series,
        graphic: graphic,
        legend: {
          textStyle: {
            color: '#000000'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        dataZoom: [
          {
            type: 'slider',
            start: 0,
            end: 100
          },
          {
            type: 'inside'
          }
        ]
      }, true)
    }
  }
}
</script>

<style scoped>
.chart{
  width: 98%;
  height: 90%;
}
</style>
