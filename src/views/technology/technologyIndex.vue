<template>
  <div v-loading="loading" element-loading-text="数据加载中..." class="dashboard-editor-container">
    <panel-group :real-data="realData" @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="dashboardChart" :line="line" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="48" :sm="48" :lg="16">
        <div class="chart-wrapper">
          <transaction-table />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <!-- <div class="chart-wrapper">-->
        <!-- <bar-chart />-->
        <!-- </div>-->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from '../technology/components/index/PanelGroup.vue'
import LineChart from '../technology/components/index/LineChart'
import PieChart from '../technology/components/index/PieChart'
// import BarChart from '../technology/components/index/BarChart'
import TransactionTable from '../technology/components/index/TransactionTable'
import { getHistoricalData } from '@/api/technology'

const dataPointCodeList = ['2327G1F144', '2327G1F146', '2327G1F147', '2327G1F197', '2327G1F194', '2327G1F193', '2327G1F242', '2327G1F244', '2327G1F245']

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    PieChart,
    // BarChart,
    TransactionTable
  },
  data() {
    return {
      socket: null,
      // 图表
      dashboardChart: {
        legend: [],
        series: {},
        xAxis: []
      },
      // 选择显示的生产线
      line: 'A',
      // 是否加载
      loading: true,
      // 历史数据
      historical: [],
      // 实时数据
      realData: []
    }
  },
  created() {
    this.getHistorical()
    this.createSocket()
  },
  mounted() {
    this.getTrendList()
  },
  beforeDestroy() {
    // 关闭socket连接
    this.closeSocket()
    // 清除session
    sessionStorage.removeItem('dashboardChart')
  },
  methods: {
    closeSocket() {
      const json = {
        chartId: 'dashboardChart',
        type: 'REMOVE_CHART'
      }
      this.socket.send(JSON.stringify(json))
    },
    // 初始化socket连接
    createSocket() {
      this.socket = new WebSocket('ws://10.113.176.30:8081/gyzs-ms/ws/technology/monitor/realtime-data')
    },
    getHistorical() {
      // 获取开始时间(往前推15分钟)和当前时间
      const endTime = new Date()
      const startTime = new Date(Date.parse(endTime) - 60000 * 90)
      // 历史数据
      const json = {
        'dataPointCodeList': dataPointCodeList,
        'timeRangeList': [{ 'startTime': startTime, 'endTime': endTime }],
        'interval': 60
      }
      getHistoricalData(json).then(res => {
        const data = res.data.sort((a, b) => Date.parse(a.collectionTime) - Date.parse(b.collectionTime))
        // 保留2位小数
        data.forEach(item => {
          item.dataPointValue = parseFloat(item.dataPointValue).toFixed(2)
          item.collectionTime = item.collectionTime.substring(11, 19)
        })
        this.historical = data
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取烘丝ABC线的流量、水份、温度数据
    getTrendList() {
      const trySocket = () => {
        // 创建socket方法并从服务器获取数据
        if (this.socket.readyState === WebSocket.OPEN) {
          const json = {
            'chartId': 'dashboardChart',
            'dataPointCodeList': dataPointCodeList,
            'interval': 2,
            'type': 'CREATE_CHART'
          }
          this.socket.send(JSON.stringify(json))
          this.socket.onmessage = (event) => {
            try {
              let { data } = JSON.parse(event.data)
              this.realData = data
              // 保留2位小数
              data.forEach(item => {
                item.dataPointValue = parseFloat(item.dataPointValue).toFixed(2)
                item.collectionTime = item.collectionTime.substring(11, 19)
              })
              const lineList = ['A', 'B', 'C']
              // 先尝试从session从获取数据
              let dashboardChart = JSON.parse(sessionStorage.getItem('dashboardChart'))
              console.log(dashboardChart)
              if (dashboardChart === null) {
                dashboardChart = { 'legend': {}, 'xAxis': [], 'series': {}}
                // 获取legend数据（不需要持续更新）
                const legend = { data: [] }
                data.map(item => {
                  legend.data.unshift(item.dataPointName)
                })
                dashboardChart.legend = legend
                // 拼接实时数据和历史数据
                data = (this.historical.concat(data))
                // 获取xAxis数据（需要持续更新）
                data.filter(item => item.dataPointName.includes('A'))
                  .map(item => {
                    dashboardChart.xAxis.push(item.collectionTime)
                  })
                dashboardChart.xAxis = [...new Set(dashboardChart.xAxis)]
                // 获取series数据（需要持续更新）
                for (let i = 0; i < 3; i++) {
                  const line = lineList[i]
                  dashboardChart.series[line] = {}
                  // 过滤出对应线路的数据 但剔除流量数据
                  const list = data.filter(item => item.dataPointName.includes(line) && !item.dataPointName.includes('流量'))
                  list.map(item => {
                    const title = item.dataPointName
                    dashboardChart.series[line][title] = []
                  })
                  list.map(item => {
                    const title = item.dataPointName
                    dashboardChart.series[line][title].push(item.dataPointValue)
                  })
                }
              } else {
                const [obj] = data
                // 我们以xAxis数据长度为界，将数组长度控制在450个点（2秒请求一次 存取2400个点的数据 共80分钟的累计数据量）
                const length = dashboardChart.xAxis.length
                const maxLength = 2400
                if (length > maxLength) {
                  dashboardChart.xAxis.shift()
                }
                // 更新xAxis数据
                dashboardChart.xAxis.push(obj.collectionTime)
                // 更新获取series数据数据
                for (let i = 0; i < 3; i++) {
                  const line = lineList[i]
                  const list = data.filter(item => item.dataPointName.includes(line) && !item.dataPointName.includes('流量'))
                  list.map(item => {
                    const title = item.dataPointName
                    if (length > maxLength) {
                      dashboardChart.series[line][title].shift()
                    }
                    dashboardChart.series[line][title].push(item.dataPointValue)
                  })
                }
              }
              // 存入session
              sessionStorage.setItem('dashboardChart', JSON.stringify(dashboardChart))
              this.dashboardChart = dashboardChart
              this.loading = false
            } catch (err) {
              this.$message.error('无法与服务器取得联系' + err)
            }
          }
        } else {
          setTimeout(trySocket, 1000)
        }
      }
      trySocket()
    },
    handleSetLineChartData(type) {
      this.line = type
      this.$message.success(`切换显示${type}线`)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 12px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
