<template>
  <div class="question-block">
    <h3>题目 {{ question.id }}: {{ question.question }}</h3>
    <div v-if="question.type === 'choice'" class="question-type">
      <el-radio-group v-model="selectedAnswer" @change="markAsAnswered">
        <el-radio-button
          v-for="(option, index) in question.options"
          :key="index"
          :label="option"
        >
          {{ option }}
        </el-radio-button>
      </el-radio-group>
    </div>
    <div v-else-if="question.type === 'judge'" class="question-type">
      <el-radio-group v-model="selectedAnswer" @change="markAsAnswered">
        <el-radio label="对">对</el-radio>
        <el-radio label="错">错</el-radio>
      </el-radio-group>
    </div>
    <div v-else-if="question.type === 'fill'" class="question-type">
      <el-input v-model="selectedAnswer" placeholder="请输入答案" @blur="markAsAnswered" />
    </div>
    <div v-else-if="question.type === 'short'" class="question-type">
      <el-input
        v-model="selectedAnswer"
        type="textarea"
        placeholder="请输入简答内容"
        @blur="markAsAnswered"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedAnswer: ''
    }
  },
  methods: {
    markAsAnswered() {
      this.$emit('answered', this.question.id - 1)
    }
  }
}
</script>

<style scoped>
.question-block {
  margin-bottom: 20px;
}
.question-type {
  margin-top: 20px;
}
</style>
