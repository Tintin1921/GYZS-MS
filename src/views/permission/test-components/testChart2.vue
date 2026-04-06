<template>
  <div style="height: 50vh">
    <div ref="chart" :style="{ width: '100%', height: '100%'}" />
  </div>
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
  },
  methods: {
    initChart() {
      const data1 = [10, 11, 23, 25, 15, 17]
      const data2 = [1210, 1801, 2103, 1104, 1500, 900]
      const maxValue1 = Math.max(...data1)
      const maxValue2 = Math.max(...data2)
      let i = 0
      this.charts = echarts.init(this.$refs.chart)
      const option = {
        title: {
          text: '烘丝A线测试曲线图'
        },
        xAxis: {
          type: 'category',
          data: ['2024-07-15 12:01:10', '2024-07-15 12:01:20', '2024-07-15 12:01:30', '2024-07-15 12:01:40', '2024-07-15 12:01:50', '2024-07-15 12:02:00']
        },
        yAxis: [{
          type: 'value',
          axisLabel: {
            formatter: function() {
              const getLength = data1.length - 1
              if (i++ === getLength) {
                return `出口水分实际值: ${maxValue1}\n` + `瞬时流量实际值: ${maxValue2}\n`
              }
              return ''
            }
          }
        }, {
          type: 'value',
          show: false
        }],
        series: [{
          name: '出口水分实际值',
          type: 'line',
          data: data1,
          yAxisIndex: 0
        },
        {
          name: '瞬时流量实际值',
          type: 'line',
          data: data2,
          yAxisIndex: 1
        }]
      }
      this.charts.setOption(option, true)
    }
  }
}

</script>
