<template>
  <div class="container">
    <div class="chart-container">
      <el-radio-group v-model="activeChart">
        <el-radio-button label="访问趋势">访问趋势</el-radio-button>
        <el-radio-button label="用户类型">用户类型</el-radio-button>
        <el-radio-button label="内容分析">内容分析</el-radio-button>
      </el-radio-group>
    </div>
    <div class="bottom">
      <dailyVisitorChart v-if="activeChart === '访问趋势'" style="height: 30vh;" />
      <userTypeChart v-if="activeChart === '用户类型'" style="height: 30vh;" />
      <contentAnalysisChart v-if="activeChart === '内容分析'" style="height: 30vh" />
    </div>
  </div>
</template>

<script>
import userTypeChart from '@/views/party-building/components/management/userTypeChart.vue'
import dailyVisitorChart from '@/views/party-building/components/management/dailyVisitorChart.vue'
import contentAnalysisChart from '@/views/party-building/components/management/contentAnalysisChart.vue'

export default {
  components: {
    dailyVisitorChart,
    contentAnalysisChart,
    userTypeChart
  },
  data() {
    return {
      activeChart: '访问趋势'
    }
  }
}
</script>
