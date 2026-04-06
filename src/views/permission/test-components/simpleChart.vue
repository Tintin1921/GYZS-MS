<template>
  <div ref="chartComponents" :style="{ width: '100%', height: '100%'}" />
</template>

<script>
import * as echarts from 'echarts'

export default {
  data() {
    return {
      charts: null
    }
  },
  mounted() {
    this.initChart()
    this.$nextTick(() => {
      this.resizeChart()
    })
  },
  methods: {
    initChart() {
      this.charts = echarts.init(this.$refs.chartComponents)
      const option = {
        title: {
          text: '烘丝A线测试曲线图',
          textStyle: {
            color: '#3888fa'
          }
        },
        xAxis: {
          type: 'category',
          data: ['2024-07-15 12:01:10', '2024-07-15 12:01:20', '2024-07-15 12:01:30', '2024-07-15 12:01:40', '2024-07-15 12:01:50']
        },
        yAxis: [{
          type: 'value',
          name: 'Y轴',
          show: true
        }],
        series: [{
          name: '出口水分实际值',
          smooth: true,
          type: 'line',
          data: [10, 11, 23, 14, 15]
        }],
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
      }
      this.charts.setOption(option, true)
    },
    resizeChart() {
      if (this.charts) {
        this.charts.resize()
      }
    }
  }
}

</script>
