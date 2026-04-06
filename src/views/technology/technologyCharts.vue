<template>
  <div class="app-container container">
    <el-form ref="form" :model="selectData" :rules="rules">
      <el-card class="custom-top-query-card" shadow="hover">
        <div class="card-header">
          <span class="title"><i slot="prefix" class="el-icon-s-fold custom-icon" />制丝工艺数据图表</span>
          <div class="header-actions">
            <el-tooltip content="操作指引">
              <el-button type="text" icon="el-icon-guide" @click.prevent.stop="guide" />
            </el-tooltip>
          </div>
        </div>
        <el-divider />
        <el-row :gutter="24" align="middle" class="query-row">
          <!-- 生产线 -->
          <el-col :span="3.5" class="query-item">
            <el-form-item prop="route">
              <el-tooltip placement="top" content="选择需要查询的生产线">
                <selectRoute id="step1" :reset="reset" @selectRoute="handleSelectRoute" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <!-- 工序 -->
          <el-col :span="3.5" class="query-item">
            <el-form-item prop="segment">
              <el-tooltip placement="top" content="选择需要查询的工序">
                <selectSegment id="step2" :reset="reset" @selectSegment="handleSelectSegment" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <!-- 操作按钮 -->
          <el-col id="step3" :span="8" class="action-btns">
            <el-tooltip placement="top" content="按条件生成图表">
              <el-button
                type="primary"
                icon="el-icon-data-line"
                class="query-btn"
                @click="handleConfirm"
              >
                生成图表
              </el-button>
            </el-tooltip>
            <el-tooltip placement="top" content="配置图表">
              <el-button type="primary" icon="el-icon-setting" class="query-btn" @click="handleSetting">
                配置
              </el-button>
            </el-tooltip>
            <el-tooltip placement="top" content="重置页面">
              <el-button type="info" icon="el-icon-refresh" class="reset-btn" @click="handleReset">
                重 置
              </el-button>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <!-- 图表展示区 -->
    <el-main id="step4" class="dashboard-grid">
      <grid-layout
        class="dashboard-layout"
        :class="{ 'has-charts': charts.length }"
        :layout.sync="charts"
        :col-num="24"
        :row-height="48"
        :is-draggable="true"
        :is-resizable="true"
        :use-css-transforms="true"
        @layout-updated="handleResize"
      >
        <grid-item
          v-for="(chart) in charts"
          :key="chart.i"
          :x="chart.x"
          :y="chart.y"
          :w="chart.w"
          :h="chart.h"
          :i="chart.i"
          class="chart-card"
        >
          <div class="chart-header">
            <span class="title" style="font-size: 24px">{{ chart.title }}</span>
            <div class="actions">
              <i class="el-icon-edit" style="font-size: 20px;vertical-align: middle" @click="handleSetting" />
              <i
                class="el-icon-delete"
                style="font-size: 20px;vertical-align: middle;margin-left: .3rem"
                @click="deleteChart(chart)"
              />
            </div>
          </div>
          <eChart ref="chartComponents" :key="chart.id" :chart="chart" />
        </grid-item>
      </grid-layout>
      <!-- 空状态提示 -->
      <div v-if="!charts.length">
        <i style="font-size: 40px">
          <transition name="fade">
            <div v-if="!charts.length" class="dynamic-guide">
              <div class="guide-content">
                <i class="el-icon-s-operation guide-icon" @click="tips" />
                <h3 class="guide-title">可视化工作台</h3>
                <p class="guide-text">将图表拖拽至此区域开始布局<br>支持自由调整尺寸与位置</p>
                <div class="hotkey-tips">
                  <el-tag size="small">拖拽</el-tag><span style="font-size: 28px">平移画布</span>
                  <el-tag size="small">拖拽</el-tag><span style="font-size: 28px">缩放视图</span>
                </div>
              </div>
            </div>
          </transition>
        </i>
      </div>

      <!-- 图表管理 -->
      <el-drawer title="图表管理" :visible.sync="settingDisplay" direction="rtl" size="32%">
        <chartOption :charts="charts" :reset="reset" @handleUpdateChart="handleUpdateChart" />
      </el-drawer>
    </el-main>

    <!-- 生成图表（自定义名称和选择数据点位） -->
    <el-dialog
      :key="keys"
      title="生成图表"
      :visible.sync="dialogDisplay"
      :destroy-on-close="true"
      width="50%"
    >
      <selectTitleAndPoint :data="selectData" :length="charts.length" @titleAndPoint="handleTitleAndPoint" />
    </el-dialog>
  </div>
</template>

<script>
import { GridLayout, GridItem } from 'vue-grid-layout'
import { generateID } from '@/utils/generateID'
import { deleteSession } from '@/views/technology/components/charts/formatChart'
import eChart from './components/charts/eChart.vue'
import selectTitleAndPoint from '@/views/technology/components/charts/selectTitleAndPoint.vue'
import selectRoute from './components/charts/selectRoute.vue'
import chartOption from '@/views/technology/components/charts/chartOption.vue'
import selectSegment from './components/charts/selectSegment.vue'
import steps from './components/charts/guideStep'
import 'driver.js/dist/driver.min.css'
import Driver from 'driver.js'

export default {
  components: {
    GridLayout,
    GridItem,
    chartOption,
    eChart,
    selectRoute,
    selectSegment,
    selectTitleAndPoint
  },
  data() {
    return {
      // 重置生产线和工序选择
      reset: false,
      // 用户选择的数据
      selectData: {
        route: null,
        segment: null,
        title: null,
        point: []
      },
      keys: null,
      // 表单校验规则
      rules: {
        'route': [{
          required: true, message: '请选择生产线', trigger: 'blur'
        }],
        'segment': [{
          required: true, message: '请选择工序', trigger: 'blur'
        }]
      },
      // 弹窗显示控制
      dialogDisplay: false,
      settingDisplay: false,
      // 存放所有生成的图表
      charts: []
    }
  },
  mounted() {
    // 初始化操作引导实例
    this.driver = new Driver()
  },
  methods: {
    tips() {
      this.$message.success('开始尝试生成图表吧！')
    },
    // 操纵引导
    guide() {
      this.driver.defineSteps(steps)
      this.driver.start()
    },
    // 选择生产线
    handleSelectRoute(route) {
      this.$set(this.selectData, 'route', route)
    },
    // 选择工序
    handleSelectSegment(segment) {
      this.$set(this.selectData, 'segment', segment)
    },
    // 配置图表
    handleSetting() {
      this.settingDisplay = true
    },
    // 重置页面
    handleReset() {
      this.$confirm('确认重置页面吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.charts.map(item => {
          deleteSession(item, true)
        })
        this.layout = []
        this.charts = []
        this.selectData = {}
        this.reset = true
        this.$message.success('重置成功')
      }).catch(() => {
        this.$message.error('用户取消操作')
      })
    },
    // 点击生成图表后方法启动
    handleConfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.keys = generateID()
          this.dialogDisplay = true
        }
      })
    },
    // 获取点位和表名
    handleTitleAndPoint(obj) {
      const { title, point } = obj
      this.$set(this.selectData, 'point', point)
      this.$set(this.selectData, 'title', title)
      this.dialogDisplay = false
      this.setChart() // 开始绘制图表
    },
    // 绘制图表
    setChart() {
      // 创建socket连接
      const socket = new WebSocket('ws://10.113.176.30:8081/gyzs-ms/ws/technology/monitor/realtime-data')
      const { route, point, segment, title } = this.selectData
      const id = generateID()
      const obj = { socket, route, point, segment, title, 'x': 0, 'y': 0, 'w': 16, 'h': 7, 'i': id, 'select': '历史', 'realData': false, 'brand': null, 'id': id, xAxis: [], series: [], yAxis: [], graphic: [] }
      this.charts.push(obj)
      this.$message.success('生成图表成功！')
    },
    deleteChart(chart) {
      this.$confirm('确认删除该图表吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.charts.findIndex(item => item.id === chart.id)
        this.charts.splice(index, 1)
        deleteSession(chart, true)
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.error('用户取消操作')
      })
    },
    // 拖动图表自适应大小
    handleResize() {
      if (this.$refs.chartComponents) {
        this.$nextTick(() => {
          this.$refs.chartComponents.forEach(chart => {
            if (chart && chart.resizeChart) {
              chart.resizeChart()
            }
          })
        })
      }
    },
    // 所有的图表信息都会在此方法接收 用此方法处理实时和非实时数据，此方法可能代码较长，考虑打包为单独的JS方法并引用
    handleUpdateChart(chart) {
      this.charts.forEach(item => {
        if (item.id === chart.id) {
          item.xAxis = chart.xAxis
          item.series = chart.series
          item.yAxis = chart.yAxis
          item.graphic = chart.graphic
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
html, body {
  height: 100%;
  margin: 0;
}

#app {
  height: 100%;
}

.container{
  display: flex;
  flex-direction: column;
  min-height: 95vh; // 确保容器撑满视口
  .dashboard-grid {
    flex: 1;
    min-height: 300px; // 安全高度
    position: relative;
    // 当有图表时的布局优化
    .vue-grid-layout {
      height: calc(100% - 20px); // 保留边距
    }
  }
}

.el-main {
  padding: 20px;
  display: flex;
  flex-direction: column;

  > * {
    flex: 1;
  }
}

/* 图表卡片 */
.chart-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  //transition: all 0.1s ease;
  border: 1px solid #ebeef5;
  touch-action: none;
}

.chart-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.chart-card .chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
}

.chart-card .title {
  font-weight: 600;
  color: #2c3e50;
}

.chart-card .actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.chart-card:hover .chart-header .actions {
  opacity: 1;
}

.chart-card .actions i {
  margin-left: 8px;
  cursor: pointer;
  color: #909399;
  height: 100%;
}

.chart-card .actions i:hover {
  color: #409EFF;
}

.chart-content {
  height: calc(100% - 40px);
  padding: 16px;
}

/* 拖拽区域 */
.dashboard-grid {
  background: repeating-linear-gradient(45deg,
    #f8f9fa,
    #f8f9fa 10px,
    #f0f2f5 10px,
    #f0f2f5 20px);
  min-height: 67vh;
  border-radius: 8px;
  position: relative;
}

.vue-grid-item:not(.chart-card) {
  background: rgba(234, 236, 239, 0.5);
  border: 2px dashed #c0c4cc;
  border-radius: 8px;
}

.dashboard-layout {
  min-height: 63vh;
  border-radius: 8px;
  position: relative;
}

.vue-grid-item:not(.chart-card) {
  background: rgba(234, 236, 239, 0.5);
  border: 2px dashed #c0c4cc;
  border-radius: 8px;
}

/* 无表格时的提示文字 */
.dynamic-guide {
  margin-top: -28rem;
  display: flex;
  justify-content: center;
  z-index: 10;
}

.guide-content {
  text-align: center;
  padding: 40px;
  max-width: 600px;
}

.guide-icon {
  font-size: 48px;
  color: #409EFF;
  margin-bottom: 10px;
  animation: pulse 2s infinite;
}

.guide-title {
  color: #303133;
  margin: 15px 0;
  font-size: 28px;
}

.guide-text {
  color: #606266;
  line-height: 1.8;
  font-size: 16px;
}

.hotkey-tips {
  margin-top: 25px;
}

.hotkey-tips .el-tag {
  margin: 0 5px;
}

/* 网格背景 */
.dashboard-grid.has-charts {
  background:
    linear-gradient(45deg,
      rgba(240, 242, 245, 0.3) 25%,
      transparent 25%,
      transparent 75%,
      rgba(240, 242, 245, 0.3) 75%),
    linear-gradient(45deg,
      rgba(240, 242, 245, 0.3) 25%,
      transparent 25%,
      transparent 75%,
      rgba(240, 242, 245, 0.3) 75%);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
}

.dashboard-grid:not(.has-charts) {
  background: repeating-linear-gradient(-45deg,
    #f0f2f5,
    #f0f2f5 10px,
    #e4e7ed 10px,
    #e4e7ed 20px);
}

/* 动画 */
@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.08);
  }

  100% {
    transform: scale(1);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* 右侧操作容器 */
.right-actions {
  display: flex;
  gap: 16px;
  /* 按钮间距 */
  align-items: center;
  position: relative;
  z-index: 1;
}
</style>
