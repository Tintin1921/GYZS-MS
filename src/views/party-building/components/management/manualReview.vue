<template>
  <div class="container">
    <div class="header">
      <el-input v-model="queryList.title" class="header-input" placeholder="输入需查询的文章标题" @change="handleQueryTitle" />
      <el-select v-model="queryList.category" placeholder="选择需查询的文章类型" clearable @change="handleQueryCategory">
        <el-option v-for="item in category" :key="item.id" :value="item.name" />
      </el-select>
      <el-select v-model="queryList.state" placeholder="选择需查询的文章状态" clearable @change="handleQueryStates">
        <el-option v-for="(item, index) in states" :key="index" :value="item.value" />
      </el-select>
    </div>
    <el-table
      :key="key"
      v-loading="loading"
      fit
      border
      stripe
      height="55vh"
      :data="tableList"
      element-loading-text="数据加载..."
    >
      <el-table-column label="序号" type="index" align="center" width="75px" />
      <el-table-column label="标题" align="center">
        <template slot-scope="{row}">
          <a class="blueButton" @click="handleReadArticle(row)">{{ row.articleTitle }}</a>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="articleCategory" align="center" width="95px" />
      <el-table-column label="栏目" prop="articleColumn" align="center" width="95px" />
      <el-table-column label="发布人" prop="articleAuthorName" align="center" width="95px" />
      <el-table-column label="上传时间" prop="submitTime" align="center" width="205px" />
      <el-table-column label="审核状态" prop="auditState" align="center" width="115px">
        <template slot-scope="{row}">
          <el-tag :type="row.auditState === '待审核'? 'warning': row.auditState === '已驳回' ? 'danger' : 'success'">{{ row.auditState }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="state" align="center" width="115px">
        <template slot-scope="{row}">
          <div v-if="row.auditState === '待审核'">
            <a class="blueButton" style="color: #e6a23c;" @click="handlePassDoc(row)">通过</a>
            <el-divider direction="vertical" />
            <a class="redButton" @click="handleRefuseDoc(row)">驳回</a>
          </div>
          <div v-if="row.auditState === '已驳回'">
            <span style="color: #f56c6c">已驳回</span>
          </div>
          <div v-if="row.auditState === '已通过'">
            <span style="color: #67c23a">已通过</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <h5>总文章数量： 00 | 待审核文章数： 00 | 驳回文章数： 00</h5>
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
import pageRead from '@/views/party-building/components/partyBuilding/pageRead.vue'
import { audit, auditRecords, getCategory, getContext } from '@/api/partyBuilding'
import { generateID } from '@/utils/generateID'

export default {
  components: {
    pageRead
  },
  data() {
    return {
      loading: true,
      key: generateID(),
      queryList: {
        title: '',
        category: '',
        state: ''
      },
      category: [],
      articleData: {},
      display: false,
      states: [{ 'value': '未审核' }, { 'value': '已通过' }, { 'value': '已驳回' }],
      tableList: [],
      originList: []
    }
  },
  created() {
    // 获取文章类型的下拉选项
    getCategory().then(res => {
      const { data } = res
      this.category = data
    })
    auditRecords({ 'pageNumber': 1, 'pageSize': 999 }).then(res => {
      const { data } = res
      this.originList = data.records
      this.tableList = data.records
      this.loading = false
    })
  },
  methods: {
    handleQueryTitle() {
      if (!this.queryList.title.trim()) {
        this.tableList = this.originList
      } else {
        this.tableList = this.originList.filter(item => item.articleTitle.includes(this.queryList.title))
      }
    },
    handleQueryCategory() {
      if (!this.queryList.category.trim()) {
        this.tableList = this.originList
      } else {
        this.tableList = this.originList.filter(item => item.articleCategory === this.queryList.category)
      }
    },
    handleQueryStates() {
      if (!this.queryList.state.trim()) {
        this.tableList = this.originList
      } else {
        this.tableList = this.originList.filter(item => item.auditState === this.queryList.state)
      }
    },
    handleReadArticle(row) {
      this.loading = true
      const { articleId } = row
      getContext(articleId).then(res => {
        const { data } = res
        this.articleData = data
        this.loading = false
        this.display = true
      })
    },
    handlePassDoc(row) {
      const { auditRecordId } = row
      audit({ 'auditRecordId': auditRecordId, 'isPass': true, 'comment': 'string' }).then(() => {
        this.$message.success('审核通过！')
        row.auditState = '已通过'
        this.key = generateID()
      })
    },
    handleRefuseDoc(row) {
      const { auditRecordId } = row
      audit({ 'auditRecordId': auditRecordId, 'isPass': false, 'comment': 'string' }).then(() => {
        this.$message.error('审核未通过！')
        row.auditState = '已驳回'
        this.key = generateID()
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
  gap: 10px;
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

.redButton {
  color: #de454e;
}

.redButton:hover {
  color: #d77278;
}
</style>
