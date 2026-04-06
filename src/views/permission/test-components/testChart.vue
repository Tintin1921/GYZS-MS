<template>
  <div style="height: 50vh">
    <div ref="chart" :style="{ width: '100%', height: '100%'}" />
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default  {
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
      this.charts = echarts.init(this.$refs.chart)
      const option = {
        title: {
          text: '烘丝A线测试曲线图',
          textStyle: {
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        legend: {
          data: ['出口水分实际值', '瞬时流量实际值'],
          top: 30
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.8)',
          borderColor: '#ccc',
          borderWith: 1,
          textStyle: {
            color: '#000'
          }
        },
        xAxis: {
          type: 'category',
          data: ['2024-07-15 12:01:10', '2024-07-15 12:01:20', '2024-07-15 12:01:30', '2024-07-15 12:01:40', '2024-07-15 12:01:50'],
          axisLine: {
            lineStyle: {
              lineStyle: {
                color: '#ccc'
              }
            }
          },
          axisLabel: {
            color: '#000'
          }
        },
        yAxis: [{
          type: 'value',
          name: 'Y轴1',
          max: 25,
          show: false,
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          },
          axisLabel: {
            formatter: '{value}',
            color: '#000'
          },
          splitLine: {
            lineStyle: {
              color: '#eee'
            }
          }
        }, {
          type: 'value',
          name: 'Y轴2',
          max: 2500,
          show: false,
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          },
          axisLabel: {
            formatter: '{value}',
            color: '#000'
          },
          splitLine: {
            lineStyle: {
              color: '#eee'
            }
          }
        }],
        series: [{
          name: '出口水分实际值',
          smooth: true,
          type: 'line',
          data: [10, 11, 23, 14, 15],
          animationEasing: 'cubicInOut',
          animationDuration: 2800,
          yAxisIndex: 0,
          lineStyle: {
            width: 2
          },
          areaStyle: {
            opacity: 0.1,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'green' },
              { offset: 1, color: 'blue' }
            ])
          }
        },
        {
          name: '瞬时流量实际值',
          smooth: true,
          type: 'line',
          data: [1000, 1001, 2103, 1104, 1500],
          animationEasing: 'cubicInOut',
          animationDuration: 2800,
          yAxisIndex: 1
        }],
        graphic: [{
          type: 'text',
          left: '85%',
          top: `${40}px`,
          style: {
            text: '出口水分实际值上限:' + '10',
            fill: '#000',
            font: 'bold 14px sans-serif'
          },
          onclick: () => {
            console.log('test')
          }
        },
        {
          type: 'text',
          left: '85%',
          top: `${60}px`,
          style: {
            text: '瞬时流量实际值上限:' + '3000',
            fill: '#000',
            font: 'bold 14px sans-serif'
          }
        }]
      }
      this.charts.setOption(option, true)
    }
  }
}

</script>
