<template>
  <div class="app-container">
    <el-card class="custom-top-query-card" shadow="hover">
      <div class="card-header">
        <span icon="el-icon-search" class="title"><i slot="prefix" class="el-icon-s-fold custom-icon" />角色权限管理</span>
        <div class="header-actions">
          <el-tooltip content="操作指引">
            <el-button type="text" icon="el-icon-guide" @click.prevent.stop="guide" />
          </el-tooltip>
        </div>
      </div>
      <el-divider />
      <el-row :gutter="24" align="middle" class="query-row">
        <!-- 操作按钮 -->
        <el-col id="step1" :span="4">
          <el-tooltip placement="top" content="搜索角色名称">
            <el-input v-model="searchUser" placeholder="输入关键词模糊搜索角色" clearable style="width: 100%;margin-bottom: 10px" @input="handleSearch">
              <i slot="prefix" class="el-icon-search" style="line-height: 40px;vertical-align: middle" />
            </el-input>
          </el-tooltip>
        </el-col>
        <el-col :span="20">
          <el-tooltip id="step2" placement="top" content="点击新建角色">
            <el-button type="primary" icon="el-icon-circle-plus-outline" class="query-btn" @click="handleCreateRole">
              新建角色
            </el-button>
          </el-tooltip>
          <el-tooltip id="step3" placement="top" content="输入工号或姓名查询角色">
            <el-button type="info" icon="el-icon-user" class="query-btn" @click="handleSearchRole">
              职工信息查询
            </el-button>
          </el-tooltip>
          <el-tooltip placement="top" content="重置页面">
            <el-button type="info" icon="el-icon-refresh" class="reset-btn" @click="handleReset">
              重置
            </el-button>
          </el-tooltip>
        </el-col>
      </el-row>
    </el-card>
    <div class="treeAndTable">
      <el-tree
        id="step4"
        class="tree custom-tree"
        :data="treeData"
        :props="defaultTree"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <i class="el-icon-edit" @click="handleEditTreeNode(node, data)" />
            <i class="el-icon-delete" @click="handleDeleteTreeNode(node, data)" />
          </span>
        </span>
      </el-tree>
      <el-table
        id="step5"
        class="custom-table"
        :data="paginatedData"
        border
        fit
        stripe
        highlight-current-row
        :cell-style="{padding: '8px 0'}"
        :header-cell-style="{padding: '10px 0'}"
        v-loading="loading"
        element-loading-text="数据加载中..."
      >
        <el-table-column label="序号" type="index" align="center" width="100px" />
        <el-table-column label="角色名称" prop="roleName" align="center" />
        <el-table-column label="角色人数" align="center" width="100px">
          <template slot-scope="{ row }">
            {{ filterChildRoleCount(row) }}
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="categoryName" align="center" width="120px" />
        <el-table-column label="角色描述" prop="description" align="center" width="190px" />
        <el-table-column label="创建时间" prop="createTime" align="center" width="180px" />
        <el-table-column label="操作" align="center" width="330px">
          <template slot-scope="{ row }">
            <button>
              <span @click="handleEditInfo(row)">编辑</span>
            </button>
            <el-divider direction="vertical" />
            <button>
              <span @click="handleEditRole(row)">配置权限</span>
            </button>
            <el-divider direction="vertical" />
            <button>
              <span @click="deleteRole(row)">删除</span>
            </button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      :total="filteredData.length"
      :page-size="limit"
      :page-sizes="[10,15,25]"
      :current-page="page"
      style="margin-left: 18rem"
      layout="total, sizes,prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--  弹出功能窗  -->
    <el-dialog
      :key="componentObj.key"
      :title="componentObj.title"
      :visible.sync="dialogDisplay"
      :destroy-on-close="true"
      :width="componentObj.width"
    >
      <searchRole v-if="componentObj.name === 'searchRole'" @handleCancelDisPlay="handleCancelDisPlay" />
      <addRole v-if="componentObj.name === 'addRole'" :tree-data="treeData" @handleCancelDisPlay="handleCancelDisPlay" />
      <editInfo v-if="componentObj.name === 'editInfo'" :role-info="roleInfo" @handleCancelDisPlay="handleCancelDisPlay" />
      <editRole v-if="componentObj.name === 'editRole'" :role-info="roleInfo" @handleCancelDisPlay="handleCancelDisPlay" />
    </el-dialog>
  </div>
</template>

<script>
import { deleteRole, getPostCount, getRoleCategories, getRoleList } from '@/api/role'
import { generateID } from '@/utils/generateID'
import editInfo from '@/views/permission/components/editInfo.vue'
import editRole from '@/views/permission/components/editRole.vue'
import addRole from '@/views/permission/components/addRole.vue'
import searchRole from '@/views/permission/components/searchRole.vue'
import 'driver.js/dist/driver.min.css'
import Driver from 'driver.js'
import steps from './components/guideStep'

export default {
  components: {
    editInfo,
    editRole,
    addRole,
    searchRole
  },
  data() {
    return {
      // 全局变量
      originData: [],
      roleCount: [],
      loading: false,
      // 树形图
      keys: null,
      treeData: [],
      defaultTree: {
        children: 'children',
        label: 'categoryName'
      },
      // 组件变量
      roleInfo: {},
      // 分页
      limit: 15,
      page: 1,
      // 用户搜索
      searchUser: undefined,
      // 控制弹窗显示
      dialogDisplay: false,
      componentObj: {
        name: null,
        title: null,
        width: 0 + '%',
        key: null
      },
      // 所有角色名称的列表
      roleNameList: []
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
    // 默认加载设备角色
    this.handleNodeClick({ categoryId: 1 })
    this.getRoleList()
    // 初始化操作引导实例
    this.driver = new Driver()
  },
  methods: {
    // 操纵引导
    guide() {
      this.driver.defineSteps(steps)
      this.driver.start()
    },
    // 获取一级、二级角色的列表
    async getRoleList() {
      getRoleCategories().then(res => {
        const { data } = res
        // 构建树形图的数据结构
        this.treeData = data
      })
    },
    filterChildRoleCount(row) {
      const length = this.roleCount.length
      if (length > 0) {
        const obj = this.roleCount.find(item => item.roleName === row.roleName)
        return obj.count
      } else {
        return 0
      }
    },
    // 用户点击树形图
    handleNodeClick(data) {
      this.loading = true
      const { categoryId } = data
      getRoleList(categoryId).then(res => {
        const { data } = res
        this.originData = data
        this.loading = false
      })
      // 获取各角色下有多少人
      getPostCount().then(res => {
        const { data } = res
        this.roleCount = data
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
    // 重置页面
    handleReset() {
      this.tree = false
      this.$nextTick(() => {
        this.tree = true
      })
      this.searchUser = null
      this.$message.success('重置成功')
    },
    // 删除一级角色三重确认
    deleteRole(row) {
      this.$confirm('确认移除角色？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.$confirm('请再次确认，这项操作不可逆转！', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const { roleId } = row
          deleteRole(roleId).then(res => {
            this.$message.success('删除成功！')
            location.reload()
          })
        }).catch(() => {
          this.$message.error('用户取消操作')
        })
      }).catch(() => {
        this.$message.error('用户取消操作')
      })
    },
    // 对于dialog的动态使用
    setComponentObj(title, name, width) {
      this.componentObj.title = title
      this.componentObj.name = name
      this.componentObj.width = width + '%'
      this.componentObj.key = generateID()
      this.dialogDisplay = true
    },
    // 编辑角色信息
    handleEditInfo(row) {
      this.roleInfo = row
      this.roleInfo.display = true
      this.setComponentObj('编辑', 'editInfo', 30)
    },
    // 编辑树形图
    handleEditTreeNode(node, data) {
      this.roleInfo = data
      this.roleInfo.display = false
      this.setComponentObj('编辑', 'editInfo', 30)
    },
    // 关闭dialog后触发
    handleCancelDisPlay() {
      const { name } = this.componentObj
      this.dialogDisplay = false
      if (name === 'editInfo') {
        location.reload()
      }
    },
    // 配置角色权限
    handleEditRole(row) {
      this.roleInfo = row
      this.setComponentObj('配置权限', 'editRole', 70)
    },
    // 新建角色
    handleCreateRole() {
      this.setComponentObj('新建角色', 'addRole', 35)
    },
    // 查询职工信息
    handleSearchRole() {
      this.setComponentObj('职工信息查询', 'searchRole', 70)
    },
    // 删除树形图中的某一分支（该功能已完成开发，但并未开放使用
    handleDeleteTreeNode(node, data) {
      this.$confirm('确认删除？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.$confirm('再次确认是否删除？此操作不可逆！', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          this.$message.error('删除失败，请联系管理员')
          // const parent = node.parent
          // const children = parent.data.children || parent.data
          // const index = children.findIndex(d => d.roleId === data.roleId)
          // children.splice(index, 1)
          // this.$message.success('删除成功')
        }).catch(() => {
          this.$message.error('用户取消操作')
        })
      }).catch(() => {
        this.$message.error('用户取消操作')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.treeAndTable {
  display: flex;
  height: 65vh;
}

.tree {
  width: 15%;
  //overflow: auto;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  font-size: 14px;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
}

.el-icon-edit {
  cursor: pointer;
  color: #48a2ff;
}

.el-icon-delete {
  cursor: pointer;
  color: #48a2ff;
  margin-left: 4px;
}

.el-icon-delete:hover {
  opacity: 0.8;
}
</style>

