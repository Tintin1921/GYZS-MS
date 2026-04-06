<template>
  <div class="app-container" v-loading="loading">
    <!-- 左侧答题区域 -->
    <div class="timer">
      阅读计时：{{ timeString }}
    </div>
    <el-card shadow="hover" class="question-container">
      <div class="iframe-container">
        <iframe :src="documentURL" @load="handleLoadDocument" />
      </div>
    </el-card>
  </div>
</template>

<script>
import { previewFile, updateProgress } from '@/api/training'

export default {
  props: {
    childData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 全局参数
      step: 0,
      interval: null,
      currentTime: 0,
      endTime: 0,
      documentURL: null,
      loading: true
    }
  },
  computed: {
    timeString() {
      const minutes = Math.floor(this.currentTime / 60)
      const seconds = this.currentTime % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
  },
  created() {
    this.initialization()
    const { state } = this.childData
    let time = this.childData.requiredStudyTimeSeconds - this.currentTime
    this.currentTime > 0 ? time = this.currentTime : time = 1
    if (state === '进行中' || state === '待开始') {
      updateProgress(this.childData.taskId, { 'domain': '文档', 'configId': this.childData.taskFileConfigId, 'progressSeconds': time })
    }
  },
  beforeDestroy() {
    // 用户中途退出信息
    const time = this.childData.requiredStudyTimeSeconds - this.currentTime
    const { state } = this.childData
    if (state === '进行中' || state === '待开始') {
      updateProgress(this.childData.taskId, { 'domain': '文档', 'configId': this.childData.taskFileConfigId, 'progressSeconds': time })
    }
    clearInterval(this.interval)
  },
  methods: {
    // 主方法
    initialization() {
      const { fileId } = this.childData
      previewFile(fileId).then(res => {
        const { data } = res
        this.documentURL = data
      })
      this.startTimer()
    },
    handleLoadDocument() {
      this.loading = false
    },
    // 开启计时器
    startTimer() {
      this.currentTime = this.childData.requiredStudyTimeSeconds - this.childData.studyTimeSeconds
      this.interval = setInterval(() => {
        if (this.currentTime === 0) {
          this.$message.success('已完成阅读')
          updateProgress(this.childData.taskId, { 'domain': '文档', 'configId': this.childData.taskFileConfigId, 'progressSeconds': this.childData.requiredStudyTimeSeconds })
          location.reload()
        } else {
          this.currentTime--
        }
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  gap: 20px;
  padding: 5px;
}

.iframe-container iframe{
  width: 100%;
  height: 55vh;
}

.question-container {
  flex: 4;
  position: relative;
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
}

.timer {
  font-size: 1.5em;
  margin-bottom: 20px;
  font-weight: bold;
}

</style>
