<template>
  <div>
    <el-table
      v-loading="loading"
      :data="paginatedData"
      class="custom-table"
      element-loading-text="操作处理中..."
    >
      <el-table-column label="序号" type="index" align="center" width="95px" />
      <el-table-column label="分类" align="center" prop="skillCategory" width="155px" />
      <el-table-column label="名称" align="center" prop="fileName" min-width="135px" />
      <el-table-column label="上传人" align="center" prop="creatorName" width="155px" />
      <el-table-column label="上传时间" align="center" prop="createTime" width="255px" />
      <el-table-column label="操作" align="center" width="205px">
        <template slot-scope="{ row }">
          <button>
            <el-tooltip placement="top" content="点击删除文档">
              <span @click="handleDelete(row)">删除</span>
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
  </div>
</template>

<script>
import { fileDelete, getTrainingFile } from '@/api/training'

export default {
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
      page: 1
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
      getTrainingFile().then(res => {
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
    async handleDelete(row) {
      const { trainingFileId } = row
      this.$confirm('确认是否删除该文件', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const index = this.tempData.findIndex(item => item.trainingFileId === trainingFileId)
        this.tempData.splice(index, 1)
        fileDelete(trainingFileId).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message.error('用户取消操作')
      })
    }
  }
}
</script>
