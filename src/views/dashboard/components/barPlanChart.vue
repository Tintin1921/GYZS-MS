<template>
  <div ref="myChart" style="height: 100%;width: 100%;" />
</template>

<script>
import * as echarts from 'echarts'

export default {
  mounted() {
    this.setCav()
  },
  methods: {
    setCav() {
      const myEcharts = echarts.init(this.$refs.myChart)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          textStyle: {
            color: '#40e0d0'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#40e0d0'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#40e0d0'
            }
          }
        },
        yAxis: {
          data: ['C线', 'B线', 'A线'],
          axisLine: {
            lineStyle: {
              color: '#40e0d0'
            }
          }
        },
        series: [
          {
            name: 'MES排产量（组）',
            type: 'bar',
            color: '#409EEF',
            data: [3, 7, 6]
          },
          {
            name: '制丝集控排产量（组）',
            type: 'bar',
            color: '#82de5b',
            data: [7, 10, 14]
          }
        ]
      }
      myEcharts.setOption(option)
    }
  }
}
</script>
