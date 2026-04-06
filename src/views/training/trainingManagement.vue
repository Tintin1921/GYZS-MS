<template>
  <div class="app-container">
    <el-form ref="form">
      <el-card class="custom-top-query-card" shadow="hover">
        <div class="card-header">
          <span class="title"><i slot="prefix" class="el-icon-s-fold custom-icon" />培训管理</span>
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
            <el-tooltip placement="top" content="在当前表格中模糊搜索资料">
              <el-input v-model="searchUser" placeholder="输入关键词模糊搜索" clearable style="width: 100%;margin-bottom: 10px">
                <i slot="prefix" class="el-icon-search" style="line-height: 40px;vertical-align: middle" />
              </el-input>
            </el-tooltip>
          </el-col>
          <el-col :span="20">
            <el-tooltip id="step2" placement="top" content="点击下发培训任务">
              <el-button type="primary" icon="el-icon-download" class="query-btn" @click="handleLearningOrder('learningOrder', '下发培训任务', 80)">
                下发培训任务
              </el-button>
            </el-tooltip>
            <el-tooltip id="step3" placement="top" content="点击上传培训资料">
              <el-button type="info" icon="el-icon-upload" class="query-btn" @click="handleUploadFile('uploadFile', '上传培训资料', 50)">
                上传培训资料
              </el-button>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <div id="step4" class="el-btnGroup-container" :class="{ 'el-btnGroup-container-ground ': btnDisplay }">
      <el-tooltip class="el-btn" placement="top" content="点击隐藏功能组">
        <el-button v-if="btnDisplay" id="open-btn" size="mini" type="primary" icon="el-icon-remove-outline" @click="handleDisplay" />
        <el-button v-if="!btnDisplay" id="close-btn" size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="handleDisplay" />
      </el-tooltip>
      <el-divider direction="vertical" />
      <transition name="el-zoom-in-bottom">
        <div v-show="btnDisplay">
          <el-button-group class="el-btn-group">
            <el-tooltip placement="top" content="切换显示职工培训信息">
              <el-button size="mini" type="primary" icon="el-icon-tickets" @click="handleSelectTab('trainingTab')">职工</el-button>
            </el-tooltip>
            <el-tooltip placement="top" content="切换显示培训任务信息">
              <el-button size="mini" type="primary" icon="el-icon-data-line" @click="handleSelectTab('learningTab')">任务</el-button>
            </el-tooltip>
            <el-tooltip placement="top" content="切换显示培训资料信息">
              <el-button size="mini" type="primary" icon="el-icon-document" @click="handleSelectTab('libraryTab')">资料</el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </transition>
    </div>
    <div id="step5">
      <trainingTab v-if="tableComponent.name === 'trainingTab'" :key="tableComponent.key" :search-user="searchUser" />
      <learningTab v-if="tableComponent.name === 'learningTab'" :key="tableComponent.key" :search-user="searchUser" />
      <libraryTab v-if="tableComponent.name === 'libraryTab'" :key="tableComponent.key" :search-user="searchUser" />
    </div>
    <el-dialog
      :visible.sync="dialogDisplay"
      :title="dialogComponent.title"
      :width="dialogComponent.width"
    >
      <learningOrder v-if="dialogComponent.name === 'learningOrder'" />
      <uploadFile v-if="dialogComponent.name === 'uploadFile'" />
    </el-dialog>
  </div>
</template>

<script>
import { generateID } from '@/utils/generateID'
import steps from './components/management/guideStep'
import 'driver.js/dist/driver.min.css'
import Driver from 'driver.js'
import uploadFile from '@/views/training/components/management/uploadFile.vue'
import learningTab from '@/views/training/components/management/learningTab.vue'
import libraryTab from '@/views/training/components/management/libraryTab.vue'
import trainingTab from '@/views/training/components/management/trainingTab.vue'
import learningOrder from '@/views/training/components/management/learningOrder.vue'

export default {
  components: {
    learningTab,
    libraryTab,
    trainingTab,
    uploadFile,
    learningOrder
  },
  data() {
    return {
      searchUser: undefined,
      btnDisplay: true,
      // 显示的组件名
      tableComponent: {
        key: null,
        name: 'trainingTab'
      },
      dialogDisplay: false,
      dialogComponent: {
        key: null,
        name: '',
        width: 0 + '%',
        title: ''
      }
    }
  },
  mounted() {
    // 初始化操作引导实例
    this.driver = new Driver()
  },
  methods: {
    // 操纵引导
    guide() {
      this.driver.defineSteps(steps)
      this.driver.start()
    },
    setComponent(type, name, title, width) {
      if (type === 'table') {
        this.$set(this.tableComponent, 'key', generateID())
        this.$set(this.tableComponent, 'name', name)
      } else if (type === 'dialog') {
        this.$set(this.dialogComponent, 'key', generateID())
        this.$set(this.dialogComponent, 'name', name)
        this.$set(this.dialogComponent, 'title', title)
        this.$set(this.dialogComponent, 'width', width + '%')
        this.dialogDisplay = true
      }
    },
    handleDisplay() {
      this.btnDisplay = !this.btnDisplay
    },
    handleSelectTab(name) {
      this.setComponent('table', name)
    },
    handleUploadFile(name, title, width) {
      this.setComponent('dialog', name, title, width)
    },
    handleLearningOrder(name, title, width) {
      this.setComponent('dialog', name, title, width)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-btnGroup-container {
  display: flex;
  width: 100%;
}

.el-btnGroup-container-ground {
  background: #fafafa;
}

.el-btn-group {
  gap: 8px;
  &:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .el-button {
    padding: 10px 15px;
    transition: all 0.3s;
    border: 1px solid var(--border-color);
    & + .el-button {
      margin-left: 0;
      background: linear-gradient(45deg, #409eff, #79bbff);
      border-color: #79bbff;
    }
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
    }
  }
}

</style>

