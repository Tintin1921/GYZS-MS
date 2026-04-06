<template>
  <div :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons')
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    line: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        // 按选择的路线筛选数据
        for (const key in val.series) {
          if (key === this.line) {
            val.series = val.series[key]
            return
          }
        }
        val.legend.data.filter(item => item.includes(this.line))
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ legend, series, xAxis } = {}) {
      this.chart.setOption({
        xAxis: {
          data: xAxis,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 0,
          right: 25,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          type: 'value',
          min: (value) => Math.floor(value.min * 0.05),
          max: (value) => Math.ceil(value.max * 1.1),
          axisTick: {
            show: false
          }
        },
        legend: {
          data: legend.data
        },
        series: [{
          name: Object.keys(series)[0], itemStyle: {
            normal: {
              lineStyle: {
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: Object.values(series)[0],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: Object.keys(series)[1],
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              lineStyle: {
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: Object.values(series)[1],
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}
</script>
