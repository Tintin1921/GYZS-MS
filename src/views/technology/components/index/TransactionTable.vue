<template>
  <el-table
    ref="scrollTable"
    :data="list"
    height="31vh"
    style="width: 100%;padding-top: 15px;height: 31vh"
    @mouseenter.native="handleMouseEvent"
    @mouseleave.native="handleMouseLeave"
  >
    <el-table-column label="批次号" prop="batchNo" min-width="195" align="center" />
    <el-table-column label="工序" prop="cellName" align="center" width="110" />
    <el-table-column label="品牌/规格" prop="proName" min-width="185" align="center" />
    <el-table-column label="计划开始时间" prop="planStartTime" min-width="185" align="center" />
    <el-table-column label="实际结束时间" prop="planEndTime" min-width="185" align="center" />
    <el-table-column label="状态" width="120" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.workStaticName | statusFilter">
          {{ row.workStaticName }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getTodayPlan } from '@/api/product'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        '待下发': 'info',
        '待确认': 'info',
        '待执行': '',
        '执行中': 'warning',
        '已结束': 'success',
        '已驳回': 'danger',
        '已撤回': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      scrollInterval: null,
      scrollStep: 1
    }
  },
  created() {
    this.getPlan()
  },
  mounted() {
    this.startAutoScroll()
  },
  beforeDestroy() {
    clearInterval(this.scrollInterval)
  },
  methods: {
    getPlan() {
      getTodayPlan().then(res => {
        const { data } = res
        this.list = data.filter(item => item.cellName.includes('烘丝'))
      })
    },
    getScrollWrapper() {
      return this.$refs.scrollTable.$el
        .querySelector('.el-table__body-wrapper')
    },
    startAutoScroll() {
      const wrapper = this.getScrollWrapper()
      this.scrollInterval = setInterval(() => {
        wrapper.scrollTop += this.scrollStep
        if (wrapper.scrollTop + wrapper.clientHeight >= wrapper.scrollHeight) {
          wrapper.scrollTop = 0
        }
      }, 50)
    },
    handleMouseEvent() {
      clearInterval(this.scrollInterval)
    },
    handleMouseLeave() {
      this.startAutoScroll()
    }
  }
}
</script>
