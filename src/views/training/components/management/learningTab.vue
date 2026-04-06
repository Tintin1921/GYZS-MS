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
      <el-table-column label="序号" type="index" align="center" width="95px" />
      <el-table-column label="任务名称" align="center" prop="title" min-width="135px" />
      <el-table-column label="状态" align="center" prop="state" width="155px" />
      <el-table-column label="创建人" align="center" prop="creatorName" width="155px" />
      <el-table-column label="任务创建时间" align="center" prop="createTime" width="230px" />
      <el-table-column label="学习开始时间" align="center" prop="startTime" width="230px" />
      <el-table-column label="学习结束时间" align="center" prop="endTime" width="230px" />
      <el-table-column label="操作" align="center" width="205px">
        <template slot-scope="{ row }">
          <el-tooltip placement="left" content="点击查看详情">
            <span @click.stop="handleToggleExpand(row)">详情</span>
          </el-tooltip>
          <el-divider direction="vertical" />
          <span @click.stop="handleDelete(row)">删除</span>
        </template>
      </el-table-column>
      <el-table-column type="expand" align="center" width="1px">
        <template slot-scope="{ row }">
          <div v-if="row.expanded">
            <el-table
              v-loading="loading"
              :data="row.data"
              height="300px"
              style="margin-left: 100px;"
              :span-method="(param) => spanMethod(param, row.data)"
              element-loading-text="操作处理中..."
            >
              <el-table-column label="子序号" type="index" align="center" width="95px">
                <template slot-scope="scope">
                  <span>{{ getSerialNumber(scope.$index, row.data) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="姓名" prop="employeeName" align="center" width="130px" />
              <el-table-column label="工号" prop="workNo" align="center" width="130px" />
              <el-table-column label="岗位" prop="postName" align="center" width="130px" />
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
                  {{ scope.row.obtainedTotalScore !== undefined ? scope.row.obtainedTotalScore : '/' }}
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="95px">
                <template slot-scope="scope">
                  <span @click="handleSetScore(scope)">{{ scope.row.examState === undefined ? '/' : scope.row.examState === '评分中' || scope.row.examState === '已完成' || scope.row.examState === '已逾期' ? '详情' : '/' }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="filteredData.length"
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
    >
      <examStudy :child-data="childData" :timer="timer" />
    </el-dialog>
  </div>
</template>

<script>
import { delOrder, learningOrder, orderDetails } from '@/api/training'
import examStudy from '@/views/training/components/learning/examStudy.vue'

export default {
  components: { examStudy },
  props: {
    searchUser: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {
      // 表格数据
      originData: [],
      // 是否加载
      loading: true,
      // 分页
      limit: 15,
      page: 1,
      childData: {},
      dialogDisplay: false,
      keys: null,
      timer: false
    }
  },
  computed: {
    filteredData() {
      const keyword = this.searchUser
      if (keyword === undefined) {
        return this.originData
      } else {
        return this.originData.filter(item =>
          Object.values(item).some(val =>
            String(val).includes(keyword)
          )
        )
      }
    },
    paginatedData() {
      const startIndex = (this.page - 1) * this.limit
      const endIndex = startIndex + this.limit
      return this.filteredData.slice(startIndex, endIndex)
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      learningOrder({ 'pageNumber': 1, 'pageSize': 1000 }, 'get').then(res => {
        this.originData = res.data
        this.loading = false
      })
    },
    // 模糊搜索以及翻页
    handleSearch() {
      this.page = 1
    },
    handleSizeChange(val) {
      this.limit = val
      this.page = 1
    },
    handleCurrentChange(val) {
      this.page = val
    },
    async handleDelete(row) {
      const { taskId } = row
      this.$confirm('确认是否删除该培训任务', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const index = this.originData.findIndex(item => item.taskId === taskId)
        this.originData.splice(index, 1)
        delOrder(taskId).then(() => {
          this.$message.success('删除成功！')
        })
      }).catch(() => {
        this.$message.error('用户取消操作')
      })
    },
    async handleToggleExpand(row) {
      this.loading = true
      row.expanded = !row.expanded
      this.$nextTick(() => {
        this.$refs.table.toggleRowExpansion(row, row.expanded)
      })
      await orderDetails(row.taskId).then(res => {
        // 此处目的是为了将data数据扁平化
        const { data } = res
        console.log(data)
        data.forEach(item => {
          item.taskFileList = item.taskFileList.concat(item.taskExamPaperList)
          delete item['taskExamPaperList']
          return item
        })
        const newData = []
        data.map(item => {
          item.taskFileList.map(obj => {
            newData.push({ ...item, ...obj })
          })
        })
        row.data = newData
        this.loading = false
      })
    },
    // 控制表格合并(工号一样则合并)
    spanMethod({ rowIndex, columnIndex }, data) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4) {
        if (rowIndex > 0 && data[rowIndex].workNo === data[rowIndex - 1].workNo) {
          // 当前单元格隐藏
          return { rowspan: 0, colspan: 0 }
        } else {
          // 当前单元格占据多行
          return { rowspan: this.getDepartmentRowspan(rowIndex, data), colspan: 1 }
        }
      }
      // 正常显示
      return { rowspan: 1, colspan: 1 }
    },
    // 获取当前rowindex占取的行数
    getDepartmentRowspan(rowIndex, data) {
      const workNo = data[rowIndex].workNo
      let rowspan = 1
      for (let i = rowIndex + 1; i < data.length; i++) {
        if (data[i].workNo === workNo) {
          rowspan++
        } else {
          break
        }
      }
      return rowspan
    },
    // 对合并后的行进行编号
    getSerialNumber(rowIndex, data) {
      let serialNumber = 1
      for (let i = 0; i <= rowIndex; i++) {
        if (i > 0 && data[i].workNo !== data[i - 1]?.workNo) {
          serialNumber++
        }
      }
      return serialNumber
    },
    // 过滤必修的数据
    filterIsRequired(isRequired) {
      if (isRequired) {
        return '必修'
      } else {
        return '选修'
      }
    },
    handleSetScore({ row }) {
      const { examState } = row
      if (examState === '评分中' || examState === '已完成' || examState === '已逾期') {
        const { taskExamConfigId } = row
        this.childData = row.taskFileList.find(item => item.taskExamConfigId === taskExamConfigId)
        this.dialogDisplay = true
      }
    }
  }
}
</script>
