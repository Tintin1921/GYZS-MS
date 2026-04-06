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
import { qualificationRates } from '@/api/charts'
export default {
  props: {
    date: {
      type: Date,
      required: true
    }
  },
  data() {
    return {
      dataObj: {
        'temperature': [],
        'water': []
      },
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
      qualificationRates({ 'date': this.date }).then(res => {
        const { data } = res
        if (data) {
          // 过滤出松散回潮的数据
          const newData = data.filter(item => item.process === '松散')
          // 整理出口温度的数据
          this.dataObj['temperature'] = newData
            .filter(item => item.metricName === '出口温度')
            .reduce((acc, item) => {
              acc.push(item.metricValue)
              return acc
            }, [])
          // 整理出口含水率的数据
          this.dataObj['water'] = newData
            .filter(item => item.metricName === '出口含水率')
            .reduce((acc, item) => {
              acc.push(item.metricValue)
              return acc
            }, [])
          // 渲染图表
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
          bottom: '0%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          data: ['A线松散', 'B线松散', 'C线松散'],
          axisLine: {
            lineStyle: {
              color: '#40e0d0'
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '出口水份合格率',
            position: 'right',
            alignTicks: true,
            show: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#40e0d0'
              }
            },
            axisLabel: {
              formatter: '{value} %'
            },
            splitLine: {
              lineStyle: {
                color: '#40e0d0'
              }
            }
          },
          {
            type: 'value',
            name: '出口温度合格率',
            position: 'left',
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#40e0d0'
              }
            },
            axisLabel: {
              formatter: '{value} %'
            },
            splitLine: {
              lineStyle: {
                color: '#40e0d0'
              }
            }
          }
        ],
        series: [
          {
            name: '出口水份合格率',
            type: 'bar',
            yAxisIndex: 0,
            color: '#82de5b',
            barWidth: 30,
            data: this.dataObj.water
          },
          {
            name: '出口温度合格率',
            type: 'line',
            yAxisIndex: 1,
            color: '#409EEF',
            data: this.dataObj.temperature
          }
        ]

      }
      myEcharts.setOption(option)
      this.show = false
    }
  }
}
</script>
