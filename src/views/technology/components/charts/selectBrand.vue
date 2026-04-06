<template>
  <el-select v-model="value" clearable placeholder="选择规格/品牌(非必选)">
    <el-option
      v-for="item in brandOption"
      :key="item.key"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
export default {
  props: {
    chart: {
      type: Object,
      required: true
    },
    brandOption: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      value: ''
    }
  },
  watch: {
    value: {
      handler: function(newValue) {
        this.$emit('selectBrand', { 'newValue': newValue, 'chart': this.chart })
      }
    }
  }
}
</script>
