<template>
  <div v-loading="loading" element-loading-text="数据加载中..." style="height: 350px">
    <div ref="chartData" style="height: 350px" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getHistoricalData } from '@/api/technology'
import { setSeries, setYaxis } from '@/views/technology/components/charts/formatChart'
require('echarts/theme/macarons')

export default {
  props: {
    chartInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      chart: null,
      collectionTime: [],
      dataPointName: [],
      series: [],
      yAxis: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    dateAdd(dateStr, minutes, method) {
      const date = new Date(dateStr)
      if (method === '+') {
        date.setMinutes(date.getMinutes() + minutes)
      } else {
        date.setMinutes(date.getMinutes() - minutes)
      }
      const pad = n => n.toString().padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` + ' ' + `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chartData, 'macarons')
      // 在这里暂时将获取的点位固定 不让用户选择
      const route = this.chartInfo.batchNo.slice(-1)
      let dataPointCodeList = []
      switch (route) {
        case 'A':
          dataPointCodeList = ['2327G1F143', '2327G1F144', '2327G1F146', '2327G1F153']
          break
        case 'B':
          dataPointCodeList = ['2327G1F194', '2327G1F193', '2327G1F195']
          break
        case 'C':
          dataPointCodeList = ['2327G1F241', '2327G1F242', '2327G1F244', '2327G1F251']
      }
      const { startTime, endTime } = this.chartInfo
      const json = {
        'dataPointCodeList': dataPointCodeList,
        'timeRangeList': [{ 'startTime': this.dateAdd(startTime, 10, '-'), 'endTime': this.dateAdd(endTime, 10, '+') }],
        'interval': 240
      }
      getHistoricalData(json).then(res => {
        const data = res.data.map(item => {
          item.dataPointValue = parseFloat(item.dataPointValue).toFixed(2)
          return item
        })
        this.collectionTime = [...new Set(data.map(item => item.collectionTime))]
        this.dataPointName = [...new Set(data.map(item => item.dataPointName.split('_').pop()))]
        // const grouped = data.reduce((acc, obj) => {
        //   const key = obj.dataPointName
        //   if (!acc[key]) acc[key] = []
        //   acc[key].push(obj.dataPointValue)
        //   return acc
        // }, {})
        // const series = Object.entries(grouped).map(([key, value]) => ({
        //   key: key,
        //   value: value
        // }))
        // series.map(item => {
        //   const obj = {
        //     name: item.key,
        //     type: 'line',
        //     data: item.value,
        //     animationEasing: 'cubicInOut'
        //   }
        //   this.series.push(obj)
        // })
        this.series = setSeries(data)
        this.yAxis = setYaxis(this.series)
        this.setOptions()
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    setOptions() {
      this.chart.setOption({
        xAxis: {
          data: this.collectionTime,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: this.yAxis,
        legend: {
          data: this.dataPointName
        },
        series: this.series
      })
    }
  }
}
</script>
