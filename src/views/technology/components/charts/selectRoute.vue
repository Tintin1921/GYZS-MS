<template>
  <el-select v-model="value" clearable placeholder="请选择生产路线（必选）">
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
        label: '生产线',
        options: [{
          value: 'A',
          label: 'A线'
        }, {
          value: 'B',
          label: 'B线'
        }, {
          value: 'C',
          label: 'C线'
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
        this.$emit('selectRoute', newValue)
      }
    }
  }
}
</script>
