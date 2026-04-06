<template>
  <div class="container">
    <div class="header">
      <el-input v-model="queryList.title" class="header-input" placeholder="输入需查询的文章标题" @change="handleQueryTitle" />
      <el-select v-model="queryList.category" style="width: 10%" clearable placeholder="文章类型" @change="handleQueryCategory">
        <el-option v-for="item in categories" :key="item.id" :value="item.name" />
      </el-select>
      <el-select v-model="queryList.column" style="width: 10%" clearable placeholder="文章栏目" @change="handleQueryColumn">
        <el-option v-for="(item, index) in columns" :key="index" :value="item.columnName" />
      </el-select>
    </div>
    <el-table
      v-loading="loading"
      fit
      border
      stripe
      height="55vh"
      :data="tableList"
      element-loading-text="数据加载..."
    >
      <el-table-column label="序号" type="index" align="center" width="55px" />
      <el-table-column label="标题" prop="title" align="center">
        <template slot-scope="{row}">
          <a class="blueButton" @click="handleViewArticle(row)">{{ row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="categoryName" align="center" width="95px" />
      <el-table-column label="栏目" prop="columnName" align="center" width="155px" />
      <el-table-column label="发布人" prop="authorName" align="center" width="100px" />
      <el-table-column label="发布时间" prop="publishTime" align="center" width="185px" />
      <el-table-column label="更新人" prop="updaterName" align="center" width="100px" />
      <el-table-column label="更新时间" prop="updateTime" align="center" width="185px" />
      <el-table-column label="操作" align="center" width="65px">
        <template slot-scope="{row}">
          <a class="blueButton" @click="handleAddCarouselItem(row)">添加</a>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <h5>当前已添加的轮播数： 00</h5>
    </div>

    <el-dialog
      title="预览文章"
      :visible.sync="display"
      :append-to-body="true"
      :destroy-on-close="true"
    >
      <pageRead :article-data="articleData" />
    </el-dialog>
  </div>
</template>

<script>
import {getCategory, getColumns, getContext, queryAdminColumns, uploadCarousel} from '@/api/partyBuilding'
import pageRead from '@/views/party-building/components/partyBuilding/pageRead.vue'

export default {
  components: { pageRead },
  data() {
    return {
      loading: false,
      display: false,
      queryList: {
        title: '',
        category: '',
        column: ''
      },
      articleData: {},
      originList: [],
      tableList: [],
      categories: [],
      columns: []
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
        this.categories = data
      })
      // 获取文章栏目的下拉选项
      await getColumns().then(res => {
        const { data } = res
        this.columns = data
      })
      this.loading = false
    },
    handleQueryTitle() {
      if (!this.queryList.title.trim()) {
        this.tableList = this.originList
      } else {
        this.tableList = this.originList.filter(item => item.title.includes(this.queryList.title))
      }
    },
    handleQueryCategory() {
      if (!this.queryList.category.trim()) {
        this.tableList = this.originList
      } else {
        this.tableList = this.originList.filter(item => item.categoryName === this.queryList.category)
      }
    },
    handleQueryColumn() {
      if (!this.queryList.column.trim()) {
        this.tableList = this.originList
      } else {
        this.tableList = this.originList.filter(item => item.columnName === this.queryList.column)
      }
    },
    handleViewArticle(row) {
      this.loading = true
      const { articleId } = row
      getContext(articleId).then(res => {
        const { data } = res
        this.articleData = data
        this.loading = false
        this.display = true
      })
    },
    handleAddCarouselItem(row) {
      this.loading = true
      const { articleId } = row
      uploadCarousel({ 'articleId': articleId }).then(() => {
        this.loading = false
        this.$message.success('添加成功')
      })
    }
  }
}
</script>

<style scoped>
.container {
  height: 65vh;
}

.header {
  display: flex;
  gap: 8px;
  padding: 0 0 10px;
}

.header-input {
  width: 20%;
}

.blueButton {
  color: #409eff;
}

.blueButton:hover {
  color: #82b4e7;
}
</style>
