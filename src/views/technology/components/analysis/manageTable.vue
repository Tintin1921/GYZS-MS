<template>
  <div>
    <h3>模板对比</h3>
    <el-button size="mini" class="query-btn" style="float: left;margin-bottom: 0.2rem" type="primary" @click="handleAddFirstMode">添加标准模板</el-button>
    <el-button size="mini" class="query-btn" style="float: left;margin-bottom: 0.2rem" type="primary" @click="handleAddSecondMode">添加对比模板</el-button>
    <el-button size="mini" class="confirm-btn" style="float: left;margin-bottom: 0.2rem" type="success" @click="handleConfirm">确认</el-button>
    <el-table
      :data="list"
    >
      <el-table-column label="序号" type="index" align="center" fixed="left" />
      <el-table-column label="工序" align="center" prop="segment" fixed="left" width="150rem" />
      <el-table-column label="牌号" align="center" prop="proName" fixed="left" width="150rem" />
      <el-table-column label="综合评分" align="center" prop="segmentMark" fixed="left" width="90rem" />
      <el-table-column v-for="item in modeData.indexName" :key="item" :label="item" align="center">
        <el-table-column label="实际值" align="center" width="95rem">
          <template slot-scope="{row}">
            {{ filterData(list, row, item).qualityMetricValue }}
          </template>
        </el-table-column>
        <el-table-column label="工序得分" align="center" width="95rem">
          <template slot-scope="{row}">
            {{ filterData(list, row, item).qualityMetricScore }}
          </template>
        </el-table-column>
        <el-table-column label="权重得分" align="center" width="95rem">
          <template slot-scope="{row}">
            {{ filterData(list, row, item).qualityMetricScoreInSegment }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="开始时间" width="165rem" align="center" prop="miniDate" fixed="right" />
      <el-table-column label="结束时间" width="165rem" align="center" prop="maxDate" fixed="right" />
    </el-table>
    <el-dialog
      title="添加模板"
      :visible.sync="displayAddMode"
      :destroy-on-close="true"
      :append-to-body="true"
      width="55%"
    >
      <el-table
        v-if="modeData.data.length > 0"
        :data="modeData.data"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="序号" width="50rem" type="index" align="center" />
        <el-table-column label="工序" align="center" prop="segment" />
        <el-table-column label="综合评分" align="center" prop="segmentMark" />
        <el-table-column label="牌号" width="160rem" align="center" prop="proName" />
        <el-table-column label="保存时间" width="160rem" align="center" prop="date" />
        <el-table-column label="开始时间" width="160rem" align="center" prop="miniDate" />
        <el-table-column label="结束时间" width="160rem" align="center" prop="maxDate" />
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" @click="handleAddMode(row)">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    modeData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      displayAddMode: false,
      list: [{}, {}, {}],
      index: -1
    }
  },
  mounted() {
    console.log(this.modeData)
  },
  methods: {
    handleAddMode(row) {
      const index = this.index
      this.$set(this.list, index, row)
      this.$message.success('添加成功')
    },
    handleAddFirstMode() {
      this.index = 0
      this.displayAddMode = true
    },
    handleAddSecondMode() {
      this.index = 1
      this.displayAddMode = true
    },
    handleConfirm() {
      const [firstMode, secondMode] = this.list
      const result = {}
      for (const key in firstMode) {
        if (secondMode.hasOwnProperty(key)) {
          const originalValue = firstMode[key]
          const newValue = secondMode[key]
          let changePercentage
          if (originalValue === 0 && newValue === 0) {
            changePercentage = 0
          } else {
            changePercentage = ((newValue - originalValue) / originalValue) * 100
          }
          result[key] = changePercentage.toFixed(2) + '%'
        }
      }
      result.maxDate = '/'
      result.miniDate = '/'
      result.segment = firstMode.segment
      result.proName = firstMode.proName
      this.$set(this.list, 2, result)
      this.$message.success('操作成功')
    },
    // 根据指标来过滤数据
    filterData(origin, row, val) {
      let obj = null
      const id = row.id
      const dataList = origin.filter(item => item.id === id)[0]
      for (const item in dataList) {
        if (item.includes(val)) {
          obj = {
            qualityMetricScore: `${dataList[val + 'qualityMetricScore']}`,
            qualityMetricScoreInSegment: `${dataList[val + 'qualityMetricScoreInSegment']}`,
            qualityMetricValue: `${dataList[val + 'qualityMetricValue']}`
          }
        }
      }
      if (obj === null) {
        obj = {
          qualityMetricScore: '/',
          qualityMetricScoreInSegment: '/',
          qualityMetricValue: '/'
        }
      }
      return obj
    }
  }
}

</script>
