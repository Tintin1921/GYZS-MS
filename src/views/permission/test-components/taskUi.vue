<template>
  <div class="app-container">
    <!-- 左侧答题区域 -->
    <el-card shadow="hover" class="question-container">
      <h2>答题区</h2>
      <Question
        :question="questions[currentQuestionIndex]"
        @answered="handleAnswered"
      />
      <div class="actions">
        <el-button
          v-if="currentQuestionIndex > 0"
          type="primary"
          size="small"
          class="prev-btn"
          @click="prevQuestion"
        >
          上一题
        </el-button>
        <el-button
          v-if="currentQuestionIndex < questions.length - 1"
          type="primary"
          size="small"
          class="next-btn"
          @click="nextQuestion"
        >
          下一题
        </el-button>
        <el-button
          v-if="currentQuestionIndex === questions.length - 1"
          type="success"
          size="small"
          class="submit-btn"
          @click="submitAnswers"
        >
          提交
        </el-button>
      </div>
    </el-card>

    <!-- 右侧导航区域 -->
    <el-card shadow="hover" class="navigation-container">
      <h3>答题进度</h3>
      <Timer :time="60 * 60" />
      <div class="question-navigator">
        <el-tooltip
          v-for="(question, index) in questions"
          :key="index"
          :content="(index + 1) + (answeredQuestions.includes(index) ? ' 已答' : ' 未答')"
          placement="top"
        >
          <el-button
            circle
            size="mini"
            :class="{
              'selected-question': currentQuestionIndex === index,
              'answered-question': answeredQuestions.includes(index),
            }"
            @click="jumpToQuestion(index)"
          >
            {{ (index + 1).toString().padStart(2, '0') }}
          </el-button>
        </el-tooltip>
      </div>
      <el-progress
        :percentage="((answeredQuestions.length / questions.length) * 100).toFixed(0)"
        status="success"
        color="#67c23a"
      />
    </el-card>
  </div>
</template>

<script>
import Timer from './taskTimer.vue'
import Question from './question.vue'

export default {
  components: { Timer, Question },
  data() {
    return {
      questions: Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        type: 'choice',
        question: `选择题 ${i + 1}: 2+2=？`,
        options: ['3', '4', '5'],
        answer: '4'
      })),
      currentQuestionIndex: 0,
      answeredQuestions: []
    }
  },
  methods: {
    handleAnswered(index) {
      if (!this.answeredQuestions.includes(index)) {
        this.answeredQuestions.push(index)
      }
    },
    nextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++
      }
    },
    prevQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--
      }
    },
    submitAnswers() {
      this.$message.success('提交成功！')
    },
    jumpToQuestion(index) {
      this.currentQuestionIndex = index
    }
  }
}
</script>

  <style scoped>
  .app-container {
    display: flex;
    gap: 20px;
    padding: 20px;
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
    bottom: 20px;
    right: 20px;
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
  </style>
