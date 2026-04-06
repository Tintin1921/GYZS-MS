<template>
  <div ref="radarChart" v-loading="show" element-loading-text="获取数据中" element-loading-background="rgba(0,0,0,0.8)" style="height: 100%;width: 100%;" />
</template>

<script>
import * as echarts from 'echarts'

export default {
  props: {
    date: {
      type: Date,
      required: true
    }
  },
  data() {
    return {
      arrMax: 0,
      arr: [],
      show: true
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      setTimeout(() => {
        this.setCav()
      }, 2500)
    },
    setCav() {
      var chartDom = this.$refs.radarChart
      var myChart = echarts.init(chartDom)
      var option
      option = {
        radar: {
          indicator: [
            { name: '操作', max: 200 },
            { name: '设备', max: 90 },
            { name: '工艺', max: 15 },
            { name: '安全', max: 20 },
            { name: '综合', max: 20 },
            { name: '管理', max: 30 }
          ],
          splitArea: {
            areaStyle: {
              color: ['#82de5b']
            }
          }
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            itemStyle: {
              color: '#409EEF'
            },
            data: [
              {
                value: [120, 78, 12, 15, 20, 19, 35],
                areaStyle: {
                  color: '#409EEF'
                }
              }
            ]
          }
        ]
      }
      option && myChart.setOption(option)
      this.show = false
    }
  }
}
</script>
