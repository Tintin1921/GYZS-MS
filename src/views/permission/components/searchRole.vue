<template>
  <div class="app-container" v-loading="loading" element-loading-text="数据加载中...">
    <el-card class="custom-card">
      <el-input v-model="searchUser" class="input" prefix-icon="el-icon-search" clearable placeholder="输入关键词模糊搜索职工" @input="handleSearch" />
      <el-table
        :data="tempTableList"
        height="40vh"
        class="table custom-table"
      >
        <el-table-column label="序号" type="index" align="center" width="80px" />
        <el-table-column label="工号" prop="workNo" align="center" width="120px" />
        <el-table-column label="姓名" prop="employeeName" align="center" width="250px" />
        <el-table-column label="岗位" prop="postName" align="center" width="250px" />
        <el-table-column label="角色" align="center" min-width="320px">
          <template slot-scope="{row}">
            <span v-for="(item, index) in row.roleList" :key="index">
              {{ item.roleName }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="button-container">
        <el-button type="primary" class="reset-btn" @click="handleCancel">关闭</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAllUserInfo } from '@/api/user'

export default {
  data() {
    return {
      loading: true,
      // 用户搜索
      searchUser: null,
      // 表格列表
      OriginTableList: [],
      // 临时表格列表
      tempTableList: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      // 获取所有职工列表
      getAllUserInfo({ 'pageNumber': 1, 'pageSize': 1000 }).then(res => {
        const { records } = res.data
        this.OriginTableList = this.tempTableList = records
        this.loading = false
      })
    },
    handleSearch() {
      if (this.searchUser.length === 0) {
        this.tempTableList = this.OriginTableList
      } else {
        this.tempTableList = this.OriginTableList.filter(item => item.employeeName.includes(this.searchUser))
      }
    },
    handleCancel() {
      this.$emit('handleCancelDisPlay', false)
    }
  }
}

</script>

<style lang="scss" scoped>

.input {
  width: 20%;
  padding: 5px;
  .el-input__inner {
    border-radius: 16px;
    border-color: #dcdfe6;
    transition: all 0.3s;
    &:hover {
      border-color: #c0c4cc;
    }
    &:focus {
      border-color: #409eff;
    }
  }
  ::v-deep .el-icon-search {
    font-size: 14px;
    color: #909399;
  }
}

.table {
  height: 40vh;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 10px;
  padding: 20px;
}
</style>

