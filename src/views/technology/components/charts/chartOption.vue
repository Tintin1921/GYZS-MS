<template>
  <div v-loading="loading" class="container" element-loading-text="数据加载中..." style="overflow: auto;height: 50vh">
    <label v-for="(chart) in charts" :key="chart.i">
      <h3 class="chartTitle"><i class="el-icon-s-data" /> {{ chart.title }}</h3>
      <el-radio-group v-model="chart.select" class="buttonGroup">
        <el-radio-button label="实时" />
        <el-radio-button label="历史" />
      </el-radio-group>
      <el-button-group>
        <el-button v-if="chart.select !== '实时'" class="query-btn" type="primary" style="margin-left: .5rem" @click="handleConfirm(chart)">查询</el-button>
        <el-button v-else class="confirm-btn" type="primary" style="margin-left: .5rem" @click="handleSetChart(chart)">预警</el-button>
        <el-button style="margin-left: .1rem" class="delete-btn" default="reference" type="danger" @click="handleDelete(chart)">删除</el-button>
      </el-button-group>
      <!--   显示历史数据 -->
      <div v-if="chart.select === '历史'" style="width: 100%;padding: 5px">
        <div>
          <el-date-picker
            v-model="chart.date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="false"
            @change="handleSelectDate(chart)"
          />
        </div>
        <div style="margin-top: .3rem">
          <selectBrand :brand-option="brandOption" :chart="chart" @selectBrand="handleSelectBrand" />
        </div>
      </div>
      <!--   显示实时数据   -->
      <div v-show="chart.select === '实时'" class="newDate">
        <!-- 实时数据加载 -->
        <el-button v-if="!chart.realData" icon="el-icon-data-line" style="margin-top: 1rem;margin-left: .3rem" class="query-btn" type="primary" @click="handleRealDate(chart)">加载数据</el-button>
        <el-button v-if="chart.realData" icon="el-icon-data-line" style="margin-top: 1rem;margin-left: .3rem" type="danger" @click="handleCloseInterval(chart)">停止加载</el-button>
      </div>
      <br>
      <el-drawer
        title="工艺指标预警配置"
        :visible.sync="showInnerTable"
        direction="rtl"
        size="30%"
        :append-to-body="true"
        :destroy-on-close="true"
      >
        <chartSetting :key="settingData.id" :setting-data="settingData" :quality-standard="qualityStandard" @handleSetQualityStandard="handleSetQualityStandard" />
      </el-drawer>
      <el-divider />
    </label>
  </div>
</template>

<script>
import selectBrand from '@/views/technology/components/charts/selectBrand.vue'
import chartSetting from '@/views/technology/components/charts/chartSetting.vue'
import { getHistoricalData, getBatch, getQualityStandard } from '@/api/technology'
import { formatDate } from '@/utils/formatDate'
import { uniqueBrand } from '@/views/technology/components/analysis/unique'
import {
  setSeries,
  setXAxis,
  setYaxis,
  setGraphic,
  deleteSession,
  setRealData,
  mergeObjects
} from '@/views/technology/components/charts/formatChart'

export default {
  components: {
    selectBrand,
    chartSetting
  },
  props: {
    charts: {
      type: Array,
      required: true
    },
    reset: Boolean
  },
  data() {
    return {
      // 控制页面加载
      loading: false,
      // 配置显示
      showInnerTable: false,
      // 图表ID
      chartID: null,
      // 规格/品牌选项
      brandOption: [],
      // 服务器返回的规格/品牌元数据
      brandOriginData: [],
      // sock服务
      socket: null, // socket连接
      settingData: { id: null },
      // 工艺标准
      qualityStandardOrigin: [], // 筛选前
      qualityStandard: {} // 筛选后
    }
  },
  watch: {
    reset: {
      deep: true,
      handler(val) {
        if (val) {
          this.settingData = { id: null }
          this.qualityStandard = {}
        }
      }
    }
  },
  created() {
    getQualityStandard().then(res => {
      const { data } = res
      this.qualityStandardOrigin = data
    })
  },
  methods: {
    // 用户选择时间段，获取这段时间内所有的牌号
    handleSelectDate(chart) {
      const [startTime, endTime] = chart.date
      getBatch({ 'startTime': formatDate(startTime), 'endTime': formatDate(endTime) }).then(res => {
        this.brandOriginData = res.data
        const segmentName = chart.segment + chart.route + '段'
        const getBrand = res.data.filter(item => {
          if (item.segmentName === segmentName) {
            return item
          }
        })
        this.brandOption = uniqueBrand(getBrand)
      })
    },
    // 用户选择规格/品牌
    handleSelectBrand(val) {
      val.chart.brand = val.newValue
    },
    // 删除对应的表
    handleDelete(chart) {
      // charts表
      const indexChart = this.charts.findIndex(item => item.id === chart.id)
      deleteSession(chart, true)
      delete this.settingData[chart.id]
      delete this.qualityStandard[chart.id]
      this.charts.splice(indexChart, 1)
      this.$message.success('删除成功')
    },
    // 停止加载实时数据
    handleCloseInterval(chart) {
      this.$message.success('已关闭Socket连接')
      delete this.settingData[chart.id]
      delete this.qualityStandard[chart.id]
      deleteSession(chart, true)
    },
    // 用户点击预警
    handleSetChart(chart) {
      this.settingData.id = chart.id
      this.showInnerTable = true
    },
    // 更新预警方法
    handleSetQualityStandard(e) {
      this.qualityStandard = Object.assign(this.qualityStandard, e)
      this.qualityWarning()
    },
    // 用户点击查询历史数据
    handleConfirm(chart) {
      if (chart.date === undefined) {
        this.$message.error('请选择需要查询的时间范围')
        return
      }
      // 判断实时数据是否正在显示，如果在显示则关闭它
      if (chart.realData === true) {
        chart.realData = false
        chart.select = '历史'
        deleteSession(chart, true)
      }
      let date = []
      // 对品牌进行判断 如果没有输入品牌或规格则进入方法1否则2
      if (chart.brand === null || chart.brand === '') {
        const [startTime, endTime] = chart.date
        date = [{ 'startTime': formatDate(startTime), 'endTime': formatDate(endTime) }]
      } else {
        // 按品牌查询
        const segmentName = chart.segment + chart.route + '段'
        this.brandOriginData.filter(item => item.segmentName.includes(segmentName) && item.proName === chart.brand).map(item => {
          date.push({ 'startTime': item.startTime, 'endTime': item.endTime })
        })
      }
      this.getChartData(chart, date, false)
    },
    // 用户点击加载实时数据
    handleRealDate(chart) {
      chart.select = '实时'
      chart.realData = true
      deleteSession(chart, false)
      this.getChartData(chart, [], true)
    },
    // 获取实时数据或历史数据
    getChartData(chart, date, boolean) {
      // 页面加载
      this.loading = true
      const { id } = chart
      const dataPointCodeList = []
      chart.point.map(item => dataPointCodeList.push(item.dataPointCode))
      if (boolean) {
        // 实时数据
        const json = {
          'chartId': id,
          'dataPointCodeList': dataPointCodeList,
          'interval': 2, // 2秒取一个点
          'type': 'CREATE_CHART'
        }
        chart.socket.send(JSON.stringify(json))
        chart.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data).data.map(item => {
              item.dataPointValue = parseFloat(item.dataPointValue).toFixed(2)
              return item
            })
            this.settingData[id] = data
            this.formatResponseData(chart, data)
            this.qualityWarning()
          } catch (error) {
            this.loading = false
            this.$message.error('socket连接存在异常' + error)
          }
        }
        // 获取工艺标准需要先获取实时数据 该方法延迟1.5秒后执行
        setTimeout(() => {
          this.qualityStandard[id] = this.settingData[id].reduce((acc, item) => {
            const [list] = this.qualityStandardOrigin.filter(obj => obj.dataPointCode === item.dataPointCode && obj.proCode === item.proCode)
            if (list) {
              list.switch = false
              list.safeRange = 0.8
              list.dataPointValue = 0
              const difference = (list.upperLimitValue - list.lowerLimitValue) / 2
              const median = list.upperLimitValue - difference
              list.maxRange = (median + difference * list.safeRange).toFixed(2)
              list.minRange = (median - difference * list.safeRange).toFixed(2)
              acc.push(list)
            }
            return acc
          }, [])
        }, 1.5 * 1000)
      } else {
        // 历史数据
        const json = {
          'dataPointCodeList': dataPointCodeList,
          'timeRangeList': date,
          'interval': 360 // 360秒取一个点
        }
        getHistoricalData(json).then(res => {
          const data = res.data.map(item => {
            item.dataPointValue = parseFloat(item.dataPointValue).toFixed(2)
            return item
          })
          this.formatResponseData(chart, data)
        })
      }
    },
    // 处理服务器返回的数据
    async formatResponseData(chart, res) {
      if (res === null) {
        this.$message.error('未查询到有效数据')
        this.loading = false
        return
      }
      const { id, realData } = chart
      const series = setSeries(res)
      const xAxis = setXAxis(series)
      const yAxis = setYaxis(series)
      const graphic = setGraphic(series, chart.realData)
      const chartData = { 'id': id, 'xAxis': xAxis, 'series': series, 'yAxis': yAxis, 'graphic': graphic }
      // 如果是实时数据 则进行数据拼接
      if (realData) {
        setRealData(id, chartData)
      }
      this.loading = false
      this.$emit('handleUpdateChart', chartData)
    },
    qualityWarning() {
      const obj = mergeObjects(this.settingData, this.qualityStandard)
      for (const item in obj) {
        const array = obj[item]
        if (array.length > 0) {
          array.map(e => {
            const { dataPointValue, maxRange, minRange, lowerLimitValue, upperLimitValue, proName, dataPointName } = e
            if (e.switch) {
              // 如果值在最大区间和预警值区间 则预警 如果值大于最大区间则报警
              if (dataPointValue >= maxRange && dataPointValue <= upperLimitValue) {
                const [tmp] = this.charts.filter(name => name.id === item)
                this.$notify.warning({
                  title: '工艺指标上限预警',
                  message: `${tmp.title}<br>${proName}<br>${dataPointName.split('_').pop()}报警<br>当前值：${dataPointValue} 目标值：${upperLimitValue}`,
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-right'
                })
              } else if (dataPointValue <= minRange && dataPointValue >= lowerLimitValue) {
                const [tmp] = this.charts.filter(name => name.id === item)
                this.$notify.warning({
                  title: '工艺指标下限预警',
                  message: `${tmp.title}<br>${proName}<br>${dataPointName.split('_').pop()}报警<br>当前值：${dataPointValue} 目标值：${lowerLimitValue}`,
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-right'
                })
              } else if (dataPointValue > upperLimitValue) {
                const [tmp] = this.charts.filter(name => name.id === item)
                this.$notify.error({
                  title: '工艺指标上限报警',
                  message: `${tmp.title}<br>${proName}<br>${dataPointName.split('_').pop()}报警<br>当前值：${dataPointValue} 目标值：${upperLimitValue}`,
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-right'
                })
              } else if (dataPointValue < lowerLimitValue) {
                const [tmp] = this.charts.filter(name => name.id === item)
                this.$notify.error({
                  title: '工艺指标下限报警',
                  message: `${tmp.title}<br>${proName}<br>${dataPointName.split('_').pop()}报警<br>当前值：${dataPointValue} 目标值：${lowerLimitValue}`,
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-right'
                })
              }
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  background-color: #F2F6FC;
  border: 1px solid #F2F6FC;
}

.chartTitle {
  font-size: 1rem ;
  font-weight: 600;
  padding-left: .1rem;
  margin-left: .5rem;
  margin-bottom: .1rem;
  width: 80%;
  height: 6vh;
  line-height: 6vh;
  border-radius: 4px;
}

.buttonGroup {
  margin-left: .4rem;
}
</style>
