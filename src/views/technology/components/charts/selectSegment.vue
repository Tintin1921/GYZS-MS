<template>
  <el-select v-model="value" clearable placeholder="请选择生产工序（必选）">
    <el-option-group
      v-for="group in options"
      :key="group.label"
      :label="group.label"
    >
      <el-option
        v-for="item in group.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-option-group>
  </el-select>
</template>

<script>
export default {
  props: {
    reset: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      options: [{
        label: '前段',
        options: [{
          value: '叶片处理前段',
          label: '叶片处理前段'
        }, {
          value: '叶片处理后段',
          label: '叶片处理后段'
        }]
      }, {
        label: '中段',
        options: [{
          value: '切叶丝',
          label: '切叶丝'
        }, {
          value: '烘丝掺配',
          label: '烘丝掺配'
        }]
      }, {
        label: '后段',
        options: [{
          value: '烟丝加香',
          label: '烟丝加香'
        }]
      }],
      value: ''
    }
  },
  watch: {
    reset: {
      handler: function(newValue) {
        if (newValue) {
          this.value = ''
        }
      }
    },
    value: {
      handler: function(newValue) {
        if (newValue === '烘丝掺配' || newValue === null || newValue === '') {
          if (newValue === '烘丝掺配') {
            this.$emit('selectSegment', newValue)
          } else {
            this.value = null
          }
        } else {
          this.$message.error('暂未开放')
          this.value = null
        }
      }
    }
  }
}
</script>
