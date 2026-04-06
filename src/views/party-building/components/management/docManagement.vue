<template>
  <div class="container">
    <div v-show="visibleDocFilter" class="header">
      <el-input v-model="queryList.title" placeholder="标题搜索" style="width: 200px; margin-right: 4px" @change="filterTitle" />
      <el-select v-model="queryList.categoryName" placeholder="类型筛选" style="margin-right: 4px" @change="filterCategory">
        <el-option v-for="item in category" :key="item.id" :value="item.name" />
      </el-select>
      <el-select v-model="queryList.columnName" placeholder="栏目筛选" @change="filterColumn">
        <el-option v-for="(item, index) in columns" :key="index" :value="item.columnName" />
      </el-select>
    </div>
    <el-table
      :key="key"
      v-loading="loading"
      fit
      border
      :data="tableList"
      :height="height"
      style="width: 100%"
      element-loading-text="数据加载..."
    >
      <el-table-column type="index" label="序号" align="center" width="90px" />
      <el-table-column prop="title" label="标题" align="center">
        <template slot-scope="{row}">
          <a class="blueButton">{{ row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="categoryName" label="类型" align="center" width="115px">
        <template slot-scope="{row}">
          <el-select v-model="row.categoryName" :disabled="true" @change="updateCategory(row)">
            <el-option v-for="item in category" :key="item.id" :value="item.name" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="columnName" label="栏目" align="center" width="130px">
        <template slot-scope="{row}">
          <el-select v-model="row.columnName" :disabled="true" @change="updateColumn(row)">
            <el-option v-for="(item, index) in columns" :key="index" :value="item.columnName" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="readCount" label="阅读次数" align="center" width="85px" />
      <el-table-column prop="authorName" label="发布人" align="center" width="105px" />
      <el-table-column prop="publishTime" label="发布时间" align="center" width="175px" />
      <el-table-column prop="auditorName" label="审核人" align="center" width="105px" />
      <el-table-column prop="auditTime" label="审核时间" align="center" width="175px" />
      <el-table-column prop="updaterName" label="更新人" align="center" width="105px" />
      <el-table-column prop="updateTime" label="更新时间" align="center" width="175px" />
      <el-table-column label="操作" align="center" width="175px">
        <template slot-scope="{row}">
          <el-button size="mini" type="success" @click="editArticle(row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteArticle(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="编辑文章"
      :visible.sync="display"
      :append-to-body="true"
      :destroy-on-close="true"
    >
      <tempContextEditor :articles="articles" :columns="columns" :category="category" />
    </el-dialog>
  </div>
</template>

<script>
import tempContextEditor from '@/views/party-building/components/management/tempContextEditor.vue'
import { generateID } from '@/utils/generateID'
import { delContext, getCategory, getColumns, getEditContext, queryAdminColumns } from '@/api/partyBuilding'

export default {
  components: {
    tempContextEditor
  },
  props: {
    visibleDocFilter: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      display: false,
      key: generateID(),
      height: '30vh',
      queryList: {
        title: '',
        columnName: '',
        categoryName: ''
      },
      columns: [],
      category: [],
      tableList: [],
      originList: [],
      articles: {}
    }
  },
  watch: {
    visibleDocFilter: {
      handler(val) {
        val ? this.height = '26vh' : this.height = '30vh'
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      // 获取文章分类
      await queryAdminColumns({ 'pageNumber': 1, 'pageSize': 999, 'state': '已发布' }).then(res => {
        const { data } = res
        this.originList = data.records
        this.tableList = data.records
      })
      // 获取文章类型的下拉选项
      await getCategory().then(res => {
        const { data } = res
        this.category = data
      })
      // 获取文章栏目的下拉选项
      await getColumns().then(res => {
        const { data } = res
        this.columns = data
      })
      this.loading = false
    },
    filterTitle() {
      if (!this.queryList.title.trim()) {
        this.tableList = this.originList
      } else {
        this.tableList = this.originList.filter(item => item.title.includes(this.queryList.title))
      }
    },
    filterColumn() {
      if (!this.queryList.columnName.trim()) {
        this.tableList = this.originList
      } else {
        this.tableList = this.originList.filter(item => item.columns === this.queryList.columns)
      }
    },
    filterCategory() {
      if (!this.queryList.categoryName.trim()) {
        this.tableList = this.originList
      } else {
        this.tableList = this.originList.filter(item => item.category === this.queryList.category)
      }
    },
    updateCategory(row) {
      console.log('更改文章类型')
    },
    updateColumn(row) {
      console.log('更改文章栏目')
    },
    editArticle(row) {
      const { articleId, categoryName, columnName } = row
      const { columnId } = this.columns.filter(item => item.columnName === columnName)[0]
      const { id } = this.category.filter(item => item.name === categoryName)[0]
      getEditContext(articleId).then(res => {
        const { data } = res
        this.articles = {
          ...data,
          columnId: columnId,
          categoryId: id
        }
        this.display = true
      })
    },
    deleteArticle(row) {
      this.$confirm('确认删除该文章吗？', '警告', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(async() => {
        const { articleId } = row
        delContext(articleId).then(() => {
          this.$message.success('操作成功')
          this.originList = this.originList.filter(item => item.articleId !== articleId)
          this.tableList = this.tableList.filter(item => item.articleId !== articleId)
          this.key = generateID()
        })
      }).catch(() => {
        this.$message.error('取消操作')
      })
    }
  }
}

</script>

<style scoped>
.container {
  height: 30vh;
}

.header {
  padding: 0 0 5px;
}

.blueButton {
  color: #409eff;
}

.blueButton:hover {
  color: #82b4e7;
}
</style>
