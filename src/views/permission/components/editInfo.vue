<template>
  <div>
    <el-card style="padding: 8px">
      <div class="card">
        <div v-if="roleInfo.display" style="margin-top: 1.5rem;">
          <h1 class="title">角色名称</h1>
          <el-input v-model="data.roleName" placeholder="输入内容" />
        </div>
        <div style="margin-top: 1.5rem">
          <h1 class="title">分类名</h1>
          <el-input v-model="data.categoryName" :disabled="roleInfo.display" placeholder="输入内容" />
        </div>
        <div v-if="roleInfo.display" style="margin-top: 1.5rem">
          <h1 class="title">描述信息</h1>
          <el-input v-model="data.description" placeholder="输入内容" />
        </div>
      </div>
      <div class="bottomBtn">
        <el-button size="mini" type="primary" class="query-btn" @click="handleConfirm">确定</el-button>
        <el-button size="mini" type="primary" class="reset-btn" @click="handleCancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import {updateCategories, updateRoleInfo} from '@/api/role'

export default {
  props: {
    roleInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      data: {
        roleId: this.roleInfo.roleId,
        categoryName: this.roleInfo.categoryName,
        roleName: this.roleInfo.roleName,
        description: this.roleInfo.description
      }
    }
  },
  methods: {
    handleCancel() {
      this.$emit('handleCancelDisPlay', false)
    },
    handleConfirm() {
      this.$confirm('确认修改信息？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        if (this.roleInfo.display) {
          const { roleId, roleName, description } = this.data
          const obj = {
            'roleId': roleId,
            'roleName': roleName,
            'description': description,
            'method': 'patch',
            'isAble': true
          }
          updateRoleInfo(obj).then(res => {
            this.$message.success('提交成功')
            this.$emit('handleCancelDisPlay', false)
          })
        } else {
          const { categoryId } = this.roleInfo
          const { categoryName } = this.data
          updateCategories({ 'categoryId': categoryId, 'categoryName': categoryName }).then(res => {
            this.$message.success('提交成功')
            this.$emit('handleCancelDisPlay', false)
          })
        }
      }).catch(() => {
        this.$message.error('用户取消操作')
      })
    }
  }
}

</script>

<style lang="scss" scoped>
::v-deep .card {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  align-content: center;
  width: 60%;
}

::v-deep .title {
  font-size: 15px;
  font-weight: 400;
  margin-left: 40%;
}

::v-deep .el-input__inner {
  border: none;
  border-bottom: 1px solid black;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
  height: 28px;
  line-height: 28px;
  transition: border-color 0.3s;
}

::v-deep .el-input__inner:focus {
 border-bottom-color: #5c81de;
}

::v-deep .el-input__inner::placeholder {
  color: #999;
  font-size: 14px;
  transform: translateY(1px);
}

::v-deep .bottomBtn {
  margin-top: 2.5rem;
  display: flex;
  justify-content: center;
}
</style>
