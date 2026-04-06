<template>
  <div class="app-container" style="font-size: 20px">
    <el-card class="custom-top-query-card" shadow="hover">
      <div class="card-header">
        <span class="title"><i slot="prefix" class="el-icon-s-fold custom-icon" />测试中心</span>
        <div class="header-actions">
          <el-tooltip content="操作指引">
            <el-button type="text" icon="el-icon-guide" />
          </el-tooltip>
        </div>
      </div>
      <el-divider />
      <el-row :gutter="24" align="middle" class="query-row">
        <el-col :span="24">
          <span class="title">所有的新功能都在此页面测试</span>
        </el-col>
      </el-row>

    </el-card>
    <el-divider />
    <h5>新增页面需注意</h5>
    <p>
      1.新增页面须在router/index中填写信息；<br>
      2.角色权限管理使用的Router路径是本地路径，需要手动添加新的页面信息<br>
      3.store/permission中有个功能负责校验用户权限，新增页面后徐手动添加权限信息（2025-04的版本中已实现自动校验）
    </p>
    <el-divider />
    <h5>测试服务器上传</h5>
    <p>
      发送数字(带小数)data <br>
      发送字符串data <br>
      发送列表encodeURIComponent(data) <br>
      发送集合encodeURIComponent(JSON.stringify(data)) <br>
      发送对象JSON.stringify(data) <br>
    </p>
    <button @click="handleUpdateNum">上传数字</button> {{ num }}
    <button @click="handleUpdateString">上传字符串</button> {{ string }}
    <button @click="handleUpdateList">上传列表</button> {{ list }}
    <button @click="handleUpdateCollection">上传集合</button> {{ arr }}
    <button @click="handleUpdateObject">上传对象</button> {{ object }}
    <el-divider />
    <h5>测试练习题（题库在本地）</h5>
    <button @click="danXuan">单选练习</button>
    <button @click="duoXuan">多选练习</button>
    <el-divider />
    <h5>测试响应式布局框（考虑更新在工艺图表中）</h5>
    <button @click="addCharts">添加图表</button>
    <input v-model="chartIdToDelete" placeholder="输入需要删除图表的ID">
    <button @click="removeChartById">删除图表</button>
    <TestCanvas :layout="layout" />
    <el-divider />
    <h5>测试渲染3D模型（模型由本地创建）</h5>
    <ThreeDModel />
    <el-divider />
    <h5>测试双Y轴的渐变色曲线图（为每条曲线单独配置Y轴，但是Y轴不显示，由文本显示在表的侧边）</h5>
    <testChart />
    <el-divider />
    <h5>测试可拖拽式表格（计划使用在工艺分析中，方便纵向对比）</h5>
    <dragTable />
    <el-divider />
    <h5>贪吃蛇小游戏（WSAD控制移动）</h5>
    <el-button @click="startSnake">开始游戏</el-button>
    <el-divider />
    <h5>测试多Y轴的特殊显示（设置多Y轴 只显示第一条轴 其余轴的最大值归集到第一条轴上）</h5>
    <testChart2 />
    <el-divider />
    <h5>导出excel表功能测试</h5>
    <excel />
    <el-divider />
    <h5>答题界面UI设计</h5>
    <el-button type="primary" @click="taskUi = true">开始答题</el-button>
    <h5>自动加载新闻页面功能</h5>
    <el-button type="primary" @click="readArticle">预览页面</el-button>
    <h5>图片上传裁剪</h5>
    <el-button type="primary" @click="uploadImg">预览页面</el-button>
    <h5>图片预览</h5>
    <div class="image-gallery">
      <Viewer>
        <img
          v-for="(src, index) in images"
          :key="index"
          :src="src.src"
          class="gallery-image"
          :style="{'--delay': index * 0.1 + 's'}"
        >
      </Viewer>
    </div>
    <h5>布局</h5>
    <newDialog />

    <el-dialog title="单选练习中" :visible.sync="outerVisible1" width="80%">
      <div v-if="outerVisible1">
        <h3>{{ danXuanTi.title }}</h3>
        <el-radio-group v-model="radio1">
          <el-radio
            v-for="(option, optIndex) in danXuanTi.option"
            :key="optIndex"
            :label="option"
          >
            {{ option }}
          </el-radio>
        </el-radio-group><br>
      </div>
      <p>{{ dtime }} / {{ 300 }}</p>
      <el-button type="primary" style="margin-top: 5px;" @click="nextDQs">下一题</el-button>
    </el-dialog>

    <el-dialog title="多选练习中" :visible.sync="outerVisible2" width="80%">
      <div v-if="outerVisible2">
        <h3>{{ duoXuanTi.title }}</h3>
        <el-checkbox-group v-model="radio2">
          <el-checkbox
            v-for="(option, optIndex) in duoXuanTi.option"
            :key="optIndex"
            :label="option"
          >
            {{ option }}
          </el-checkbox>
        </el-checkbox-group><br>
      </div>
      <p>{{ duotime }} / {{ 150 }}</p>
      <el-button type="primary" style="margin-top: 5px;" @click="nextQs">下一题</el-button>
    </el-dialog>

    <el-dialog title="贪吃蛇" :visible.sync="snakeShow" width="80%" :destroy-on-close="true">
      <snake />
    </el-dialog>

    <el-dialog title="答题练习界面设计" :visible.sync="taskUi" width="80%" :destroy-on-close="true">
      <TaskUi />
    </el-dialog>

    <el-dialog title="自动加载文章内容" :visible.sync="displayReadArticle" :destroy-on-close="true">
      <readArticle :article-data="currentArticle" />
    </el-dialog>

    <el-dialog title="图片上传裁剪" :visible.sync="displayUploadImg" :destroy-on-close="true">
      <ImageUploader :aspect-ratio="1" upload-url="/api/upload-image" @uploaded="onImageUploaded" />
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import ImageUploader from '@/views/permission/test-components/ImageUploader.vue'
import { updateMsg } from '@/api/test'
import testChart from '@/views/permission/test-components/testChart.vue'
import ThreeDModel from '@/views/permission/test-components/ThreeDModel.vue'
import TestCanvas from '@/views/permission/test-components/TestCanvas.vue'
import dragTable from '@/views/permission//test-components/drag-table.vue'
import snake from '@/views/permission//test-components/snake.vue'
import testChart2 from '@/views/permission/test-components/testChart2.vue'
import { dx, ddx } from '@/views/permission/test-components/mockData.js'
import excel from '@/views/permission/test-components/excel.vue'
import TaskUi from '@/views/permission//test-components/taskUi.vue'
import newDialog from './test-components/newDialog.vue'
import readArticle from '@/views/permission/test-components/readArticle.vue'
import 'viewerjs/dist/viewer.css'
import { component as Viewer } from 'v-viewer' // 从 v-viewer 导入组件

export default {
  components: {
    testChart2,
    testChart,
    ThreeDModel,
    TestCanvas,
    dragTable,
    snake,
    excel,
    TaskUi,
    readArticle,
    ImageUploader,
    Viewer,
    newDialog
  },
  data() {
    return {
      num: 0,
      string: 'abc',
      list: [1, 2, 3],
      arr: [{ 'key': 1, 'name': 'tom' }, { 'key': 2, 'name': 'john' }],
      object: { key: 1, name: 'tom' },
      tmp: null,
      outerVisible1: false,
      outerVisible2: false,
      radio1: '0',
      radio2: [],
      dtime: 0,
      danXuanNum: 0,
      danXuanTi: [],
      danXuanTiKu: [],
      duoXuanTiKu: [],
      duotime: 0,
      duoXuanNum: 0,
      duoXuanTi: [],
      nextId: 1,
      layout: [],
      charts: [],
      images: [{ src: require('/src/assets/images/logo-green.png'), alt: '示例图片1' }],
      displayUploadImg: false,
      chartIdToDelete: null,
      snakeShow: false,
      taskUi: false,
      displayReadArticle: false,
      currentArticle: {
        articleId: 64,
        articleTitle: '使用手册',
        authorName: 'admin',
        categoryName: '文章',
        columnName: '党建动态与学习专区',
        content: '<p><font color="#8baa4a"><b>贵阳卷烟厂制丝车间</b><b>工艺质量管理系统</b><b>使用手册</b></font></p><p><b>一、系统概述</b></p><p>本系统旨在利用Web平台的优势整合车间各类数据，主要为工艺类数据，通过技术手段将数据整合利用提高工作效率，减少人力和时间成本。</p><p>该系统的Web前端采用VUE.js框架以及Element UI、Bootstrap VUE开发，服务器端采用Java的Spring Boot架构,数据存储使用MySQL数据库，服务器部署使用Tomcat。</p><p>该系统具有很强的扩展性，在系统设计之初，开发人员已经根据工厂未来的工艺发展计划预留出各类数据接口，在工厂开放数据中台、数据汇聚平台后可第一时间接入。</p><p>该系统还可根据车间业务需求，随时调整系统内的页面以及组件，目前工艺系统已经完成开发的模块主要为工艺图标模块以及工艺分析模块。</p><p>随着工厂数字信息化进程的推进，该系统能不断改进自身功能，提升数据准确性,更好的服务于制丝车间。<br></p><p><!--[if--><b>二、<!--[endif]-->系统功能模块简述</b></p><p><!--[if-->1.&nbsp;<!--[endif]--><b>登录验证模块</b><b></b></p><p>&nbsp;&nbsp;为了保证数据安全，该系统设置了两步登录验证模块，具体实现如下：</p><p>&nbsp;&nbsp;1.1在用户打开该Web页面后，客户端便会向服务器端请求一份登录用户名的列表，用于离线验证用户输入的用户名是否合规（防止很多用户频繁输入错误的用户名来请求服务器导致服务器崩溃）。</p><p>&nbsp;&nbsp;1.2 在第一次校验完成后会将用户输入的密码发送至服务器端进行第二次核验，验证通过后前端使用Router对用户进行跳转。</p><p data-we-empty-p="" style="text-align:center;"><img src="http://10.113.176.30:8082/gyzs-ms/article-image/IMG_1757466680822_1" alt="图片" width="50%"></p><p style="text-align:center;"><font size="1">图1 系统登录界面</font></p><p><!--[if-->2.&nbsp;<!--[endif]--><b>工艺图表模块</b><b></b></p><p>&nbsp;&nbsp;该模块主要功能是为用户生成可随意拖动放大缩小的曲线图，用来显示车间工艺的历史生产数据和实时生产数据，并对生成的图表进行管理，如配置点位、卷烟品牌、删除等功能。</p><p><b></b></p><p><b></b></p>',
        publishTime: '2025-09-10 09:13:29',
        readCount: 0
      }
    }
  },
  methods: {
    // 发送数字(带小数)data
    // 发送字符串data
    // 发送列表encodeURIComponent(data)
    // 发送集合encodeURIComponent(JSON.stringify(data))
    // 发送对象JSON.stringify(data)
    handleUpdateNum() {
      alert('update: ' + this.num)
      axios.post('/api/gyzs-ms/pro/test', this.num)
        .then(response => {
          alert('suc')
          console.log(response)
        })
    },
    handleUpdateString() {
      alert('update: ' + this.string)
      updateMsg(this.string).then(res => {
        console.log(res)
      })
    },
    handleUpdateList() {
      alert('update: ' + this.list)
      updateMsg(encodeURIComponent(this.list)).then(res => {
        console.log(res)
      })
    },
    handleUpdateCollection() {
      alert('update: ' + this.arr)
      updateMsg(encodeURIComponent(JSON.stringify(this.arr))).then(res => {
        console.log(res)
      })
    },
    async handleUpdateObject() {
      alert('ok')
      const data = { 'id': 1 }
      try {
        const response = await axios.post('/api/gyzs-ms/pro/test', data, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        console.log('服务器返回：', response.data)
      } catch (error) {
        console.error('请求失败：', error)
      }
    },
    danXuan() {
      this.danXuanTiKu = dx
      this.outerVisible1 = true
      this.danXuanNum = Math.floor(Math.random() * this.danXuanTiKu.length)
      this.danXuanTi = this.danXuanTiKu[this.danXuanNum]
    },
    onImageUploaded(data) {
      console.log('上傳成功，後端回傳:', data)
    },
    nextDQs() {
      if (this.radio1 === '0') {
        alert('请选择答案')
      } else {
        const getV = this.radio1.substring(0, 1)
        const getR = this.danXuanTiKu[this.danXuanNum].value
        if (getV === getR) {
          this.dtime = this.dtime + 1
          this.$message({
            message: '回答正确',
            type: 'success'
          })
          this.danXuanTiKu.splice(this.danXuanNum, 1)
          this.danXuan()
        } else {
          this.radio1 = null
          this.$alert('回答错误，正确答案为：' + getR, {
            confirmButtonText: '确定'
          })
        }
      }
    },
    duoXuan() {
      this.duoXuanTiKu = ddx
      this.outerVisible2 = true
      this.duoXuanNum = Math.floor(Math.random() * this.duoXuanTiKu.length)
      this.duoXuanTi = this.duoXuanTiKu[this.duoXuanNum]
    },
    nextQs() {
      if (this.radio2.length === 0) {
        alert('请选择答案')
      } else {
        const res = this.radio2.every((item, index) => {
          return this.duoXuanTi.value[index].toUpperCase() === item[0]
        })
        if (res) {
          this.duotime = this.duotime + 1
          this.$message({
            message: '回答正确',
            type: 'success'
          })
          this.duoXuanTiKu.splice(this.duoXuanNum, 1)
          this.duoXuan()
        } else {
          this.radio2 = []
          this.$alert('回答错误，正确答案为：' + this.duoXuanTi.value, {
            confirmButtonText: '确定'
          })
        }
      }
    },
    readArticle() {
      this.displayReadArticle = true
    },
    addCharts() {
      const newChartId = `${this.nextId}`
      const newChart = {
        'x': 0,
        'y': 0,
        'w': 4,
        'h': 4,
        'i': newChartId,
        'type': 'chart'
      }
      this.layout.push(newChart)
      this.nextId++
      this.charts.push({ id: newChartId })
    },
    uploadImg() {
      this.displayUploadImg = true
    },
    removeChartById() {
      let chartId = null
      if (this.chartIdToDelete) {
        chartId = this.chartIdToDelete.trim() // 获取输入框的值
      }
      if (!chartId) {
        alert('输入值为空')
        return
      }
      // 移除 layout 中的图表项
      this.layout = this.layout.filter(item => item.i !== chartId)
      // 移除 charts 数组中的图表数据
      this.charts = this.charts.filter(chart => chart.id !== chartId)
      // 清空输入框
      this.chartIdToDelete = ''
    },
    startSnake() {
      this.snakeShow = true
    }
  }
}
</script>

<style scoped>
.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  padding: 20px;
}

.gallery-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* 流畅的过渡效果 */
  opacity: 0; /* 初始状态为透明，用于入场动画 */
  transform: translateY(20px); /* 初始状态向下偏移 */
  animation: fadeInUp 0.6s ease-out forwards;
  animation-delay: var(--delay); /* 使用CSS变量设置延迟 */
}

.gallery-image:hover {
  transform: translateY(-5px) scale(1.03); /* 悬停时轻微上浮和放大 */
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.23);
}

/* 定义图片入场动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
