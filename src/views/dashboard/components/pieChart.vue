<template>
  <el-row
    v-loading="show"
    element-loading-text="获取数据中"
    element-loading-background="rgba(0,0,0,0.8)"
    style="height: 100%;margin-top: 5px;"
  >
    <el-col :span="12" style="height: 100%;">
      <div ref="myChart2" style="height: 100%;width: 100%;" />
    </el-col>
    <el-col :span="12" style="height: 100%;">
      <div ref="myChart3" style="height: 100%;width: 100%;" />
    </el-col>
  </el-row>
</template>

<script>
import * as echarts from 'echarts'
import { dailyCompletionStatus } from '@/api/charts'

export default {
  props: {
    date: {
      type: Date,
      required: true
    }
  },
  data() {
    return {
      jxWc: 10,
      jxWwc: 5,
      dgWc: 6,
      dgWwc: 5,
      show: true
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      this.setCav1()
      this.setCav2()
      this.show = false
    },
    setCav1() {
      const chartDom = this.$refs.myChart2
      const myChart = echarts.init(chartDom)
      var option = {
        title: {
          text: '机修班',
          textStyle: {
            fontSize: 15,
            color: '#40e0d0'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        series: {
          name: '机修班',
          type: 'pie',
          radius: ['40%', '70%'],
          label: {
            color: '#fff',
            position: 'inside'
          },
          data: [
            { value: this.jxWwc, name: '已完成工单', itemStyle: { normal: { color: '#82de5b' }}},
            { value: this.jxWc, name: '未完成工单', itemStyle: { normal: { color: '#409EEF' }}}
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0,0,0,0.5)'
            }
          }
        }
      }
      option && myChart.setOption(option)
    },
    setCav2() {
      const chartDom = this.$refs.myChart3
      const myChart = echarts.init(chartDom)
      // 设置数据
      var option = {
        title: {
          text: '电工班',
          textStyle: {
            fontSize: 15,
            color: '#82de5b'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        series: {
          name: '电工班',
          type: 'pie',
          radius: ['40%', '70%'],
          label: {
            color: '#fff',
            position: 'inside'
          },
          data: [
            { value: this.dgWwc, name: '已完成工单', itemStyle: { normal: { color: '#82de5b' }}},
            { value: this.dgWc, name: '未完成工单', itemStyle: { normal: { color: '#409EEF' }}}
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0,0,0,0.5)'
            }
          }
        }
      }
      option && myChart.setOption(option)
    }
  }
}
</script>

