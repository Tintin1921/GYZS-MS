<template>
  <div class="app-container">
    <el-form ref="form">
      <el-card class="custom-top-query-card" shadow="hover">
        <div class="card-header">
          <span class="title"><i slot="prefix" class="el-icon-s-fold custom-icon" />学习中心</span>
          <div class="header-actions">
            <el-tooltip content="操作指引">
              <el-button type="text" icon="el-icon-guide" @click.prevent.stop="guide" />
            </el-tooltip>
          </div>
        </div>
        <el-divider />
        <el-row id="step1" :gutter="12" align="middle" class="query-row">
          <!-- 操作按钮 -->
          <el-col :span="4">
            <h3>你好： {{ summary.employeeName }}</h3>
          </el-col>
          <el-col :span="4">
            <h3>总培训任务数： {{ summary.totalTaskCount }} 项</h3>
          </el-col>
          <el-col :span="4">
            <h3>完成培训任务数： {{ summary.completedTaskCount }} 项</h3>
          </el-col>
          <el-col :span="4">
            <h3>培训答题平均得分： {{ summary.examAverageScore }} 分</h3>
          </el-col>
          <el-col :span="4">
            <h3>总培训课时： {{ (summary.totalStudyFileTimeSeconds / 60).toFixed(2) }} 分钟</h3>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <div id="step2">
      <learNingTaskTab />
    </div>
  </div>
</template>

<script>
import steps from './components/learning/guideStep'
import 'driver.js/dist/driver.min.css'
import Driver from 'driver.js'
import { getUserSummary } from '@/api/training'
import learNingTaskTab from '@/views/training/components/learning/learningTaskTab.vue'

export default {
  components: {
    learNingTaskTab
  },
  data() {
    return {
      summary: {}
    }
  },
  created() {
    this.getData()
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
    getData() {
      getUserSummary().then(res => {
        const { data } = res
        this.summary = data
      })
    }
  }
}
</script>
