<template>
  <div class="app-container">
    <!--  顶部步骤条  -->
    <div class="top-steps">
      <el-steps class="steps" :active="step - 1" finish-status="success">
        <el-step title="选择资料" />
        <el-step title="选择试题" />
        <el-step title="填写详情" />
        <el-step title="选择职工" />
        <el-step title="完成下发" />
      </el-steps>
    </div>
    <!--  中部显示区域  -->
    <div class="mid-center">
      <transition name="fade" mode="out-in">
        <div :key="step">
          <!--  第一步：选择资料  -->
          <div v-if="step === 1">
            <div class="filter-container">
              <el-input v-model="searchFile" placeholder="输入关键词模糊搜索" clearable style="width: 20%;">
                <i slot="prefix" class="el-icon-search" style="line-height: 40px;vertical-align: middle" />
              </el-input>
              <div class="tips">
                <h5>共添加： {{ checked.doc.length }}项</h5>
              </div>
              <el-table
                v-loading="loading"
                :data="filterFileData"
                style="height: 40vh;overflow: auto"
                element-loading-text="操作处理中..."
              >
                <el-table-column label="序号" type="index" align="center" width="95px" />
                <el-table-column label="分类" align="center" prop="skillCategory" width="155px" />
                <el-table-column label="名称" align="center" prop="fileName" min-width="135px" />
                <el-table-column label="上传人" align="center" prop="creatorName" width="155px" />
                <el-table-column label="上传时间" align="center" prop="createTime" width="255px" />
                <el-table-column label="操作" align="center" width="205px">
                  <template slot-scope="{row}">
                    <el-button v-if="!isInList(row)" size="mini" type="primary" class="query-btn" @click="handleAddDoc(row)">添加</el-button>
                    <el-button v-if="isInList(row)" size="mini" type="primary" class="delete-btn" @click="handleDeleteDoc(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div v-if="step === 2">
            <!--  第二步：选择题库  -->
            <div class="filter-container">
              <el-input v-model="searchBank" placeholder="输入关键词模糊搜索" clearable style="width: 20%;">
                <i slot="prefix" class="el-icon-search" style="line-height: 40px;vertical-align: middle" />
              </el-input>
              <div class="tips">
                <h5>共添加： {{ checked.bank.length }}项</h5>
              </div>
              <el-table
                :data="filterBankData"
                style="height: 40vh;overflow: auto"
              >
                <el-table-column label="序号" type="index" align="center" width="80px" />
                <el-table-column label="题库" align="center" min-width="130px">
                  <template slot-scope="{row}">
                    {{ row.questionBankName.split('-').shift() }}
                  </template>
                </el-table-column>
                <el-table-column label="等级" align="center" width="150px">
                  <template slot-scope="{row}">
                    {{ row.questionBankName.split('-').pop() }}
                  </template>
                </el-table-column>
                <el-table-column label="选择题数" prop="multipleChoiceCount" align="center" width="95px" />
                <el-table-column label="填空题数" prop="fillBankCount" align="center" width="95px" />
                <el-table-column label="判断题数" prop="judgementCount" align="center" width="95px" />
                <el-table-column label="简答题数" prop="shortAnswerCount" align="center" width="95px" />
                <el-table-column label="操作" align="center" width="120px">
                  <template slot-scope="{row}">
                    <el-button v-if="!isTaskInList(row)" size="mini" type="primary" @click="handleAddTask(row)">添加</el-button>
                    <el-button v-if="isTaskInList(row)" size="mini" type="danger" @click="handleDeleteBank(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div v-if="step === 3">
            <!--  第三步：填写详情  -->
            <div>
              <h3>学习起始时间:</h3>
              <el-date-picker
                v-model="checked.time"
                style="margin-left: .1rem"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </div>
            <div style="align-items: center">
              <h3>文档详情:</h3>
              <el-table
                :show-header="false"
                :data="checked.doc"
                border
                fit
                style="height: 13vh;overflow: auto"
              >
                <el-table-column type="index" align="center" width="95px" />
                <el-table-column prop="fileName" align="center" min-width="95px" />
                <el-table-column prop="skillCategory" align="center" width="100px" />
                <el-table-column align="center" width="160px">
                  <template slot-scope="{row}">
                    <el-switch
                      v-model="row.isRequired"
                      active-text="必修"
                      inactive-text="选修"
                    />
                  </template>
                </el-table-column>
                <el-table-column prop="questionBankName" align="center" width="270px">
                  <template slot-scope="{row}">
                    阅读时长(min) <el-input-number v-model="row.readTime" size="mini" :min="0" />
                  </template>
                </el-table-column>
                <el-table-column align="center" width="160px">
                  <template slot-scope="{row}">
                    <el-button size="mini" type="danger" @click="handleDeleteDoc(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div style="align-items: center">
              <h3>试题详情:</h3>
              <el-table
                :show-header="false"
                :data="checked.bank"
                border
                fit
                style="height: 14vh;overflow: auto"
              >
                <el-table-column type="index" align="center" width="95px" />
                <el-table-column prop="questionBankName" align="center" min-width="95px">
                  <template slot-scope="{row}">
                    {{ row.questionBankName.split('-').shift() }}
                  </template>
                </el-table-column>
                <el-table-column align="center" width="100px">
                  <template slot-scope="{row}">
                    {{ row.questionBankName.split('-').pop() }}
                  </template>
                </el-table-column>
                <el-table-column prop="skillCategory" align="center" width="170px">
                  <template slot-scope="{row}">
                    答题时长(min) <el-input-number v-model="row.timeLimitSeconds" size="mini" :min="0" />
                  </template>
                </el-table-column>
                <el-table-column prop="skillCategory" align="center" width="170px">
                  <template slot-scope="{row}">
                    填空题({{ row.fillBankCount }}) <el-input-number v-model="row.fillBankNum" size="mini" :max="row.fillBankCount" :min="0" />
                  </template>
                </el-table-column>
                <el-table-column prop="skillCategory" align="center" width="170px">
                  <template slot-scope="{row}">
                    选择题({{ row.multipleChoiceCount }}) <el-input-number v-model="row.multipleChoiceNum" size="mini" :max="row.multipleChoiceCount" :min="0" />
                  </template>
                </el-table-column>
                <el-table-column prop="skillCategory" align="center" width="170px">
                  <template slot-scope="{row}">
                    判断题({{ row.judgementCount }}) <el-input-number v-model="row.judgementNum" size="mini" :max="row.judgementCount" :min="0" />
                  </template>
                </el-table-column>
                <el-table-column prop="skillCategory" align="center" width="170px">
                  <template slot-scope="{row}">
                    简答题({{ row.shortAnswerCount }}) <el-input-number v-model="row.shortAnswerNum" size="mini" :max="row.shortAnswerCount" :min="0" />
                  </template>
                </el-table-column>
                <el-table-column align="center" width="160px">
                  <template slot-scope="{row}">
                    <el-button size="mini" type="danger" @click="handleDeleteBank(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div v-if="step ===4">
            <el-card class="custom-card">
              <el-input v-model="searchUser" style="width: 20%" prefix-icon="el-icon-search" clearable placeholder="输入关键词模糊搜索职工" @input="handleSearchUser" />
              <el-select
                v-model="checked.select"
                placeholder="请选择岗位"
                style="margin-left: .5rem"
                clearable
                @change="handleChangeSelect"
              >
                <el-option
                  v-for="item in userSelectOption"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-tooltip placement="top" content="将列表中的所有人都添加到列表中">
                <el-button style="margin-left: .5rem" type="primary" class="query-btn" @click="handleAddAllUser">全部添加</el-button>
              </el-tooltip>
              <el-tooltip placement="top" content="重置选择列表">
                <el-button style="margin-left: .5rem" type="primary" class="reset-btn" @click="handleResetUserList">重置列表</el-button>
              </el-tooltip>
              <div class="tips">
                <h5>共添加： {{ checked.user.length }}人</h5>
              </div>
              <el-table
                :data="tempUserList"
                style="height: 37vh;overflow: auto"
              >
                <el-table-column label="序号" type="index" align="center" width="80px" />
                <el-table-column label="工号" prop="workNo" align="center" width="120px" />
                <el-table-column label="姓名" prop="employeeName" align="center" width="250px" />
                <el-table-column label="岗位" prop="postName" align="center" width="250px" />
                <el-table-column label="角色" align="center" min-width="300px">
                  <template slot-scope="{row}">
                    <span v-for="(item, index) in row.roleList" :key="index">
                      {{ item.roleName }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120px">
                  <template slot-scope="{row}">
                    <el-button v-if="!isUserInList(row)" size="mini" type="primary" @click="handleAddUser(row)">添加</el-button>
                    <el-button v-if="isUserInList(row)" size="mini" type="danger" @click="handleDeleteUser(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
          <div v-if="step === 5">
            <h3>培训任务详情:</h3>
            <li>培训课件共 {{ checked.doc.length }} 项</li>
            <li>培训试题共 {{ checked.bank.length }} 套</li>
            <li>此次培训共 {{ checked.user.length }} 人参加</li>
            <li>培训开始时间 {{ checked.time[0].toLocaleString() }}</li>
            <li>培训结束时间 {{ checked.time[1].toLocaleString() }}</li>
            <h3>为这次培训创建一个名称:</h3>
            <el-input v-model="checked.title" placeholder="请输入..." style="width: 30%;margin-bottom: .5rem" />
          </div>
        </div>
      </transition>
    </div>
    <div class="dialog-footer">
      <el-button v-if="step > 1" type="primary" :disabled="step === 1" @click="prevStep"><i class="el-icon-arrow-left el-icon--left" />返回</el-button>
      <el-button v-if="step < 5" type="primary" :disabled="step === 5" @click="nextStep">继续<i class="el-icon-arrow-right el-icon--right" /></el-button>
      <el-button v-if="step === 5" type="success" @click="handleConfirm">提交 <i class="el-icon-check" /></el-button>
    </div>
  </div>
</template>

<script>
import { learningOrder, getQuestionsBand, getTrainingFile } from '@/api/training'
import { getAllUserInfo } from '@/api/user'

export default {
  data() {
    return {
      // 全局变量
      checked: {
        doc: [],
        bank: [],
        user: [],
        select: null,
        title: undefined
      },
      // 第一步
      step: 1,
      loading: true,
      searchFile: undefined,
      docList: [],
      // 第二步
      searchBank: undefined,
      questionBanks: [],
      // 第三步
      repeatOrder: false,
      // 第四步
      searchUser: null,
      OriginUserList: [],
      tempUserList: [],
      userSelectOption: []
    }
  },
  computed: {
    filterFileData() {
      const keyword = this.searchFile
      if (keyword === undefined) {
        return this.docList
      } else {
        return this.docList.filter(item =>
          Object.values(item).some(val =>
            String(val).includes(keyword)
          )
        )
      }
    },
    filterBankData() {
      const keyword = this.searchBank
      if (keyword === undefined) {
        return this.questionBanks
      } else {
        return this.questionBanks.filter(item =>
          Object.values(item).some(val =>
            String(val).includes(keyword)
          )
        )
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 获取培训资料和题库
    getData() {
      getTrainingFile().then(res => {
        const { data } = res
        this.docList = data
        this.loading = false
      })
      getQuestionsBand().then(res => {
        const { data } = res
        this.questionBanks = data
      })
      // 获取所有职工列表
      getAllUserInfo({ 'pageNumber': 1, 'pageSize': 1000 }).then(res => {
        const { records } = res.data
        const postName = [...new Set(records.map(item => item.postName))]
        postName.map((item, index) => {
          const obj = {
            'index': index,
            'label': item,
            'value': item
          }
          this.userSelectOption.push(obj)
        })
        const obj = {
          'index': this.userSelectOption.length + 1,
          'label': '已添加',
          'value': '已添加'
        }
        this.userSelectOption.unshift(obj)
        this.OriginUserList = this.tempUserList = records
      })
    },
    // 下一步
    nextStep() {
      if (this.step === 2 && this.checked.bank.length === 0) {
        this.$message.error('至少添加一套试题')
        return
      }
      if (this.step === 3) {
        // 判断学习日期范围是否填写
        const date = this.checked.time
        // 判断学习时长是否填写
        const readTime = this.checked.doc.some(item => item.readTime === undefined)
        // 判断试题数量是否填写
        const bankNum = this.checked.bank.some(obj => Object.values(obj).includes(undefined))
        if (readTime === true || bankNum === true || date === undefined) {
          this.$message.error('请将学习时长或试题数填写完整')
          return
        }
      }
      if (this.step === 4 && this.checked.user.length === 0) {
        this.$message.error('至少添加一位添加参加培训的职工')
        return
      }
      if (this.step < 5) {
        this.step++
      }
    },
    // 上一步
    prevStep() {
      if (this.step > 1) {
        this.step--
      }
    },
    // 第一步
    // 判断培训列是否在列表中
    isInList(row) {
      return this.checked.doc.some(obj => obj.fileName === row.fileName)
    },
    // 添加培训资料
    handleAddDoc(row) {
      const { fileName, skillCategory, trainingFileId } = row
      this.checked.doc.push({ 'fileName': fileName, 'skillCategory': skillCategory, 'isRequired': false, 'trainingFileId': trainingFileId })
    },
    // 删除培训资料
    handleDeleteDoc(row) {
      const index = this.checked.doc.findIndex(item => item.trainingFileId === row.trainingFileId)
      if (index > -1) {
        this.checked.doc.splice(index, 1)
      }
    },
    // 模糊搜索
    handleSearch() {
      this.page = 1
    },
    // 更改页面显示行数
    handleSizeChange(val) {
      this.limit = val
      this.page = 1
    },
    // 翻页
    handleCurrentChange(val) {
      this.page = val
    },
    // 第二步
    // 判断所选题库是否在列表中
    isTaskInList(row) {
      return this.checked.bank.some(obj => obj.questionBankId === row.questionBankId)
    },
    handleAddTask(row) {
      this.checked.bank.push(row)
    },
    handleDeleteBank(row) {
      const index = this.checked.bank.findIndex(item => item.questionBankId === row.questionBankId)
      if (index > -1) {
        this.checked.bank.splice(index, 1)
      }
    },
    // 第四步
    handleSearchUser() {
      if (this.searchUser.length === 0) {
        this.tempUserList = this.OriginUserList
      } else {
        this.tempUserList = this.OriginUserList.filter(item => item.employeeName.includes(this.searchUser))
      }
    },
    isUserInList(row) {
      return this.checked.user.some(obj => obj.employeeId === row.employeeId)
    },
    handleAddUser(row) {
      this.checked.user.push(row)
    },
    handleDeleteUser(row) {
      const index = this.checked.user.findIndex(item => item.employeeId === row.employeeId)
      if (index > -1) {
        this.checked.user.splice(index, 1)
      }
    },
    handleChangeSelect() {
      const { select } = this.checked
      if (select === '') {
        this.tempUserList = this.OriginUserList
      } else if (select === '已添加') {
        this.tempUserList = this.checked.user
      } else {
        this.tempUserList = this.OriginUserList.filter(item => item.postName.includes(select))
      }
    },
    handleAddAllUser() {
      this.checked.user = this.checked.user.concat(this.tempUserList)
      this.checked.user = [...new Set(this.checked.user)]
    },
    handleResetUserList() {
      this.checked.user = []
      this.tempUserList = this.OriginUserList
      this.searchUser = null
      this.checked.select = null
    },
    // 第五步
    handleConfirm() {
      if (this.checked.title === undefined) {
        this.$message.error('请输入此次培训任务的名称')
        return
      }
      const { title, time, user } = this.checked
      const [startTime, endTime] = time
      const doc = this.checked.doc.map(item => {
        item.readTime = item.readTime * 60
        return item
      })
      const bank = this.checked.bank.map(item => {
        item.timeLimitSeconds = item.timeLimitSeconds * 60
        item.fillBankCount = item.fillBankNum
        item.judgementCount = item.fillBankNum
        item.multipleChoiceCount = item.fillBankNum
        item.shortAnswerCount = item.fillBankNum
        return item
      })
      const obj = {
        'title': title,
        'startTime': startTime,
        'endTime': endTime,
        'employeeIdList': user.map(item => { return item.employeeId }),
        'trainingTaskFileConfigList': doc,
        'trainingTaskExamConfigList': bank
      }
      learningOrder(obj, 'post').then(() => {
        this.$message.success('创建成功')
        setTimeout(() => {
          location.reload()
        }, 1000)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.app-container {
  height: 65vh;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.mid-center {
  margin-top: 2.5rem;
}

.dialog-footer {
  margin-top: 1rem;
}

.tips {
  margin-right: .5rem;
  float: right;
}

::v-deep .delButton {
  color: red !important;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
