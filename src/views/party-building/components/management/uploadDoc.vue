<template>
  <div style="height: 35vh">
    <el-upload
      ref="upload"
      action="/api/training/files"
      :limit="3"
      :file-list="fileList"
      :auto-upload="false"
      :on-change="handleChange"
      :before-remove="beforeRemove"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :on-error="handleError"
      :http-request="customUploadMethod"
    >
      <el-button class="query-btn" size="small" type="primary" icon="el-icon-search">选取文件</el-button>
      <el-select v-for="(obj, index) in fileList" :key="index" v-model="obj.skillCategory" placeholder="请选择" class="selectOption">
        <el-option v-for="(item, num) in options" :key="num" :value="item.value" />
      </el-select>
      <div slot="tip" class="el-upload__tip">上传文件不超过3个（传输完成前请勿关闭该窗口）</div>
    </el-upload>
    <div class="dialog-footer" style="right: 1rem;bottom: 1rem;position: absolute">
      <el-button class="reset-btn" type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
      <el-button class="query-btn" type="primary" icon="el-icon-upload" @click="handleUploadFile">上传</el-button>
    </div>
  </div>
</template>

<script>
import { updateFileInfo } from '@/api/training'

export default {
  data() {
    return {
      fileList: [],
      options: [{ 'value': '党建要闻' }, { 'value': '学习语' }, { 'value': '理论强党' }, { 'value': '文明实践' }, { 'value': '基层党建' }, { 'value': '先锋模范' }, { 'value': '学史明理' }]
    }
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList
      const name = this.fileList.map(obj => obj.name)
      const boolean = new Set(name).size !== name.length
      if (boolean) {
        this.$message.error('请勿重复添加')
        this.fileList.pop()
      }
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleError() {
      this.$message.error('上传失败，请联系管理员')
    },
    handleReset() {
      this.fileList = []
    },
    handleUploadFile() {
      const boolean = this.fileList.every(item => item.hasOwnProperty('skillCategory'))
      if (!boolean) {
        this.$message.error('请选择上传资料分类')
        return
      }
      this.$refs.upload.submit()
    },
    customUploadMethod() {
      // 为适应后端要求 但因任务时间有限 修改不了源代码 故在这里整合一下数据格式
      const skillCategories = []
      this.fileList.map(item => {
        skillCategories.push(item.skillCategory)
      })
      const obj = {
        'skillCategories': skillCategories,
        'files': this.fileList.map(item => {
          delete item['skillCategory']
          return item
        })
      }
      const [boolean] = skillCategories
      if (boolean) {
        updateFileInfo(obj).then(() => {
          this.$message.success('上传成功')
          this.$refs.upload.abort()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.selectOption {
  margin-left: .1rem;
  width: 8rem;
}

::v-deep .el-select .el-input__inner {
  height: 2.2rem;
}

</style>
