<template>
  <div class="app-container">
    <el-card class="custom-card">
      <div class="horizontal-layout">
        <el-tree
          ref="tree"
          class="tree custom-tree"
          :props="treeProps"
          :data="routeList"
          show-checkbox
          node-key="routeId"
          :default-checked-keys="checkedKeys"
          @check-change="handleCheck"
        />
        <el-divider class="divider" direction="vertical" />
        <el-form ref="form" :model="selectData" :rules="rules">
          <el-form-item label="分类" prop="category">
            <el-select
              v-model="selectData.category"
              placeholder="请选分类"
              filterable
              clearable
            >
              <el-option
                v-for="item in treeData"
                :key="item.categoryId"
                :label="item.categoryName"
                :value="item.categoryName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="selectData.roleName" placeholder="输入内容" clearable />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="selectData.description" placeholder="输入内容" clearable />
          </el-form-item>
        </el-form>
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
import { updateRoleInfo } from '@/api/role';

export default {
  props: {
    treeData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // 树形图列表
      routeList: [],
      // 树形图配置
      treeProps: {
        label: 'path',
        children: 'children'
      },
      // 树形图默认选中项
      checkedKeys: [],
      // 用户选择的数据
      selectData: {
        category: null,
        roleName: null,
        description: '无'
      },
      // 表单校验规则
      rules: {
        'category': [{
          required: true, message: '请输入分类名', trigger: 'blur'
        }],
        'roleName': [{
          required: true, message: '请输入子角色名', trigger: 'blur'
        }]
      }
    }
  },
  mounted() {
    const { route } = routes
    this.routeList = route
  },
  methods: {
    handleCheck() {
      this.checkedKeys = this.$refs.tree.getCheckedKeys()
    },
    handleConfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm('确认创建？', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            this.checkedKeys.push(16)
            const { roleName, description, category } = this.selectData
            const { categoryId } = this.treeData.find(item => item.categoryName === category)
            const obj = {
              'roleName': roleName,
              'categoryId': categoryId,
              'isAble': true,
              'description': description,
              'routeIdList': this.checkedKeys,
              'method': 'post'
            }
            updateRoleInfo(obj).then(res => {
              this.$message.success('提交成功')
              setTimeout(() => {
                this.$emit('handleCancelDisPlay', false)
              }, 1000)
            })
          }).catch(() => {
            this.$message.error('用户取消操作')
          })
        } else {
          this.$message.error('校验失败')
        }
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
  margin-top: 1rem;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 20px;
}

</style>

