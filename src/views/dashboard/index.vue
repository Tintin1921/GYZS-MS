<template>
  <div class="dashboard-container">
    <!-- 粒子背景容器 -->
    <div id="particles-js" />
    <!-- 顶部标题栏 -->
    <div class="header">
      <div class="title">贵阳卷烟厂制丝车间信息化平台</div>
      <div class="time-info">
        <el-date-picker
          v-model="date"
          type="date"
          size="mini"
          style=" width: 70%;"
          @change="handleChangeDate"
        />
        <div class="current-time">{{ time }}</div>
      </div>
    </div>
    <!-- 主体内容 -->
    <div class="main-content">
      <!-- 左侧面板 -->
      <div class="left-right-panel">
        <div class="panel">
          <div class="panel-title">松散回潮工序指标合格率</div>
          <div class="double-chart">
            <div class="chart-container">
              <groupChart :date="date" />
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-title">筛分加料精度平均值</div>
          <div class="double-chart">
            <div class="chart-container">
              <accGroupChart :date="date" state="加料" />
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-title">加香精度平均值</div>
          <div class="double-chart">
            <div class="chart-container">
              <accGroupChart :date="date" state="加香" />
            </div>
          </div>
        </div>
      </div>
      <!-- 中间面板 -->
      <div class="center-panel">
        <div class="panel">
          <div class="panel-title">生产概况</div>
          <div class="production-cards">
            <div class="production-card">
              <div class="production-label">当班计划产量(kg)</div>
              <div class="production-value">{{ totalPlanDemand }}</div>
            </div>
            <div class="production-card">
              <div class="production-label">当班实际产量(kg)</div>
              <div class="production-value">{{ totalActualOutPut }}</div>
            </div>
          </div>
        </div>
        <div>
          <div style="height: 30rem">
            <barPlanChart />
          </div>
        </div>
        <div class="panel">
          <div class="panel-title">MES公告栏</div>
          <div class="notice-board">
            <div v-for="(notice, index) in notices" :key="index" class="notice-item">
              {{ notice }}
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧面板 -->
      <div class="left-right-panel">
        <div class="panel">
          <div class="panel-title">各工序生产情况</div>
          <div class="double-chart">
            <div class="chart-container">
              <bar-chart :date="date" @clickBarChart="clickBarChart" />
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-title">机电修维保工单完成率</div>
          <div class="double-chart">
            <div class="chart-container">
              <pieChart :date="date" />
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-title">车间人员构成</div>
          <div class="double-chart">
            <div class="chart-container">
              <radarChart :date="date" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="详细信息"
      :visible.sync="showBarChart"
      :destroy-on-close="true"
    >
      <barChartInfo />
    </el-dialog>
  </div>
</template>

<script>
import barPlanChart from '@/views/dashboard/components/barPlanChart.vue'
import groupChart from '@/views/dashboard/components/groupChart.vue'
import accGroupChart from '@/views/dashboard/components/accGroupChart.vue'
import barChart from '@/views/dashboard/components/barChart.vue'
import barChartInfo from '@/views/dashboard/components/barChartInfo.vue'
import pieChart from '@/views/dashboard/components/pieChart.vue'
import radarChart from '@/views/dashboard/components/radarChart.vue'
import { dailyOutput } from '@/api/charts'
import 'particles.js'

export default {
  name: 'Dashboard',
  components: {
    barPlanChart,
    groupChart,
    accGroupChart,
    barChart,
    barChartInfo,
    pieChart,
    radarChart
  },
  data() {
    return {
      date: null,
      time: null,
      timer: null,
      showBarChart: false,
      totalPlanDemand: 0,
      totalActualOutPut: 0,
      notices: [
        '【通知】7月21日进行设备维护，请各班做好准备!',
        '【提醒】A线加料工序精度需提高，请注意操作规范.',
        '【公告】本月安全生产标兵：张工、李工、王工.',
        '【通知】下周一进行消防演练，请全体人员参加.',
        '【提醒】C线松散工序温度异常，已安排检修.'
      ]
    }
  },
  computed: {
    // 自动获取昨天时间
    setDate() {
      const today = new Date()
      today.setDate(today.getDate() - 1)
      return today
    }
  },
  created() {
    this.date = this.setDate
    this.getData()
  },
  mounted() {
    this.updateTime()
    this.initParticles()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    // 获取当天产量信息
    getData() {
      dailyOutput({ 'date': this.date }).then(res => {
        const { totalPlanDemand, totalActualOutPut } = res.data
        this.totalActualOutPut = totalActualOutPut
        this.totalPlanDemand = totalPlanDemand
      })
    },
    // 初始化背景粒子效果
    initParticles() {
      // eslint-disable-next-line no-undef
      particlesJS.load('particles-js', '/gyzs-ms/particlesDashboard.json', function() {})
    },
    // 持续获取当前时间
    updateTime() {
      this.timer = setInterval(() => {
        const now = new Date()
        this.time = now.toTimeString().substr(0, 8)
      }, 1000)
    },
    // 切换显示日期
    handleChangeDate() {
      this.$message.success('切换成功')
      this.getData()
    },
    // 点击生产详情按钮
    clickBarChart(val) {
      if (val) {
        this.showBarChart = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  position: relative;
  width: 100%;
  height: 100vh;
  padding: 5px;
  display: flex;
  flex-direction: column;
  background: #0f2027;
  color: #fff;
  overflow: hidden;
  font-family: "Microsoft YaHei", sans-serif;
}

/* 粒子背景容器 */
#particles-js {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 1;
}

/* 内容区域提升层级 */
.header, .main-content {
  position: relative;
  z-index: 1;
}

/* 顶部标题栏 */
.header {
  height: 70px;
  background: rgba(70, 84, 123, 0.1);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 10px;
  border: 1px solid rgba(64, 224, 208, 0.3);
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.3);
  backdrop-filter: blur(5px);
  transition: all 0.5s ease;
}

.header:hover {
  box-shadow: 0 0 25px rgba(0, 217, 255, 0.5);
}

.title {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 2px;
  margin: 0 auto;
  background: linear-gradient(to right, #40e0d0, #00bfff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(64, 224, 208, 0.3);
}

.time-info {
  position: absolute;
  left: 1%
}

.current-date {
  font-size: 16px;
  margin-bottom: 5px;
}

.current-time {
  font-size: 22px;
  font-weight: bold;
  color: #2fd0d0;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { text-shadow: 0 0 5px rgba(0, 255, 255, 0.5); }
  50% { text-shadow: 0 0 20px rgba(0, 255, 255, 0.8); }
  100% { text-shadow: 0 0 5px rgba(0, 255, 255, 0.5); }
}

/* 主体内容 */
.main-content {
  flex: 1;
  display: flex;
  gap: 10px;
}

.panel {
  background: rgba(70, 84, 123, 0.1);
  border-radius: 8px;
  padding: 15px;
  border: 1px solid rgba(64, 224, 208, 0.2);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.2);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.panel:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 217, 255, 0.3);
}

.panel-title {
  font-size: 18px;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(64, 224, 208, 0.4);
  color: #40e0d0;
  text-shadow: 0 0 5px rgba(64, 224, 208, 0.3);
}

/* 左右侧面板 */
.left-right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 中间面板 */
.center-panel {
  flex: 1.5;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 产量卡片 */
.production-cards {
  display: flex;
  justify-content: center;
}

.production-card {
  background: rgba(17, 32, 49, 0.5);
  border-radius: 8px;
  padding: 15px;
  margin: 10px;
  width: 300px;
  text-align: center;
  border: 1px solid rgba(0, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.production-card:hover {
  transform: scale(1.02);
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.4);
}

.production-label {
  font-size: 16px;
  margin-bottom: 10px;
  color: #7fdbff;
}

.production-value {
  font-size: 32px;
  font-weight: bold;
  color: #409EEF;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  animation: float 30s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* 图表容器 */
.chart-container {
  height: 100%;
  width: 100%;
  background: rgba(14, 35, 58, 0.35);
  border-radius: 5px;
  overflow: hidden;
}

.double-chart {
  display: flex;
  gap: 15px;
  height: 210px;
}

.double-chart > div {
  flex: 1;
}

/* 公告栏 */
.notice-board {
  background: rgba(17, 32, 49, 0.5);
  border-radius: 8px;
  padding: 15px;
  height: 110px;
  overflow-y: auto;
  border: 1px solid rgba(0, 255, 255, 0.2);
}

.notice-item {
  color: #fff;
  padding: 5px 0;
  border-bottom: 1px dashed rgba(127, 219, 255, 0.3);
  transition: all 0.3s ease;
}

.notice-item:hover {
  transform: translateX(5px);
  background: rgba(0, 217, 255, 0.1);
}

.notice-item:last-child {
  border-bottom: none;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(64, 224, 208, 0.5);
  border-radius: 3px;
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .main-content {
    flex-direction: column;
  }

  .left-right-panel, .center-panel {
    width: 100%;
  }

  .double-chart {
    flex-direction: column;
  }
}

@media screen and (max-width: 768px) {
  .header {
    height: auto;
    flex-direction: column;
    padding: 10px;
  }

  .title {
    margin-bottom: 10px;
  }
}
</style>
