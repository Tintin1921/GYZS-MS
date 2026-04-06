<template>
  <div>
    <el-table
      v-loading="loading"
      :data="paginatedData"
      class="custom-table"
      element-loading-text="操作处理中..."
    >
      <el-table-column label="序号" type="index" align="center" width="115px" />
      <el-table-column label="姓名" align="center" prop="employeeName" width="185px" />
      <el-table-column label="工号" align="center" prop="workNum" width="155px" />
      <el-table-column label="岗位" align="center" prop="postName" width="155px" />
      <el-table-column label="总学习时长(min)" align="center" prop="totalStudyTimeSeconds" width="135px" />
      <el-table-column label="总培训任务数(次)" align="center" prop="totalTaskCount" width="135px" />
      <el-table-column label="完成培训任务数(次)" align="center" prop="completedTaskCount" width="150px" />
      <el-table-column label="答题平均得分" align="center" prop="examAverageScore" width="135px" />
      <el-table-column label="最后一次参加的培训" align="center" prop="lastVisitTaskTitle" min-width="100px">
        <template slot-scope="{row}">
          {{ row.lastVisitTaskTitle === null ? '未参加过培训' : row.lastVisitTaskTitle }}
        </template>
      </el-table-column>
      <el-table-column label="最后一次参加培训的时间" align="center" prop="lastVisitTime" width="195px">
        <template slot-scope="{row}">
          {{ row.lastVisitTaskTitle === null ? '1971-01-01 00:00:01' : row.lastVisitTaskTitle }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="115px">
        <template slot-scope="{ row }">
          <button>
            <el-tooltip placement="left" content="点击查看详情">
              <span @click="handleDetails(row)">详情</span>
            </el-tooltip>
          </button>
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
      :title="employeeName + '的培训详情'"
      :visible.sync="dialogDisplay"
      :destroy-on-close="true"
      width="70%"
    >
      <learningById :employee-id="employeeId" />
    </el-dialog>
  </div>
</template>

<script>
import { getTaskSummary } from '@/api/training'
import { generateID } from '@/utils/generateID'
import learningById from '@/views/training/components/management/learningById.vue'

export default {
  components: { learningById },
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
      dialogDisplay: false,
      keys: null,
      employeeId: 0,
      employeeName: null
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
      getTaskSummary({ 'pageNumber': 1, 'pageSize': 1000 }).then(res => {
        const { data } = res
        this.originData = data
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
    handleDetails(row) {
      this.dialogDisplay = true
      this.keys = generateID()
      const { employeeName, employeeId } = row
      this.employeeName = employeeName
      this.employeeId = employeeId
    }
  }
}
</script>
