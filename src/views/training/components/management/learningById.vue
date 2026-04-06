<template>
  <div>
    <el-table
      ref="table"
      v-loading="loading"
      row-key="taskId"
      height="500px"
      :data="originData"
      class="custom-table"
      element-loading-text="操作处理中..."
    >
      <el-table-column label="序号" type="index" align="center" width="95px" />
      <el-table-column label="任务名称" align="center" prop="trainingTaskTitle" min-width="210px" />
      <el-table-column label="状态" align="center" prop="completionState" width="150px" />
      <el-table-column label="操作" align="center" width="205px">
        <template slot-scope="{ row }">
          <el-tooltip placement="left" content="点击查看详情">
            <span @click.stop="handleToggleExpand(row)">详情</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column type="expand" align="center" width="1px">
        <template slot-scope="{ row }">
          <div v-if="row.expanded">
            <el-table
              v-loading="loading"
              :data="row.data"
              style="margin-left: 100px;"
              element-loading-text="操作处理中..."
            >
              <el-table-column label="子序号" type="index" align="center" width="95px" />
              <el-table-column label="状态" prop="completionState" align="center" width="130px" />
              <el-table-column label="答题进度" align="center" width="95px">
                <template slot-scope="scope">
                  {{ scope.row.studyState !== undefined ? scope.row.studyState : scope.row.examState }}
                </template>
              </el-table-column>
              <el-table-column label="课件名" align="center" width="300px">
                <template slot-scope="scope">
                  {{ scope.row.fileName !== undefined ? scope.row.fileName : scope.row.questionBankName }}
                </template>
              </el-table-column>
              <el-table-column label="类型" align="center" width="95px">
                <template slot-scope="scope">
                  {{ scope.row.isRequired !== undefined ? filterIsRequired(scope.row.isRequired) : '必修' }}
                </template>
              </el-table-column>
              <el-table-column label="学习时长(min)" align="center" width="135px">
                <template slot-scope="scope">
                  {{ scope.row.studyTimeSeconds !== undefined ? (scope.row.studyTimeSeconds / 60).toFixed(2) : (scope.row.examSpentTimeSeconds / 60).toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column label="得分" align="center" width="95px">
                <template slot-scope="scope">
                  {{ scope.row.obtainTotalScore !== undefined ? scope.row.obtainTotalScore : '/' }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getDetailById } from '@/api/training'
import { deepClone } from '@/utils'

export default {
  props: {
    employeeId: {
      type: Number,
      default: 0,
      required: true
    }
  },
  data() {
    return {
      // 表格数据
      originData: [],
      // 是否加载
      loading: true
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getDetailById(this.employeeId).then(res => {
        const { data } = res
        if (data) {
          this.originData = data
        } else {
          this.$message.error('暂无培训数据')
          this.originData = []
        }
      })
      this.loading = false
    },
    async handleToggleExpand(row) {
      this.loading = true
      row.expanded = !row.expanded
      this.$nextTick(() => {
        this.$refs.table.toggleRowExpansion(row, row.expanded)
      })
      // 此处目的是为了将data数据扁平化
      const data = deepClone(row)
      data.taskFileList = data.taskFileList.concat(data.taskExamPaperList)
      delete data['taskExamPaperList']
      const newData = []
      data.taskFileList.map(obj => {
        newData.push({ ...data, ...obj })
      })
      row.data = newData
      this.loading = false
    },
    // 过滤必修的数据
    filterIsRequired(isRequired) {
      if (isRequired) {
        return '必修'
      } else {
        return '选修'
      }
    }
  }
}
</script>
