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

// 1.引用echarts
import * as echarts from 'echarts'
import { processBatchStatus } from '@/api/charts'

export default {
  props: {
    date: {
      type: Date,
      required: true
    }
  },
  data() {
    return {
      data1: [],
      data2: [],
      data3: [],
      data4: [],
      data5: [],
      data6: [],
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
      processBatchStatus({ 'date': this.date }).then(res => {
        const { data } = res
        if (data) {
          for (var i = 0; i < res.data.length; i++) {
            data[i].productionLine == 'A' ? this.data1.push(data[i].finishedCount) & this.data2.push(data[i].unfinishedCount) : []
            data[i].productionLine == 'B' ? this.data3.push(data[i].finishedCount) & this.data4.push(data[i].unfinishedCount) : []
            data[i].productionLine == 'C' ? this.data5.push(data[i].finishedCount) & this.data6.push(data[i].unfinishedCount) : []
          }
          this.setCav()
        }
      })
    },
    setCav() {
      const myChart = echarts.init(this.$refs.myChart)
      const xAxisData = ['松散', '加料', '烘掺', '加香']
      const data1 = this.data1
      const data2 = this.data2
      const data3 = this.data3
      const data4 = this.data4
      const data5 = this.data5
      const data6 = this.data6
      var emphasisStyle = {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0,0,0,0.3)'
        }
      }
      var option = {
        legend: {
          data: ['A线生产批次', 'B线生产批次', 'C线生产批次', 'A线未完成批次', 'B线未完成批次', 'C线未完成批次'],
          top: '5%',
          textStyle: {
            fontSize: 11,
            color: '#67C23A'
          }
        },
        toolbox: {
          feature: {
            dataView: {
              show: false
            }
          }
        },
        xAxis: {
          data: xAxisData,
          splitLine: { show: false },
          splitArea: { show: false },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#82de5b'
            }
          }
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: '#82de5b'
            }
          }
        },
        grid: {
          bottom: 30
        },
        graphic: {
          type: 'text',
          left: '92%',
          top: `${40}px`,
          style: {
            text: '详情',
            fill: '#82de5b',
            font: 'bold 14px sans-serif'
          },
          onclick: () => {
            this.$emit('clickBarChart', true)
          }
        },
        series: [
          {
            name: 'A线生产批次',
            type: 'bar',
            stack: 'one',
            color: '#82de5b',
            emphasis: emphasisStyle,
            data: data1
          },
          {
            name: 'A线未完成批次',
            type: 'bar',
            stack: 'one',
            color: '#409EEF',
            emphasis: emphasisStyle,
            data: data2
          },
          {
            name: 'B线生产批次',
            type: 'bar',
            stack: 'two',
            color: '#82de5b',
            emphasis: emphasisStyle,
            data: data3
          },
          {
            name: 'B线未完成批次',
            type: 'bar',
            stack: 'two',
            color: '#409EEF',
            emphasis: emphasisStyle,
            data: data4
          },
          {
            name: 'C线生产批次',
            type: 'bar',
            stack: 'three',
            color: '#409EEF',
            emphasis: emphasisStyle,
            data: data5
          },
          {
            name: 'C线未完成批次',
            type: 'bar',
            stack: 'three',
            color: '#409EEF',
            emphasis: emphasisStyle,
            data: data6
          }
        ]
      }
      myChart.on('brushSelected', function(params) {
        var brushed = []
        var brushComponent = params.batch[0]
        for (var sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
          var rawIndices = brushComponent.selected[sIdx].dataIndex
          brushed.push('[Series ' + sIdx + '] ' + rawIndices.join(', '))
        }
        myChart.setOption({
          title: {
            backgroundColor: '#333',
            text: 'SELECTED DATA INDICES: \n' + brushed.join('\n'),
            bottom: 0,
            right: '10%',
            width: 100,
            textStyle: {
              fontSize: 12,
              color: '#fff'
            }
          }
        })
      })
      myChart.setOption(option)
      this.show = false
    }
  }
}

</script>
