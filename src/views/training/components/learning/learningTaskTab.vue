<template>
  <div>
    <el-table
      ref="table"
      v-loading="loading"
      row-key="taskId"
      :data="paginatedData"
      class="custom-table"
      element-loading-text="操作处理中..."
    >
      <el-table-column label="序号" type="index" align="center" width="115px" />
      <el-table-column label="任务名称" align="center" prop="title" min-width="135px" />
      <el-table-column label="状态" align="center" prop="completionState" width="185px" />
      <el-table-column label="创建人" align="center" prop="creatorName" width="185px" />
      <el-table-column label="学习开始时间" align="center" prop="startTime" width="250px" />
      <el-table-column label="学习结束时间" align="center" prop="endTime" width="250px" />
      <el-table-column label="操作" align="center" width="255px">
        <template slot-scope="{ row }">
          <el-tooltip placement="left" content="点击查看详情">
            <span @click.stop="handleToggleExpand(row)">任务详情</span>
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
              <el-table-column label="实际学习时长(min)" align="center" width="175px">
                <template slot-scope="scope">
                  {{ scope.row.studyTimeSeconds !== undefined ? (scope.row.studyTimeSeconds / 60).toFixed(2) : (scope.row.examSpentTimeSeconds / 60).toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column label="学习时长(min)" align="center" width="135px">
                <template slot-scope="scope">
                  {{ scope.row.requiredStudyTimeSeconds !== undefined ? scope.row.requiredStudyTimeSeconds / 60 : scope.row.timeLimitSeconds / 60 }}
                </template>
              </el-table-column>
              <el-table-column label="得分" align="center" width="105px">
                <template slot-scope="scope">
                  {{ scope.row.obtainedTotalScore !== undefined ? scope.row.obtainedTotalScore : '/' }}
                </template>
              </el-table-column>
              <el-table-column label="总分" align="center" width="105px">
                <template slot-scope="scope">
                  {{ scope.row.totalScore !== undefined ? scope.row.totalScore : '/' }}
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="155px">
                <template slot-scope="scope">
                  <span @click="handleStudy(scope)">详情</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="paginatedData.length"
      :page-size="limit"
      :page-sizes="[10,15,25]"
      :current-page="page"
      layout="total, sizes,prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog
      :key="keys"
      title="学习中心"
      :visible.sync="dialogDisplay"
      width="70%"
      :destroy-on-close="true"
      :before-close="handleCloseDialog"
    >
      <fileStudy v-if="componentObj.name === 'fileStudy'" :child-data="childData" />
      <examStudy v-if="componentObj.name === 'examStudy'" :child-data="childData" :timer="timer" />
    </el-dialog>
  </div>
</template>

<script>
import { getTaskDetails } from '@/api/training'
import fileStudy from '@/views/training/components/learning/fileStudy.vue'
import examStudy from '@/views/training/components/learning/examStudy.vue'
import { generateID } from '@/utils/generateID'
import { deepClone } from '@/utils'
import {chi} from "pinyin/data/dict-zi-web";

export default {
  components: { fileStudy, examStudy },
  data() {
    return {
      // 表格数据
      originData: [],
      // 是否加载
      loading: true,
      // 分页
      limit: 15,
      page: 1,
      // dialog
      dialogDisplay: false,
      keys: null,
      componentObj: {
        name: null
      },
      childData: {},
      timer: true
    }
  },
  computed: {
    paginatedData() {
      const startIndex = (this.page - 1) * this.limit
      const endIndex = startIndex + this.limit
      return this.originData.slice(startIndex, endIndex)
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      getTaskDetails().then(res => {
        const { data } = res
        if (data) {
          this.originData = data
        } else {
          this.originData = []
        }
        this.loading = false
      })
    },
    // 翻页
    handleSizeChange(val) {
      this.limit = val
      this.page = 1
    },
    handleCurrentChange(val) {
      this.page = val
    },
    // 展开下拉
    async handleToggleExpand(row) {
      this.loading = true
      row.expanded = !row.expanded
      this.$nextTick(() => {
        this.$refs.table.toggleRowExpansion(row, row.expanded)
      })
      if (row.expanded) {
        // 此处是为了沿用培训管理的表格，将data数据扁平化
        const newData = []
        const array = [deepClone(row)].map(item => {
          item.taskFileList = item.taskFileList.concat(item.taskExamPaperList)
          delete item['taskExamPaperList']
          return item
        })
        array.map(item => {
          item.taskFileList.map(obj => {
            delete item['taskFileList']
            newData.push({ ...item, ...obj })
          })
        })
        row.data = newData
      }
      this.loading = false
    },
    // 过滤必修的数据
    filterIsRequired(isRequired) {
      if (isRequired) {
        return '必修'
      } else {
        return '选修'
      }
    },
    handleStudy({ row }) {
      this.childData = row
      if (row.fileName) {
        const { state } = row
        state === '待开始' || state === '进行中' ? this.setComponentObj('fileStudy') : state === '已完成' || state === '已逾期' ? this.setComponentObj('fileStudy') : this.$message.error('学习已结束')
      } else {
        const { examState } = row
        examState === '待开始' || examState === '进行中' ? this.setComponentObj('examStudy') : examState === '已完成' || examState === '已逾期' ? this.setComponentObj('examStudy') : this.$message.error('学习已结束')
      }
    },
    // 对于dialog的动态使用
    setComponentObj(name) {
      this.componentObj.name = name
      this.componentObj.key = generateID()
      this.dialogDisplay = true
    },
    // 用户在试图关闭答题窗口时发出提示
    async handleCloseDialog(done) {
      this.timer = false
      const { name } = this.componentObj
      const { examState } = this.childData
      if (examState === '已完成' || examState === '已逾期') {
        done()
      } else {
        let tips = null
        if (name === 'examStudy') {
          tips = '答题未结束，是否退出？'
        } else {
          tips = '学习未结束，是否退出？'
        }
        await this.$confirm(tips, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          done()
          setTimeout(() => {
            location.reload()
          }, 500)
        }).catch(() => {
          this.timer = true
        })
      }
    }
  }
}
</script>
