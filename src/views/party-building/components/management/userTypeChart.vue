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
          data: ['2025-07-01', '2025-07-02', '2025-07-03', '2025-07-04', '2025-07-05', '2025-07-06', '2025-07-07', '2025-07-08']
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
            data: [150, 120, 45, 58, 19, 25, 88, 64]
          }
        ]
      }
      myEcharts.setOption(option)
      this.show = false
    }
  }
}
</script>
