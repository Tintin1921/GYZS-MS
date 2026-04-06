<template>
  <div class="admin-container">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="logo">党建专栏后台管理</div>
    </el-header>

    <!-- 主内容区 -->
    <el-main class="main-content">
      <!-- 快速入口 -->
      <el-row :gutter="20" class="quick-access">
        <el-col :span="6">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <i class="el-icon-plus" />
              <span> 便捷操作</span>
            </div>
            <div class="text-item">
              <el-button type="primary" @click="handleUpdateDoc">上传文档</el-button>
              <el-button type="primary" @click="handleNewSection">新建栏目</el-button>
              <el-button type="success">头条排序</el-button>
            </div>
          </el-card>
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <i class="el-icon-edit" />
              <span> 快速审核</span>
            </div>
            <div class="text-item-examine">
              <div style="vertical-align: middle;line-height: 40px;margin-left: 10px">今日发布文章数： 0 篇</div>
              <div style="vertical-align: middle;line-height: 40px;margin-left: 10px">待审核文章数： 0 篇</div>
              <el-button type="primary" @click="handleReviewDoc">审核文章</el-button>
              <el-button type="success" @click="handleReviewAll">全部通过</el-button>
            </div>
          </el-card>
        </el-col>

        <!-- 数据概览 -->
        <el-col :span="18">
          <el-card>
            <div slot="header">
              <span>数据概览</span>
            </div>
            <div class="dashboard">
              <el-row :gutter="15">
                <div style="height: 200px;margin-top: -30px;margin-bottom: 10px">
                  <dailyVisitorChart />
                </div>
                <el-col :span="8">
                  <div class="stat-box">
                    <div class="num">1,234</div>
                    <div class="title">文章总数</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="stat-box">
                    <div class="num">56</div>
                    <div class="title">栏目分类</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="stat-box">
                    <div class="num">789,012</div>
                    <div class="title">访问量</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 轮播图管理模块 -->
      <el-card class="module-card">
        <div slot="header">
          <span>首页轮播图管理</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="handleToggle('visibleCarousel')"
          >
            {{ visibleCarousel ? '收起' : '展开' }}
          </el-button>
          <el-button
            style="float: right; padding: 3px 0;margin-right: 10px"
            type="text"
            @click="handleToggle('visibleCarouselFilter')"
          >
            {{ visibleCarouselFilter ? '收起功能' : '高级功能' }}
          </el-button>
        </div>
        <transition name="el-fade-in-linear">
          <carouselDragTable v-show="visibleCarousel" :visible-carousel-filter="visibleCarouselFilter" @setComponentObj="setComponentObj" />
        </transition>
        <span v-show="!visibleCarousel">...</span>
      </el-card>

      <!-- 文章管理 -->
      <el-card class="module-card">
        <div slot="header">
          <span>文章管理</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="handleToggle('visibleDocManagement')"
          >
            {{ visibleDocManagement ? '收起' : '展开' }}
          </el-button>
          <el-button
            style="float: right; padding: 3px 0;margin-right: 10px"
            type="text"
            @click="handleToggle('visibleDocFilter')"
          >
            {{ visibleDocFilter ? '关闭筛选' : '高级筛选' }}
          </el-button>
        </div>
        <transition name="el-fade-in-linear">
          <docManagement v-show="visibleDocManagement" :visible-doc-filter="visibleDocFilter" />
        </transition>
        <span v-show="!visibleDocManagement">...</span>
      </el-card>

      <!-- 栏目管理 点击树形图 右边的表格也发生变化 -->
      <el-card class="module-card">
        <div slot="header">
          <span>栏目管理</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="handleToggle('visibleSectionManagement')"
          >
            {{ visibleSectionManagement ? '收起' : '展开' }}
          </el-button>
        </div>
        <transition name="el-fade-in-linear">
          <sectionManagement v-show="visibleSectionManagement" />
        </transition>
        <span v-show="!visibleSectionManagement">...</span>
      </el-card>

      <!-- 数据分析 -->
      <el-card class="module-card">
        <div slot="header">
          <span>数据分析</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="handleToggle('visibleChartAnalysis')"
          >
            {{ visibleChartAnalysis ? '收起' : '展开' }}
          </el-button>
        </div>
        <transition name="el-fade-in-linear">
          <chartAnalysis v-show="visibleChartAnalysis" />
        </transition>
        <span v-show="!visibleChartAnalysis">...</span>
      </el-card>
    </el-main>

    <!--  弹出功能窗  -->
    <el-dialog
      :key="componentObj.key"
      :title="componentObj.title"
      :visible.sync="dialogDisplay"
      :destroy-on-close="true"
      :width="componentObj.width"
    >
      <newSection v-if="componentObj.name === 'newSection'" />
      <uploadDoc v-if="componentObj.name === 'uploadDoc'" />
      <manualReview v-if="componentObj.name === 'manualReview'" />
      <addCarouselItem v-if="componentObj.name === 'addCarouselItem'" />
    </el-dialog>
  </div>
</template>

<script>
import { generateID } from '@/utils/generateID'
import sectionManagement from '@/views/party-building/components/management/sectionManagement.vue'
import docManagement from '@/views/party-building/components/management/docManagement.vue'
import addCarouselItem from '@/views/party-building/components/management/addCarouselItem.vue'
import uploadDoc from '@/views/party-building/components/management/uploadDoc.vue'
import newSection from '@/views/party-building/components/management/newSection.vue'
import manualReview from '@/views/party-building/components/management/manualReview.vue'
import carouselDragTable from '@/views/party-building/components/management/carouselDragTable.vue'
import chartAnalysis from '@/views/party-building/components/management/chartAnalysis.vue'
import dailyVisitorChart from '@/views/party-building/components/management/dailyVisitorChart.vue'
import { auditAllPass } from '@/api/partyBuilding'

export default {
  components: {
    newSection,
    uploadDoc,
    manualReview,
    dailyVisitorChart,
    carouselDragTable,
    addCarouselItem,
    docManagement,
    sectionManagement,
    chartAnalysis
  },
  data() {
    return {
      // Dialog弹出框
      dialogDisplay: false,
      // 动态组件引用
      componentObj: {
        name: null,
        title: null,
        width: 0 + '%',
        key: null
      },
      // 下拉框显示控制
      visibleCarousel: true,
      visibleCarouselFilter: false,
      visibleDocManagement: true,
      visibleDocFilter: false,
      visibleSectionManagement: true,
      visibleChartAnalysis: true
    }
  },
  methods: {
    handleReviewAll() {
      this.$confirm('确认全部通过审核吗？', '警告', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(async() => {
        auditAllPass().then(() => {
          this.$message.success('操作成功')
        })
      }).catch(() => {
        this.$message.error('取消操作')
      })
    },
    handleNewSection() {
      this.setComponentObj('新建栏目', 'newSection', '50')
    },
    handleUpdateDoc() {
      this.setComponentObj('上传文档', 'uploadDoc', '50')
    },
    handleReviewDoc() {
      this.setComponentObj('审核文章', 'manualReview', '70')
    },
    // 收起功能栏
    handleToggle(key) {
      this[key] = !this[key]
    },
    // 对于dialog的动态使用
    setComponentObj(title, name, width) {
      this.componentObj.title = title
      this.componentObj.name = name
      this.componentObj.width = width + '%'
      this.componentObj.key = generateID()
      this.dialogDisplay = true
    }
  }
}
</script>

<style scoped>
.admin-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #304156;
  color: white;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.quick-access {
  margin-bottom: 20px;
}

.stat-box {
  text-align: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
}

.module-card {
  margin-bottom: 20px;
  border-radius: 4px;
}

.module-card {
  margin-bottom: 30px;
}
</style>
