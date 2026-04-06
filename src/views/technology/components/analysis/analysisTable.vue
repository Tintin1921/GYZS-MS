<template>
  <div class="container">
    <div v-loading="loading" element-loading-text="数据处理中...">
      <div class="el-btnGroup-container" :class="{ 'el-btnGroup-container-ground ': btnDisplay }">
        <el-tooltip class="el-btn" placement="top" content="点击隐藏功能组">
          <el-button v-if="btnDisplay" id="open-btn" size="mini" type="primary" icon="el-icon-remove-outline" @click="handleDisplay" />
          <el-button v-if="!btnDisplay" id="close-btn" size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleDisplay" />
        </el-tooltip>
        <el-divider direction="vertical" />
        <transition name="el-zoom-in-bottom">
          <div v-show="btnDisplay">
            <el-button-group class="el-btn-group">
              <el-tooltip placement="top" content="对比已保存的模板">
                <el-button size="mini" type="primary" icon="el-icon-tickets" @click="handleMangeMode">对比</el-button>
              </el-tooltip>
              <el-tooltip placement="top" content="汇总统计查询数据">
                <el-button size="mini" type="primary" icon="el-icon-data-line" @click="handleCalcAll">统计</el-button>
              </el-tooltip>
              <el-tooltip placement="top" content="导出查询数据">
                <el-button size="mini" type="primary" icon="el-icon-download" :loading="loading" @click="handleExport">导出</el-button>
              </el-tooltip>
            </el-button-group>
          </div>
        </transition>
      </div>
      <div>
        <el-table
          :data="tempData.data"
          border
          class="custom-table"
          fit
          stripe
          highlight-current-row
          @sort-change="handleSortByMark"
        >
          <el-table-column
            label="序号"
            align="center"
            width="75rem"
            prop="index"
            sortable
            fixed="left"
          />
          <el-table-column label="综合评分" width="90rem" align="center" prop="segmentMark" fixed="left" sortable />
          <el-table-column label="批次号" width="185rem" align="center" prop="batchNo" fixed="left" />
          <el-table-column v-if="!childData.total" label="工艺指标" min-width="170rem" align="center">
            <el-table-column label="实际值" align="center" />
            <el-table-column label="工序得分" align="center" />
            <el-table-column label="权重得分" align="center" />
          </el-table-column>
          <el-table-column
            v-for="val in tempData.indexName"
            :key="val"
            :label="val"
            align="center"
          >
            <el-table-column label="实际值" min-width="95rem" align="center">
              <template slot-scope="{row}">
                {{ filterData(tempData.data, row, val).qualityMetricValue }}
              </template>
            </el-table-column>
            <el-table-column label="实际得分" min-width="95rem" align="center">
              <template slot-scope="{row}">
                {{ filterData(tempData.data, row, val).qualityMetricScore }}
              </template>
            </el-table-column>
            <el-table-column label="权重得分" min-width="95rem" align="center">
              <template slot-scope="{row}">
                {{ filterData(tempData.data, row, val).qualityMetricScoreInSegment }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="生产开始时间" width="165rem" align="center" prop="startTime" fixed="right" />
          <el-table-column label="生产结束时间" width="165rem" align="center" prop="endTime" fixed="right" />
          <el-table-column label="操作" width="110rem" align="center" fixed="right">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" @click="handleChart(row)">
                趋势
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-if="childData.total"
          :total="tempData.total"
          :limit.sync="tempData.limit"
          :page.sync="tempData.page"
          @pagination="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog
      :key="componentObj.key"
      :title="componentObj.title"
      :visible.sync="dialogDisplay"
      :destroy-on-close="true"
      width="85%"
    >
      <eChart v-if="componentObj.name === 'eChart'" :chart-info="chartInfo" />
      <manageTable v-if="componentObj.name === 'manageTable'" :mode-data="modeData" />
      <calcTable v-if="componentObj.name === 'calcTable'" :origin-data="originData" :index-name="childData.indexName" />
    </el-dialog>
  </div>
</template>

<script>
import { exportXlsx } from '@/views/technology/components/analysis/export'
import { generateID } from '@/utils/generateID'
import calcTable from '@/views/technology/components/analysis/calcTable.vue'
import eChart from '@/views/technology/components/analysis/eChart.vue'
import manageTable from '@/views/technology/components/analysis/manageTable.vue'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination,
    calcTable,
    manageTable,
    eChart
  },
  props: {
    childData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 控制按钮加载
      loading: false,
      // 是否显示弹窗
      dialogDisplay: false,
      // 是否显示按钮组
      btnDisplay: true,
      // 显示的组件名
      componentObj: {
        key: null,
        name: null,
        title: null
      },
      // 元数据的data部分
      originData: {},
      // 包含分页信息的临时数据
      tempData: {},
      // 模板对比
      modeData: {},
      // 曲线
      chartInfo: {}
    }
  },
  computed: {
    paginatedData() {
      const startIndex = (this.tempData.page - 1) * this.tempData.limit
      const endIndex = startIndex + this.tempData.limit
      return this.originData.slice(startIndex, endIndex)
    }
  },
  watch: {
    childData(newVal) {
      if (newVal.reset) {
        this.tempData.data = []
      } else {
        this.originData = newVal.data
        this.tempData = newVal
        this.tempData.data = this.paginatedData
      }
    }
  },
  methods: {
    handleDisplay() {
      this.btnDisplay = !this.btnDisplay
    },
    // 翻页
    handleCurrentChange(index) {
      this.tempData.page = index.page
      this.tempData.limit = index.limit
      this.tempData.data = this.paginatedData
    },
    // 排序
    handleSortByMark({ prop, order }) {
      this.originData.data = [...this.originData.data].sort((a, b) => {
        const compare = a[prop] > b[prop] ? 1 : (a[prop] < b[prop] ? -1 : 0)
        return order === 'ascending' ? compare : -compare
      })
      this.tempData.data = this.paginatedData
    },
    // 根据指标来过滤数据
    filterData(origin, row, val) {
      let obj = null
      const index = row.index
      const dataList = origin.filter(item => item.index === index)[0]
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
    },
    handleChart(row) {
      this.chartInfo = row
      this.setComponentObj('工艺曲线趋势', 'eChart')
    },
    handleExport() {
      try {
        this.$message.info('导出中')
        this.loading = true
        setTimeout(() => {
          exportXlsx(this.originData, this.childData.indexName)
          this.loading = false
          this.$message.success('导出成功')
        }, 1500)
      } catch {
        this.$message.error('导出失败')
      }
    },
    handleCalcAll() {
      const length = this.originData.length
      if (length === undefined) {
        this.$message.error('请先查询数据')
        return
      }
      this.setComponentObj('统计数据', 'calcTable')
      this.dialogDisplay = true
    },
    handleMangeMode() {
      const data = JSON.parse(sessionStorage.getItem('mode'))
      const indexName = JSON.parse(sessionStorage.getItem('indexName'))
      if (data !== null) {
        this.modeData.data = data
        this.modeData.indexName = indexName
        this.setComponentObj('模板数据分析', 'manageTable')
        this.dialogDisplay = true
      } else {
        this.$message.error('当前未添加任何模板')
      }
    },
    setComponentObj(title, name) {
      this.componentObj.title = title
      this.componentObj.name = name
      this.componentObj.key = generateID()
      this.dialogDisplay = true
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 1rem
}

.el-btnGroup-container {
  display: flex;
  width: 100%;
}

.el-btnGroup-container-ground {
  background: #fafafa;
}

.el-divider--vertical {
  margin: 8px;
}

.el-btn {
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
  }
  transition: all 0.3s;
  background: linear-gradient(45deg, #409eff, #79bbff);
  border-color: #79bbff;
}

.el-btn-group {
  gap: 8px;

  &:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .el-button {
    padding: 10px 15px;
    transition: all 0.3s;
    border: 1px solid var(--border-color);

    & + .el-button {
      margin-left: 0;
      background: linear-gradient(45deg, #409eff, #79bbff);
      border-color: #79bbff;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
    }
  }
}

</style>
