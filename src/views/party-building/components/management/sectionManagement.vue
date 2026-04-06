<template>
  <div class="container">
    <el-tree
      :key="keys"
      :data="categoryTree"
      :props="categoryTreeProps"
      style="width: 20%"
      default-expand-all
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
      ref="dragTable"
      :data="carouselArray"
      row-key="columnId"
      border
      fit
      highlight-current-row
      height="30vh"
      style="width: 100%"
    >
      <el-table-column label="排序" align="center" width="55px">
        <template slot-scope="{}">
          <svg-icon class="drag-handler" icon-class="drag" />
        </template>
      </el-table-column>
      <el-table-column label="栏目名称" prop="columnName" align="center" min-width="150px" />
      <el-table-column label="布局类型" prop="layoutType" align="center" width="150px" />
      <el-table-column label="文章总数" prop="articleCount" align="center" width="150px" />
      <el-table-column label="创建人" prop="creatorName" align="center" width="150px" />
      <el-table-column label="状态" prop="isAble" align="center" width="180px">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.enabled"
            active-text="启用"
            inactive-text="禁用"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="110px">
        <template slot-scope="{row}">
          <el-tooltip placement="top" content="编辑板块图片">
            <el-button :disabled="row.layoutType!=='布局二'" size="mini" type="success">编辑</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { generateID } from '@/utils/generateID'
import Sortable from 'sortablejs'
import { getColumns } from '@/api/partyBuilding'

export default {
  data() {
    return {
      keys: '',
      sortable: null,
      categoryTree: [],
      carouselArray: [],
      categoryTreeProps: {
        label: 'columnName',
        children: 'children'
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      getColumns().then(res => {
        const { data } = res
        this.carouselArray = data
        this.categoryTree = [{ 'columnName': '党建', 'children': data }]
      })
      // 处理排序问题
      this.$nextTick(() => {
        this.setSort()
      })
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.carouselArray.splice(evt.oldIndex, 1)[0]
          this.carouselArray.splice(evt.newIndex, 0, targetRow)
          this.categoryTree[0].children = this.carouselArray
          this.keys = generateID()
        }
      })
    },
    handleRemoveCarouselItem(row) {
      this.$confirm('确认移除该板块吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        console.log('用户已移除该板块' + row)
      }).catch(() => {
        this.$message.error('用户取消操作')
      })
    },
    // 用户点击树形图
    handleNodeClick(data) {
      console.log(data)
    },
    // 编辑树形图
    handleEditTreeNode(node, data) {
      this.roleInfo = data
      this.roleInfo.display = false
      this.setComponentObj('编辑', 'editInfo', 30)
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

<style scoped>
.container {
  height: 30vh;
  display: flex;
}

.drag-handler{
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.blueButton {
  color: #409eff;
}

.blueButton:hover {
  color: #82b4e7;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  font-size: 14px;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
}
</style>
