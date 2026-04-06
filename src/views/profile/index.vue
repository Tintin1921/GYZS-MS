<template>
  <div class="app-container">
    <div v-loading="loading" class="app-container" element-loading-text="操作处理中...">
      <h3 style="font-size: 18px;font-weight: 800;">修改用户名</h3>
      <el-form style="margin-top: 1rem">
        <el-form-item label="输入用户名">
          <el-input v-model.trim="userName" style="width: 20%" :disabled="true" />
        </el-form-item>
      </el-form>
      <h3 style="font-size: 18px;font-weight: 800;">修改密码</h3>
      <el-form>
        <span v-if="errorMessage" style="color: red;font-size: .2rem;font-weight: bold">{{ '·' + errorMessage }}</span>
        <el-form-item label="输入原密码">
          <el-input v-model.trim="oldPwd" style="width: 20%" show-password />
        </el-form-item>
        <el-form-item label="输入新密码">
          <el-input v-model.trim="newPwd" style="width: 20%" show-password />
        </el-form-item>
        <el-form-item label="再次新密码">
          <el-input v-model.trim="currentPwd" style="width: 20%" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="query-btn" @click="validatePassword">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import { getInfo } from '@/utils/auth'
import { updatePwd } from '@/api/user'

export default {
  name: 'Profile',
  data() {
    return {
      userName: null,
      employeeId: null,
      loading: false,
      oldPwd: null,
      newPwd: null,
      currentPwd: null,
      errorMessage: null
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      const info = JSON.parse(getInfo())
      console.log(info)
      this.employeeId = info.employeeId
      this.userName = info.username
    },
    validatePassword() {
      if (this.newPwd !== this.currentPwd) {
        this.errorMessage = '两次输入密码不符'
        return
      }
      if (this.newPwd.length < 8) {
        this.errorMessage = '密码长度至少为8位'
        return
      }
      const hasUpperCase = /[A-Z]/.test(this.newPwd)
      const hasLowerCase = /[a-z]/.test(this.newPwd)
      if (!hasUpperCase || !hasLowerCase) {
        this.errorMessage = '密码必须包含大小写字母'
        return
      }
      const unsafeChars = /[<>"'%;()&+$#^]/
      if (unsafeChars.test(this.newPwd)) {
        this.errorMessage = '密码不能包含特殊字符'
        return
      }
      this.loading = true
      this.submit()
    },
    submit() {
      const pwd = CryptoJS.SHA256(this.newPwd).toString()
      const oldPwd = CryptoJS.SHA256(this.oldPwd).toString()
      const obj = { 'employeeId': this.employeeId, 'oldPassword': oldPwd, 'password': pwd }
      updatePwd(obj).then(res => {
        const { data } = res
        if (data.message === '更新成功') {
          this.$message.success('更新成功')
        } else {
          this.$message.error('更新失败')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
