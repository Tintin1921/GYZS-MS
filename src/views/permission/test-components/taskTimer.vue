<template>
  <div class="timer" :style="{ color: timeColor }">
    倒计时：{{ timeString }}
  </div>
</template>

<script>
export default {
  props: {
    time: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      currentTime: this.time
    }
  },
  computed: {
    timeString() {
      const minutes = Math.floor(this.currentTime / 60)
      const seconds = this.currentTime % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    },
    timeColor() {
      return this.currentTime < 300 ? 'red' : this.currentTime < 600 ? 'orange' : 'black'
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      if (this.currentTime > 0) {
        this.currentTime -= 1
      } else {
        clearInterval(this.interval)
        this.$emit('timeup')
      }
    }, 1000)
  },
  beforeUnmount() {
    clearInterval(this.interval)
  }
}
</script>

<style scoped>
.timer {
  font-size: 1.5em;
  margin-bottom: 20px;
  font-weight: bold;
}
</style>
