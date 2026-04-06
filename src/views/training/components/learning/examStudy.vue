<template>
  <div class="app-container">
    <!-- 左侧答题区域 -->
    <el-card shadow="hover" class="question-container">
      <h2>{{ answerRecordList[step].questionType }}</h2>
      <div class="question-block">
        <!--  答题区  -->
        <div class="question-type">
          <!--  题目  -->
          <div style="display: flex">
            <h3>{{ step + 1 }}、{{ answerRecordList[step].questionStem }}</h3>
            <el-popover
              trigger="hover"
              content=""
            >
              <img :src="answerRecordList[step].imagePath" style="width: 300px" alt="当前题目无图片">
              <el-button v-if="answerRecordList[step].imagePath !== null" slot="reference" class="checkPic" type="primary" size="mini">查看图片</el-button>
            </el-popover>
          </div>
          <!--  选择题  -->
          <div v-if="answerRecordList[step].questionType === '选择题'">
            <el-radio-group v-for="(item, index) in answerRecordList[step].options" :key="index" v-model="answerRecordList[step].candidateAnswer" style="display: flex" @input="handleAnswered(step)">
              <el-radio style="font-size: 32px;font-weight: 600" :label="item.option" :disabled="setDisabled">{{ item.option + '.' + item.answer }}</el-radio>
            </el-radio-group>
            <h3
              v-show="childData.examState === '已完成' || childData.examState === '已逾期'"
              :style="answerRecordList[step].obtainedScore === 0 ? { 'color': 'red' } : { 'color': 'blue' }"
            >
              {{ answerRecordList[step].obtainedScore === 0 ? '正确答案：' + answerRecordList[step].correctAnswer : '回答正确' }}
            </h3>
          </div>
          <!--  判断题  -->
          <div v-if="answerRecordList[step].questionType === '判断题'">
            <el-radio-group v-model="answerRecordList[step].candidateAnswer" style="display: flex" @input="handleAnswered(step)">
              <el-radio style="font-size: 32px;font-weight: 600" label="正确" :disabled="setDisabled">正确</el-radio>
              <el-radio style="font-size: 32px;font-weight: 600" label="错误" :disabled="setDisabled">错误</el-radio>
            </el-radio-group>
            <h3
              v-show="childData.examState === '已完成' || childData.examState === '已逾期'"
              :style="answerRecordList[step].obtainedScore === 0 ? { 'color': 'red' } : { 'color': 'blue' }"
            >
              {{ answerRecordList[step].obtainedScore === 0 ? '正确答案：' + answerRecordList[step].correctAnswer : '回答正确' }}
            </h3>
          </div>
          <!--  填空题  -->
          <div v-if="answerRecordList[step].questionType === '填空题'">
            <el-input v-model="answerRecordList[step].candidateAnswer" :disabled="setDisabled" size="mini" @input="handleAnswered(step)" />
            <h3
              v-show="childData.examState === '已完成' || childData.examState === '已逾期'"
              :style="answerRecordList[step].obtainedScore === 0 ? { 'color': 'red' } : { 'color': 'blue' }"
            >
              {{ answerRecordList[step].obtainedScore === 0 ? '正确答案：' + answerRecordList[step].correctAnswer : '回答正确' }}
            </h3>
          </div>
          <!--  简答题  -->
          <div v-if="answerRecordList[step].questionType === '简答题'">
            <el-input v-model="answerRecordList[step].candidateAnswer" :disabled="setDisabled" type="textarea" size="mini" @input="handleAnswered(step)" />
            <div v-if="childData.examState === '评分中'">
              评分：<el-input v-model="answerRecordList[step].obtainedScore" size="mini" style="width: 8%" />
            </div>
            <h3
              v-show="childData.examState === '已完成' || childData.examState === '已逾期'"
              style="color: red"
            >
              {{ '得分：' + answerRecordList[step].obtainedScore }} 分
            </h3>
            <h3
              v-show="childData.examState === '已完成' || childData.examState === '已逾期' || childData.examState === '评分中'"
            >
              {{ '参考答案：' + answerRecordList[step].correctAnswer }}
            </h3>
          </div>
        </div>
      </div>
      <div class="actions">
        <el-button
          v-if="step > 0"
          type="primary"
          size="small"
          @click="handleBack"
        >
          上一题
        </el-button>
        <el-button
          v-if="step < answerRecordList.length && step + 1 !== answerRecordList.length"
          type="primary"
          size="small"
          @click="handleNext"
        >
          下一题
        </el-button>
        <el-button
          v-if="step + 1 === answerRecordList.length"
          type="success"
          size="small"
          @click="handleFinish"
        >
          提交
        </el-button>
      </div>
    </el-card>

    <!-- 右侧导航区域 -->
    <el-card v-if="childData.examState === '已完成' || childData.examState === '已逾期' || childData.examState === '评分中'" shadow="hover" class="navigation-container">
      <div class="timer">
        完成时间：{{ timeString }}
      </div>
      <h3>答题结果</h3>
      <div class="question-navigator">
        <div
          v-for="(question, index) in answerRecordList"
          :key="index"
        >
          <el-tooltip :content="question.questionType">
            <el-button
              circle
              size="mini"
              :class="{
                'selected-question': step === index,
                'answered-question': question.obtainedScore > 0,
                'answered-wrong': question.obtainedScore === 0,
              }"
              @click="jumpToQuestion(index)"
            >
              {{ (index + 1).toString().padStart(2, '0') }}
            </el-button>
          </el-tooltip>
        </div>
      </div>
    </el-card>
    <el-card v-else shadow="hover" class="navigation-container" >
      <div class="timer" :style="{ color: timeColor }">
        考试计时：{{ timeString }}
      </div>
      <h3>答题进度</h3>
      <div class="question-navigator">
        <div
          v-for="(question, index) in answerRecordList"
          :key="index"
        >
          <el-tooltip :content="question.questionType">
            <el-button
              circle
              size="mini"
              :class="{
                'selected-question': step === index,
                'answered-question': answeredQuestions.includes(index),
              }"
              @click="jumpToQuestion(index)"
            >
              {{ (index + 1).toString().padStart(2, '0') }}
            </el-button>
          </el-tooltip>
        </div>
      </div>
      <el-progress
        :percentage="taskProgress"
        status="success"
        color="#67c23a"
      />
    </el-card>
  </div>
</template>

<script>
import { setScoring, submitOrder, updateExam, updateProgress } from '@/api/training'

export default {
  props: {
    childData: {
      type: Object,
      required: true
    },
    timer: {
      type: Boolean,
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
      // 试题
      answerRecordList: [],
      // 进度
      answeredQuestions: [],
      timerBoolean: false
    }
  },
  computed: {
    setDisabled() {
      const { examState } = this.childData
      return examState === '评分中' || examState === '已逾期' || examState === '已完成'
    },
    taskProgress() {
      return parseInt(((this.answeredQuestions.length / this.childData.answerRecordList.length) * 100).toFixed(0))
    },
    timeString() {
      const minutes = Math.floor(this.currentTime / 60)
      const seconds = this.currentTime % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    },
    timeColor() {
      return this.currentTime >= (this.endTime / 2.5) ? 'red' : this.currentTime >= this.endTime / 5 ? 'orange' : 'black'
    }
  },
  watch: {
    timer: {
      handler(val) {
        this.passTimer(val)
      }
    }
  },
  created() {
    this.initialization()
    const { examState } = this.childData
    let time = 0
    this.currentTime > 0 ? time = this.currentTime : time = 1
    if (examState === '进行中' || examState === '待开始') {
      updateProgress(this.childData.taskId, { 'domain': '考试', 'configId': this.childData.taskExamConfigId, 'progressSeconds': time })
    }
  },
  beforeDestroy() {
    // 用户中途退出保存答题信息，需要注意的是答题完成后使用的是location.reload()，并不会触发该钩子
    const { examState } = this.childData
    if (examState === '进行中' || examState === '待开始') {
      const array = this.formatCandidateAnswer(this.answerRecordList, '临时保存')
      updateExam(array)
      updateProgress(this.childData.taskId, { 'domain': '考试', 'configId': this.childData.taskExamConfigId, 'progressSeconds': this.currentTime })
      clearInterval(this.interval)
    }
  },
  methods: {
    // 主方法
    initialization() {
      const { answerRecordList, examSpentTimeSeconds } = this.childData
      this.currentTime = examSpentTimeSeconds
      // 将保存的答案添加到进度中
      this.answeredQuestions = answerRecordList.reduce((acc, item, index) => {
        if (item.candidateAnswer !== null) {
          acc.push(index)
        }
        return acc
      }, [])
      this.answerRecordList = answerRecordList
      this.startTimer()
    },
    // 用户答题后记录答题进度
    handleAnswered(index) {
      if (!this.answeredQuestions.includes(index)) {
        this.answeredQuestions.push(index)
      }
    },
    // 用户点击题号进行跳转
    jumpToQuestion(index) {
      this.step = index
    },
    // 开启计时器
    startTimer() {
      this.currentTime = this.childData.examSpentTimeSeconds
      this.endTime = this.childData.timeLimitSeconds
      this.interval = setInterval(() => {
        if (this.currentTime <= this.endTime) {
          this.currentTime++
        } else {
          this.$message.error('答题已超时，请提交。')
          clearInterval(this.interval)
          this.handleFinish()
        }
      }, 1000)
    },
    // 上一步
    handleBack() {
      this.step--
    },
    // 下一步
    handleNext() {
      this.step++
    },
    // 提交
    handleFinish() {
      this.passTimer(false)
      const boolean = !this.answerRecordList.some(item => item.candidateAnswer === null)
      let tips = null
      if (boolean) {
        tips = '确认提交？'
      } else {
        tips = '还有题目未作答，是否继续提交？'
      }
      this.$confirm(tips, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { examState } = this.childData
        if (examState === '待开始' || examState === '进行中') {
          const array = this.formatCandidateAnswer(this.answerRecordList)
          submitOrder(array).then(() => {
            this.$message.success('提交成功')
            updateProgress(this.childData.taskId, { 'domain': '考试', 'configId': this.childData.taskExamConfigId, 'progressSeconds': this.currentTime })
            location.reload()
          })
        } else if (examState === '评分中') {
          const array = this.formatScoreAnswer(this.answerRecordList)
          setScoring(array).then(() => {
            this.$message.success('提交成功')
            location.reload()
          })
        } else {
          this.$message.error('提交失败')
        }
      }).catch(() => {
        this.passTimer(true)
      })
    },
    formatScoreAnswer(data) {
      return data.reduce((acc, item) => {
        const { recordId, obtainedScore } = item
        acc.push({ 'recordId': recordId, 'obtainScore': parseInt(obtainedScore) })
        return acc
      }, [])
    },
    // 格式化提交的答案
    formatCandidateAnswer(data, type) {
      if (type === '临时保存') {
        return data.reduce((acc, item) => {
          const { candidateAnswer, recordId } = item
          if (candidateAnswer !== null) {
            acc.push({ 'candidateAnswer': candidateAnswer, 'recordId': recordId })
          }
          return acc
        }, [])
      } else {
        return data.reduce((acc, item) => {
          const { candidateAnswer, recordId } = item
          if (candidateAnswer !== null) {
            acc.push({ 'candidateAnswer': candidateAnswer, 'recordId': recordId })
          } else {
            acc.push({ 'candidateAnswer': '未填写', 'recordId': recordId })
          }
          return acc
        }, [])
      }
    },
    passTimer(boolean) {
      if (!boolean) {
        clearInterval(this.interval)
      } else {
        this.endTime = this.childData.timeLimitSeconds
        this.interval = setInterval(() => {
          if (this.currentTime <= this.endTime) {
            this.currentTime++
          } else {
            this.$message.error('答题已超时，请提交。')
            clearInterval(this.interval)
            this.handleFinish()
          }
        }, 1000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  height: 65vh;
}

/* 左侧答题区域 */
.question-container {
  flex: 4;
  position: relative;
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
}

/* 按钮布局 */
.actions {
  position: absolute;
  bottom: 1rem;
  right: 1.5rem;
  display: flex;
  gap: 10px;
}

/* 右侧导航区域 */
.navigation-container {
  flex: 2;
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
}

.question-navigator {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 每行固定5个按钮 */
  gap: 8px;
  max-height: 350px; /* 固定高度 */
  overflow-y: auto; /* 滚动条 */
  overflow-x: hidden; /* 避免水平滚动 */
  justify-items: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  padding: 10px; /* 增加内边距，避免按钮溢出看起来突兀 */
}

.question-navigator .el-button {
  width: 30px;
  height: 30px;
  font-size: 12px;
  aspect-ratio: 1 / 1; /* 确保按钮为正圆 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: visible; /* 允许动画部分溢出 */
}

/* 调整第一个圆圈的位置 */
.question-navigator .el-button:first-child {
  margin-left: 10px; /* 左移一点点，微调对齐 */
}

/* 高亮效果 */
.question-navigator .el-button:hover {
  transform: scale(1.1); /* 缩放比例 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 当前选中题目高亮 */
.selected-question {
  border: 2px solid #409eff;
  transform: scale(1.1);
  z-index: 10; /* 保证高亮层级 */
}

/* 已答题按钮 */
.answered-question {
  background-color: #67c23a !important;
  color: white;
}

/* 回答错误按钮 */
.answered-wrong {
  background-color: #f64545 !important;
  color: white;
}

.timer {
  font-size: 1.5em;
  margin-bottom: 20px;
  font-weight: bold;
}

.checkPic {
  color: #409eff;
  background-color: #f9f9f9;
  border: none;
  margin-top: .8rem;
}

</style>
