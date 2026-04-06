<template>
  <div class="app-container" v-loading="loading" element-loading-text="数据加载中...">
    <el-button-group>
      <el-button type="primary" class="query-btn" icon="el-icon-lock" @click="display = 'role'">角色成员管理</el-button>
      <el-button type="primary" class="query-btn" icon="el-icon-set-up" @click="display = 'menu'">菜单权限</el-button>
    </el-button-group>
    <div style="float: right;margin-right: .3rem;margin-top: 1rem">
      <span>共 {{ tableList.length }} 人</span>
    </div>
    <el-card class="custom-card">
      <div class="horizontal-layout">
        <el-tree
          v-show="display === 'menu'"
          ref="tree"
          class="tree custom-tree"
          :props="treeProps"
          :data="routeList"
          show-checkbox
          node-key="routeId"
          @check-change="handleCheck"
        />
        <div v-show="display === 'role'" class="tree-container">
          <el-input v-model="searchUser" class="input" prefix-icon="el-icon-search" clearable placeholder="输入关键词模糊搜索职工" @input="handleSearch" />
          <el-tree class="tree custom-tree" :props="treeProps" :data="userTempList" @node-click="handleCheckUser" />
        </div>
        <el-divider class="divider" direction="vertical" />
        <el-table
          v-show="display === 'role'"
          :data="tableList"
          height="50vh"
          class="table custom-table"
        >
          <el-table-column label="序号" type="index" align="center" width="80px" />
          <el-table-column label="工号" prop="workNo" align="center" width="160px" />
          <el-table-column label="姓名" prop="employeeName" align="center" min-width="120px" />
          <el-table-column label="岗位" prop="postName" align="center" width="300px" />
          <el-table-column label="操作" align="center" width="110px">
            <template slot-scope="{ row }">
              <el-button icon="el-icon-delete" style="color: #409eff" @click="deleteRole(row)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="button-container">
        <el-button type="primary" class="reset-btn" @click="handleCancel">取消</el-button>
        <el-button type="primary" class="query-btn" @click="handleConfirm">确定</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import routes from '@/views/permission/components/routes'
import { batchAssignRole, getRoleRouter, updateRoleInfo } from '@/api/role'
import {extractChildRoleIds, extractParentRoleIds, extractRoleIds} from '../components/extractRoleIds'
import { getAllUserInfo } from '@/api/user'

export default {
  props: {
    roleInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      // 用户原路由表
      originRouter: [],
      // 切换显示
      display: 'role',
      // 用户搜索
      searchUser: null,
      // 树形图列表
      routeList: [],
      userOriginList: [],
      userTempList: [],
      // 树形图配置
      treeProps: {
        label: 'path',
        children: 'children'
      },
      // 树形图默认选中项
      checkedKeys: [],
      // 表格列表
      tableList: []
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    const { route } = routes
    this.routeList = route
  },
  methods: {
    setHalfCheckedNodes(keys) {
      keys.forEach(key => {
        const node = this.$refs.tree.getNode(key)
        if (node) {
          node.indeterminate = true
          node.checked = false
        }
      })
    },
    async getData() {
      const { roleId } = this.roleInfo
      // 获取角色路由表
      getRoleRouter(roleId).then(res => {
        const { data } = res
        // 获取用户默认选中的权限表
        this.originRouter = data
        // 获取父子id
        const childId = extractChildRoleIds(this.originRouter)
        const parentId = extractRoleIds(this.originRouter).filter(item => !childId.includes(item))
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(parentId)
          this.setHalfCheckedNodes(childId)
        })
      })
      // 获取所有职工信息
      getAllUserInfo({ 'pageNumber': 1, 'pageSize': 1000 }).then(res => {
        const { records } = res.data
        records.map(item => {
          item.path = item.employeeName
        })
        this.userOriginList = records
        this.userTempList = records
        records.map(item => {
          const boolean = item.roleList.some(e => e.roleName === this.roleInfo.roleName)
          if (boolean) {
            item.roleName = this.roleInfo.roleName
            this.tableList.push(item)
          }
        })
        this.loading = false
      })
    },
    handleSearch() {
      if (this.searchUser.length === 0) {
        this.userTempList = this.userOriginList
      } else {
        this.userTempList = this.userOriginList.filter(item => item.employeeName.includes(this.searchUser))
      }
    },
    handleCheck() {
      const parentKeys = this.$refs.tree.getHalfCheckedKeys()
      this.checkedKeys = this.$refs.tree.getCheckedKeys().concat(parentKeys)
    },
    handleCheckUser(e) {
      const { workNo } = e
      const boolean = this.tableList.some(item => item.workNo === workNo)
      if (boolean) {
        this.$message.error('该职工已存在于该角色列表中，请勿重复添加')
      } else {
        this.tableList.unshift(e)
        this.$message.success('添加成功')
      }
    },
    deleteRole(row) {
      const index = this.tableList.findIndex(item => item.workNo === row.workNo)
      this.tableList.splice(index, 1)
      this.$message.success('删除成功')
    },
    handleConfirm() {
      this.$confirm('确认提交？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        if (this.display === 'menu') {
          const { roleId, roleName } = this.roleInfo
          const obj = {
            'roleName': roleName,
            'roleId': roleId,
            'routeIdList': this.checkedKeys,
            'method': 'patch'
          }
          updateRoleInfo(obj).then(res => {
            this.$message.success('提交成功')
            this.$emit('handleCancelDisPlay', false)
          })
        } else {
          const { roleId } = this.roleInfo
          this.tableList = this.tableList.map(item => {
            return item.employeeId
          })
          batchAssignRole({ 'roleId': roleId, 'employeeIdList': this.tableList }).then(() => {
            this.$message.success('提交成功')
            this.$emit('handleCancelDisPlay', false)
          })
        }
      }).catch(err => {
        console.error(err)
      })
    },
    handleCancel() {
      this.$emit('handleCancelDisPlay', false)
    }
  }
}

</script>

<style lang="scss" scoped>

.custom-card {
  position: relative;
}

.horizontal-layout {
  display: flex;
  align-items: stretch;
  gap: 10px;
}

.input {
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

.tree-container {
  flex: 0 0 250px;
  height: 50vh;
  //overflow: auto;
}

.tree {
  flex: 0 0 250px;
  height: 50vh;
}

.table {
  flex: 1;
  height: 50vh;
}

.divider {
  height: auto;
  margin: 0 10px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 10px;
  padding: 20px;
}

</style>

