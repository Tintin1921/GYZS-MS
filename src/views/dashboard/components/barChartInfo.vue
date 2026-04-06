<template>
  <div class="app-container">
    <div style="display: flex;align-items: center">
      <p>选择查询日期：</p>
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="选择日期"
        size="mini"
        :clearable="true"
        style="width: 130px;"
        @change="handleChangeDate"
      />
    </div>
    <div v-for="(data, index) in list" :key="index">
      <h3>
        {{ data.name }}
        <el-select v-model="data.select" placeholder="请选择" clearable size="mini" style="width: 100px">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </h3>
      <el-table :data="filteredScheduleName(data)" :row-class-name="tableRowClass" style="margin-bottom: 20px">
        <el-table-column align="center" prop="batchNumber" label="生产顺序" />
        <el-table-column align="center" prop="batchNo" label="批次号" />
        <el-table-column align="center" prop="batchStaticName" label="状态" />
      </el-table>
      <el-divider />
    </div>
  </div>
</template>

<script>

import { getSchedulePlan } from '@/api/charts'

export default {
  data() {
    return {
      // 原始数据
      origin: [],
      // 操作数据
      list: [],
      // 选项
      options: [],
      // 自定义排序
      order: {
        '投料段': 1,
        '切烘段': 2,
        '加香段': 3
      },
      // 日期
      date: null
    }
  },
  computed: {
    getDay() {
      const today = new Date()
      today.setDate(today.getDate() - 1)
      return today
    }
  },
  created() {
    this.date = this.getDay
    this.getInfo()
  },
  methods: {
    getInfo() {
      // 从服务器获取数据
      getSchedulePlan({ 'date': this.date }).then(res => {
        const { data } = res
        if (data) {
          // origin是全局变量 存储服务器返回值
          this.origin = data
          // 获取工序名并构造出对象的集合
          const scheduleName = [...new Set(data.map(item => {
            const val = item.scheduleCellName
            const length = val.length
            if (val === '梗处理段' || val === '烘梗丝段') {
              return val
            }
            return val.substring(2, length)
          }))].sort((a, b) => this.order[a] - this.order[b])
          scheduleName.map(item => {
            const obj = {}
            obj['name'] = item
            this.list.push(obj)
          })
          // 获取产线名并构造出对象的集合
          const option = [...new Set(data.map(item => {
            return item.proLineName
          }))].sort((a, b) => a - b)
          option.map(item => {
            const obj = {}
            obj['value'] = item
            obj['label'] = item
            this.options.push(obj)
          })
        } else {
          this.$message.error('当天无数据')
        }
      })
    },
    // 根据工序和产线过滤数据
    filteredScheduleName(filter) {
      const name = filter.name
      const line = filter.select
      return this.origin.filter(item => item.scheduleCellName.includes(name) && item.proLineName === line)
    },
    tableRowClass({ row }) {
      if (row.batchStaticName === '待下发') {
        return 'row-one'
      } else if (row.batchStaticName === '待执行') {
        return 'row-two'
      } else if (row.batchStaticName === '执行中') {
        return 'row-three'
      } else if (row.batchStaticName === '已结束') {
        return 'row-four'
      }
    },
    handleChangeDate() {
      this.origin = []
      this.list = []
      this.options = []
      this.getInfo()
    }
  }
}
</script>

<style lang="scss">

.row-one {
  background-color: #0a4ef6 !important;
  opacity: 0.8;
  color: #fff;
}

.row-two {
  background-color: #f58f0c !important;
  opacity: 0.8;
  color: #fff;
}

.row-three {
  background-color: #f58f0c !important;
  opacity: 0.8;
  color: #fff;
}

.row-four {
  background-color: #ef1616 !important;
  opacity: 0.8;
  color: #fff;
}

.el-table :hover {
  color: #000000;
}
</style>
