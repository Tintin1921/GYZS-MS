<template>
  <div
    ref="myChart"
    v-loading="show"
    element-loading-text="获取数据中"
    element-loading-background="rgba(0,0,0,0.8)"
    style="height: 100%;width: 100%"
  />
</template>

<script>
import * as echarts from 'echarts'

export default {
  data() {
    return {
      show: true
    }
  },
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
        grid: {
          left: '3%',
          right: '3%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          data: ['09:00:00', '10:00:00', '11:00:00', '12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00']
        },
        yAxis: {
          type: 'value',
          name: '访问量'
        },
        series: [
          {
            name: '访问量',
            type: 'line',
            smooth: true,
            data: [10, 15, 1, 0, 8, 1, 0, 6]
          }
        ]
      }
      myEcharts.setOption(option)
      this.show = false
    }
  }
}
</script>
