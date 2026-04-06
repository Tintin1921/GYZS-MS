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
import { accuracyAverages } from '@/api/charts'

export default {
  props: {
    date: {
      type: Date,
      required: true
    },
    state: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dataObj: {},
      newDate: null,
      show: true
    }
  },
  watch: {
    'date': {
      handler() {
        this.show = true
        this.getInfo()
      }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      accuracyAverages({ 'date': this.date }).then(res => {
        const { data } = res
        if (data) {
          const newData = data.filter(item => item.process === this.state)
          // 过滤出日期（X轴坐标）
          this.dataObj['date'] = [...new Set(newData.reduce((acc, item) => {
            acc.push(item.date)
            return acc
          }, []))]
          // 过滤出A线数据
          this.dataObj['lineA'] = newData
            .filter(item => item.productionLine === 'A')
            .reduce((acc, item) => {
              acc.push(item.metricValue)
              return acc
            }, [])
          // 过滤出C线数据
          this.dataObj['lineC'] = newData
            .filter(item => item.productionLine === 'C')
            .reduce((acc, item) => {
              acc.push(item.metricValue)
              return acc
            }, [])
          this.setCav()
        }
      })
    },
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
          right: '3%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          data: this.dataObj.date,
          axisLine: {
            lineStyle: {
              color: '#40e0d0'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: this.state + '精度',
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
        series: [
          {
            name: `A线${this.state}精度`,
            type: 'line',
            smooth: true,
            data: this.dataObj.lineA,
            color: '#67C23A'
          },
          {
            name: `C线${this.state}精度`,
            type: 'line',
            smooth: true,
            data: this.dataObj.lineC,
            color: '#67C23A'
          }
        ]
      }
      myEcharts.setOption(option)
      this.show = false
    }
  }
}
</script>
