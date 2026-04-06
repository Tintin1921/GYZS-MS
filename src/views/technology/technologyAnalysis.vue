<template>
  <div class="app-container">
    <el-form ref="form" :model="selectData" :rules="rules">
      <el-card class="custom-top-query-card" shadow="hover">
        <div class="card-header">
          <span class="title"><i slot="prefix" class="el-icon-s-fold custom-icon" />制丝工艺数据查询与分析</span>
          <div class="header-actions">
            <el-tooltip content="操作指引">
              <el-button type="text" icon="el-icon-guide" @click.prevent.stop="guide" />
            </el-tooltip>
          </div>
        </div>
        <el-divider />
        <el-row :gutter="24" align="middle" class="query-row">
          <!-- 日期选择 -->
          <el-col :span="5" class="query-item">
            <el-form-item id="step1" prop="date">
              <el-tooltip placement="top" content="选择需要查询批次的时间范围">
                <el-date-picker
                  v-model="selectData.date"
                  v-loading="dateLoading"
                  type="datetimerange"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  style="width: 100%;"
                  :clearable="false"
                  @change="handleSelectDate"
                />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <!-- 生产线 -->
          <el-col :span="3.5" class="query-item">
            <el-form-item prop="route">
              <el-tooltip placement="top" content="选择需要查询的生产线">
                <el-select
                  id="step2"
                  v-model="selectData.route"
                  placeholder="请选择生产线"
                  filterable
                  :disabled="disableSelectRoute"
                  @change="handleSelectRoute"
                >
                  <el-option
                    v-for="item in tableOptionData.route"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <!-- 工序 -->
          <el-col :span="3.5" class="query-item">
            <el-form-item prop="segment">
              <el-tooltip placement="top" content="选择需要查询的工序">
                <el-select
                  id="step3"
                  v-model="selectData.segment"
                  placeholder="请选择工序"
                  filterable
                  clearable
                  :disabled="disableSelectSegment"
                  @change="handleSelectSegment"
                >
                  <el-option
                    v-for="item in tableOptionData.segment"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <!-- 规格品牌 -->
          <el-col :span="3.5" class="query-item">
            <el-form-item prop="brand">
              <el-tooltip placement="top" content="选择需要查询的品牌/规格">
                <el-select
                  id="step4"
                  v-model="selectData.brand"
                  placeholder="请选择规格/品牌"
                  filterable
                  clearable
                  :disabled="disableSelectBrand"
                  @change="handleSelectBrand"
                >
                  <el-option
                    v-for="item in tableOptionData.brand"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <!-- 操作按钮 -->
          <el-col id="step5" :span="8.5">
            <el-tooltip placement="top" content="提交查询">
              <el-button
                type="primary"
                icon="el-icon-search"
                class="query-btn"
                :loading="loading"
                :disabled="loading"
                @click="handleConfirm"
              >
                查 询
              </el-button>
            </el-tooltip>
            <el-tooltip placement="top" content="重置页面">
              <el-button
                type="info"
                icon="el-icon-refresh"
                class="reset-btn"
                @click="handleReset"
              >
                重 置
              </el-button>
            </el-tooltip>

          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <div id="step6" v-loading="loading" element-loading-text="数据加载中...">
      <analysisTable :child-data="childData" />
    </div>
  </div>
</template>

<script>
import analysisTable from '@/views/technology/components/analysis/analysisTable.vue'
import { uniqueRoute, uniqueProcess, uniqueBrand } from '@/views/technology/components/analysis/unique'
import { formatDate } from '@/utils/formatDate'
import { getProductData, getQualityLevelEvaluate } from '@/api/technology'
import steps from './components/analysis/guideStep'
import 'driver.js/dist/driver.min.css'
import Driver from 'driver.js'

export default {
  components: {
    analysisTable
  },
  data() {
    return {
      // 原始数据和临时数据
      originData: [],
      tempData: [],
      // 控制页面加载
      loading: false,
      dateLoading: false,
      // 传入子组件的数据
      childData: {},
      // 用户选择的数据
      selectData: {
        date: null,
        route: null,
        segment: null,
        brand: null
      },
      // 所有下拉框的动态选项
      tableOptionData: {},
      // 表单校验规则
      rules: {
        'date': [{
          required: true, message: '请选择时间范围', trigger: 'blur'
        }],
        'route': [{
          required: true, message: '请选择生产线', trigger: 'blur'
        }],
        'segment': [{
          required: true, message: '请选择工序', trigger: 'blur'
        }],
        'brand': [{
          required: true, message: '请选择规格/品牌', trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    disableSelectRoute() {
      let boolean
      this.tableOptionData.route && !this.dateLoading ? boolean = false : boolean = true
      return boolean
    },
    disableSelectSegment() {
      let boolean
      this.selectData.route ? boolean = false : boolean = true
      return boolean
    },
    disableSelectBrand() {
      let boolean
      this.selectData.segment ? boolean = false : boolean = true
      return boolean
    }
  },
  mounted() {
    // 初始化操作引导实例
    this.driver = new Driver()
  },
  methods: {
    // 操纵引导
    guide() {
      this.driver.defineSteps(steps)
      this.driver.start()
    },
    handleSelectDate() {
      this.dateLoading = true
      const data = this.selectData
      const [startTime, endTime] = data.date
      getProductData({ 'startTime': formatDate(startTime), 'endTime': formatDate(endTime) }).then(res => {
        const { data } = res
        if (data === null) {
          setTimeout(() => {
            this.dateLoading = false
            this.$message.error('查询结果为空')
          }, 1000)
          return
        }
        // 存入元数据
        this.originData = data
        this.tempData = data
        // 清空选项
        const keys = ['route', 'segment', 'brand']
        const boolean = this.checkObject(keys)
        if (boolean) {
          // keys.forEach(item => this.selectData[item] = null)
          keys.forEach(function(item) {
            this.selectData[item] = null
          }.bind(this))
        }
        setTimeout(() => {
          // 组合出所有的生产线选项
          this.$set(this.tableOptionData, 'route', uniqueRoute(data).sort((a, b) => a.value.localeCompare(b.value)))
          this.dateLoading = false
        }, 1000)
      })
    },
    handleSelectRoute() {
      // 清空选项
      const keys = ['segment', 'brand']
      const boolean = this.checkObject(keys)
      if (boolean) {
        keys.forEach(function(item) {
          this.selectData[item] = null
        }.bind(this))
      }
      // 从元数据中过滤出所选生产线的数据
      this.tempData = this.originData.filter(item => item.segmentName.includes(this.selectData.route))
      // 组合出该生产线所有的工序
      this.$set(this.tableOptionData, 'segment', uniqueProcess(this.tempData))
    },
    handleSelectSegment() {
      // 清空选项
      const keys = ['brand']
      const boolean = this.checkObject(keys)
      if (boolean) {
        keys.forEach(function(item) {
          this.selectData[item] = null
        }.bind(this))
      }
      // 从元数据中过滤出所选工序的数据
      this.tempData = this.originData.filter(item => item.segmentName.includes(this.selectData.route) && item.segmentName === this.selectData.segment)
      // 组合出该生产线所有的工序
      this.$set(this.tableOptionData, 'brand', uniqueBrand(this.tempData).sort())
    },
    handleSelectBrand() {
      this.tempData = this.originData.filter(item => item.segmentName.includes(this.selectData.route) && item.segmentName === this.selectData.segment && item.proName === this.selectData.brand)
    },
    handleConfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const [obj] = this.tempData
          const [startTime, endTime] = this.selectData.date
          getQualityLevelEvaluate({ 'proCode': obj.proCode, 'startTime': formatDate(startTime), 'endTime': formatDate(endTime), 'segmentCode': obj.segmentCode }).then(res => {
            if (res.data === null) {
              this.$message.error('查询为空')
              this.loading = false
              return
            }
            // 格式化数据
            const data = res.data
            const [obj] = res.data
            const route = obj.batchNo.slice(-1)
            let fixedOrder = []
            // 这里进行固定排序
            if (route === 'B') {
              fixedOrder = ['出口含水率', '出口温度', '工艺气温度']
            } else {
              fixedOrder = ['入口物料含水率', '流量', '出口含水率', '筒壁温度']
            }
            const orderMap = {}
            fixedOrder.forEach((value, index) => {
              orderMap[value] = index
            })
            data.sort((a, b) => {
              const indexA = orderMap[a.parameterName]
              const indexB = orderMap[b.parameterName]
              return indexA - indexB
            }).map(item => {
              item.parameterName = item.parameterName + ' ' + item.qualityMetricName
              return item
            })
            // 这里处理一下各项指标
            data.forEach(obj => {
              const list = ['qualityMetricScore', 'qualityMetricScoreInSegment', 'qualityMetricValue']
              list.map(item => {
                const num = parseFloat(obj[item])
                obj[item] = num.toFixed(2)
              })
            })
            // 获取所有indexName
            const indexName = [...new Set(data.map(item => item.parameterName))]
            // 用来存放格式化后数据的容器
            const transformedData = this.transformData(data)
            const paginationData = {
              total: transformedData.length,
              page: 1,
              limit: 10,
              data: transformedData,
              indexName: indexName
            }
            setTimeout(() => {
              this.childData = Object.assign({}, this.childData, paginationData)
              this.loading = false
              this.$message.success('查询成功')
            }, 1500)
          })
        }
      })
    },
    handleReset() {
      this.$confirm('确认重置页面吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (const item in this.selectData) {
          this.selectData[item] = null
        }
        this.childData = { 'reset': true }
        this.$message.success('操作成功')
        this.$message.success('重置成功')
      }).catch(() => {
        this.$message.error('用户取消操作')
      })
    },
    checkObject(keys) {
      const obj = this.selectData
      return keys.some(key => {
        const value = obj[key]
        return !(value === null || value === undefined)
      })
    },
    // 按格式调整服务器返回数据
    transformData(data) {
      const result = []
      const groupedData = data.reduce((acc, item) => {
        if (!acc[item.batchNo]) {
          acc[item.batchNo] = []
        }
        acc[item.batchNo].push(item)
        return acc
      }, {})
      let index = 1
      for (const batchNo in groupedData) {
        const items = groupedData[batchNo]
        const firstItem = items[0]
        const totalSegmentMark = items.reduce((sum, item) => sum + parseFloat(item.qualityMetricScoreInSegment), 0).toFixed(2)
        // 初始化 transformedObject
        const transformedObject = {
          batchNo: batchNo,
          index: index++,
          segmentMark: totalSegmentMark,
          proName: firstItem.proName,
          segment: firstItem.segmentName,
          startTime: firstItem.startTime,
          endTime: firstItem.endTime
        }
        items.forEach(item => {
          transformedObject[`${item.parameterName}qualityMetricScore`] = item.qualityMetricScore
          transformedObject[`${item.parameterName}qualityMetricScoreInSegment`] = item.qualityMetricScoreInSegment
          transformedObject[`${item.parameterName}qualityMetricValue`] = item.qualityMetricValue
        })
        result.push(transformedObject)
      }
      return result
    }
  }
}
</script>
