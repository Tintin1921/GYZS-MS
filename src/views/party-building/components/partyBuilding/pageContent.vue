<template>
  <div class="page-container">
    <!-- 导航栏 -->
    <div class="navigation">
      <div class="nav-center-container">
        <el-menu
          mode="horizontal"
          text-color="#fff"
          background-color="#d74339"
          active-text-color="#ffd04b"
          class="centered-menu"
          @select="handleSelectMenu"
        >
          <el-menu-item index="首页">首页</el-menu-item>
          <el-menu-item v-for="(item, index) in menuArray" :key="index" :index="item.name">{{ item.name }}</el-menu-item>
        </el-menu>
      </div>
    </div>
    <!-- 头条区域 -->
    <div class="headline-section">
      <div class="headline-container">
        <div class="main-headline">
          <a>
            <h1>厂党委召开党委（扩大）会议传达学习贯彻习近平总书记近期重要讲话和重要指示精神</h1>
          </a>
        </div>
        <div class="sub-headlines">
          <a>
            <el-tag type="danger">头条</el-tag>
            <span>技术中心第二党支部与我车间党总支开展支部共建活动</span>
          </a>
          <a>
            <el-tag type="danger">头条</el-tag>
            <span>我车间有序推进生产现场“跑冒滴漏”整改政治工作</span>
          </a>
        </div>
      </div>
    </div>

    <!-- 轮播图和新闻列表 -->
    <div id="平语近人" class="carousel-section" v-loading="loading" element-loading-text="数据加载...">
      <div class="carousel-container">
        <div class="news-list">
          <div class="section-title">
            <i class="el-icon-news" />
            <span>平语近人</span>
          </div>
          <ul class="read-section">
            <li v-for="(item, index) in topColumn" :key="index">
              <a @click="handleClick(item)">
                <el-tag v-if="item.articleCategory" size="small" type="info">{{ item.articleCategory }}</el-tag>
                {{ item.articleTitle }}
              </a>
            </li>
          </ul>
        </div>

        <div class="carousel-box">
          <el-carousel height="400px" :interval="5000" arrow="always">
            <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
              <a :href="item.link" target="_blank">
                <el-image :src="item.url" alt="轮播图" class="carousel-image" />
                <div class="carousel-title">{{ item.title }}</div>
              </a>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </div>

    <!-- 功能板块区域 -->
    <component
      :is="getLayoutComponent(item.layoutType)"
      v-for="(item, index) in sortedLayouts"
      :id="item.name"
      :key="index"
      :column-data="getColumnData(item.name)"
    />

    <div class="magazine-section">
      <div class="magazine-container">
        <div class="magazine-left">
          <div class="magazine-item">
            <div class="section-title">
              <i class="el-icon-notebook-2" />
              <span>《贵烟之窗》</span>
            </div>
            <div class="magazine-content">
              <el-image src="" fit="cover" />
              <div class="issues">
                <div v-for="(item, index) in magazineIssues" :key="index">
                  <a :href="item.link" target="_blank">
                    <span>{{ item.year }}</span>年第<span>{{ item.issue }}</span>期
                  </a>
                </div>
                <a>
                  查看更多往期
                </a>
              </div>
            </div>
          </div>

          <div class="magazine-item">
            <div class="section-title">
              <i class="el-icon-document" />
              <span>《党建》</span>
            </div>
            <div class="magazine-content">
              <el-image src="" fit="cover" />
              <div class="issues">
                <div v-for="(item, index) in studyIssues" :key="index">
                  <a :href="item.link" target="_blank">
                    <span>{{ item.year }}</span>年第<span>{{ item.issue }}</span>期
                  </a>
                </div>
                <a>
                  查看更多往期
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="magazine-right">
          <div class="section-title">
            <i class="el-icon-mobile-phone" />
            <span>团组织活动</span>
          </div>
          <ul>
            <li v-for="(item, index) in platformItems" :key="index">
              <a :href="item.link" target="_blank">{{ item.title }}</a>
            </li>
          </ul>
          <div class="qr-code">
            <el-image src="" fit="cover" />
            <div class="qr-text">
              <p>欢迎关注</p>
              <p>制丝党建建设</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="预览文章"
      :visible.sync="display"
      :append-to-body="true"
      :destroy-on-close="true"
    >
      <pageRead :article-data="articleData" />
    </el-dialog>
  </div>
</template>

<script>
import layout1 from '@/views/party-building/components/partyBuilding/template/layout1.vue'
import layout2 from '@/views/party-building/components/partyBuilding/template/layout2.vue'
import layout3 from '@/views/party-building/components/partyBuilding/template/layout3.vue'
import { auditRecords, getContext, getEnableColumns } from '@/api/partyBuilding'
import pageRead from '@/views/party-building/components/partyBuilding/pageRead.vue'

export default {
  components: {
    pageRead,
    layout1,
    layout2,
    layout3
  },
  data() {
    return {
      loading: false,
      display: false,
      // 存放菜单内容
      menuArray: [],
      // 存储文章内容
      articleData: {},
      // 布局样式
      sortedLayouts: [],
      // 平语近人栏目的标题
      topColumn: [],
      // 其他栏目的标题
      articleTitleList: [],
      carouselItems: [
        {
          title: '车间党员与技术中心第二党支部党员在现场观察物料生产情况',
          url: require('./image/tempPic1.jpg')
        },
        {
          title: '车间党员与技术中心第二党支部党员在现场观察物料生产情况',
          url: require('./image/tempPic1.jpg')
        }
      ],
      magazineIssues: [
        { year: '2025', issue: '7' },
        { year: '2025', issue: '6' },
        { year: '2025', issue: '5' },
        { year: '2025', issue: '4' }
      ],
      studyIssues: [
        { year: '2025', issue: '24' },
        { year: '2025', issue: '23' },
        { year: '2025', issue: '22' },
        { year: '2025', issue: '21' }
      ],
      platformItems: [
        { title: '2025年7月11日（一）学习语丨始终赓赓续红色血脉' },
        { title: '2025年7月11日（二）思想纵横｜充分发挥文化养心志、育情操的作用' },
        { title: '2025年7月11日（三）表态不如表率' },
        { title: '2025年7月11日（四）经验交流｜哈尔滨工业大学（深圳）："双轮驱动"培育新动能' }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      await auditRecords({ 'pageNumber': 1, 'pageSize': 999 }).then(res => {
        const { data } = res
        const array = data.records
        // 由于后端暂时存在问题 这里先手动添加测试数据
        const obj1 = { articleAuthorName: 'admin', articleCategory: '文章', articleColumn: '平语近人', articleId: 75, articleTitle: '金山银山就是绿水青山', auditRecordId: 16, auditState: '已通过', submitTime: '2025-09-11 09:27:24' }
        const obj2 = { articleAuthorName: 'admin', articleCategory: '文章', articleColumn: '党群互动建议与征集', articleId: 75, articleTitle: '测试文章党群互动', auditRecordId: 16, auditState: '已通过', submitTime: '2025-09-11 09:27:24' }
        const obj3 = { articleAuthorName: 'admin', articleCategory: '文章', articleColumn: '党业融合攻坚项目', articleId: 75, articleTitle: '测试文章党业', auditRecordId: 16, auditState: '已通过', submitTime: '2025-09-11 09:27:24' }
        const obj4 = { articleAuthorName: 'admin', articleCategory: '启示', articleColumn: '党建动态与学习专区', articleId: 75, articleTitle: '测试滚动', auditRecordId: 16, auditState: '已通过', submitTime: '2025-09-11 09:27:24' }
        for (let i = 0; i < 10; i++) {
          obj1.articleTitle = obj1.articleTitle + i
          array.push(obj1)
        }
        for (let i = 0; i < 5; i++) {
          obj2.articleTitle = obj2.articleTitle + i
          array.push(obj2)
        }
        for (let i = 0; i < 5; i++) {
          obj3.articleTitle = obj3.articleTitle + i
          array.push(obj3)
        }
        for (let i = 0; i < 10; i++) {
          obj4.articleTitle = obj4.articleTitle + i
          array.push(obj4)
        }
        this.articleTitleList = array
      })
      await getEnableColumns().then(res => {
        const { data } = res
        this.menuArray = data
        this.topColumn = this.articleTitleList.filter(item => item.articleColumn === '平语近人')
        this.sortedLayouts = data.filter(item => item.name !== '平语近人')
      })
    },
    // 创建布局Map并自动分配布局
    getLayoutComponent(layout) {
      const map = {
        '布局一': 'layout1',
        '布局二': 'layout2'
      }
      return map[layout]
    },
    // 每个板块自动分配内容
    getColumnData(name) {
      const origin = this.articleTitleList
      const array = origin
        .filter(item => item.articleColumn === name && item.articleCategory !== '头条')
        .sort((a, b) => {
          return new Date(b.submitTime) - new Date(a.submitTime)
        })
      return { 'title': name, data: array }
    },
    handleSelectMenu(index) {
      const targetElement = document.getElementById(index)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }
    },
    handleClick(e) {
      this.loading = true
      const { articleId } = e
      getContext(articleId).then(res => {
        const { data } = res
        this.articleData = data
        this.loading = false
        this.display = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/* 全局样式 */
.page-container {
  background-color: #fff;
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
}

/* 头条区域 */
.headline-section {
  background-color: #f5f5f5;
  padding: 20px 0;
}

.headline-container {
  width: 90%;
  max-width: 1450px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.main-headline h1 {
  font-size: 32px;
  color: #3848a0;
  font-weight: bold;
  line-height: 1.3;
}

.sub-headlines {
  display: flex;
  gap: 20px;
  align-items: center;
}

.sub-headlines a {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #333;
  text-decoration: none;
  font-size: 16px;
}

.sub-headlines a:hover {
  color: #c7000b;
}

.more {
  margin-left: auto;
  color: #fb6432 !important;
}

/* 轮播图和新闻列表 */
.carousel-section {
  padding: 20px 0;
}

.carousel-container {
  width: 90%;
  max-width: 1450px;
  margin: 0 auto;
  display: flex;
  gap: 30px;
}

.news-list {
  flex: 1;
}

.news-list .section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 2px solid #c7000b;
  margin-bottom: 15px;
}

.news-list .section-title i {
  color: #c7000b;
  font-size: 20px;
}

.news-list .section-title span {
  font-size: 18px;
  font-weight: bold;
}

.news-list ul {
  list-style: none;
  padding: 0;
}

.news-list ul li {
  padding: 10px 0;
  border-bottom: 1px dashed #eee;
}

.news-list ul li a {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
  text-decoration: none;
  font-size: 16px;
}

.news-list ul li a:hover {
  color: #c7000b;
}

.carousel-box {
  flex: 2;
  position: relative;
}

.el-carousel__item {
  background-color: #ddd;
  color: #333;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  font-size: 18px;
}

/* 学习语区域 */
.study-section {
  padding: 30px 0;
  background-color: #f5f5f5;
}

.study-container {
  width: 90%;
  max-width: 1450px;
  margin: 0 auto;
  display: flex;
  gap: 30px;
}

.study-left {
  flex: 1;
}

.study-left .section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 2px solid #c7000b;
  margin-bottom: 15px;
}

.study-left .section-title i {
  color: #c7000b;
  font-size: 20px;
}

.study-left .section-title span {
  font-size: 18px;
  font-weight: bold;
}

.study-left ul {
  list-style: none;
  padding: 0;
}

.study-left ul li {
  padding: 10px 0;
  border-bottom: 1px dashed #ddd;
}

.study-left ul li a {
  color: #333;
  text-decoration: none;
  font-size: 16px;
}

.study-left ul li a:hover {
  color: #c7000b;
}

.study-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.important-opinion {
  display: flex;
  align-items: center;
  gap: 10px;
}

.important-opinion .el-tag {
  flex-shrink: 0;
}

.opinion-scroll {
  overflow: hidden;
  white-space: nowrap;
}

.opinion-scroll a {
  color: #333;
  font-size: 16px;
  text-decoration: none;
  margin-right: 20px;
}

.opinion-scroll a:hover {
  color: #c7000b;
}

.study-images {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.study-image {
  height: 120px;
  background: #e0e0e0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-weight: bold;
}

/* 杂志区域 */
.magazine-section {
  padding: 30px 0;
}

.magazine-container {
  width: 90%;
  max-width: 1450px;
  margin: 0 auto;
  display: flex;
  gap: 30px;
}

.magazine-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.magazine-item {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.magazine-item .section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  margin-bottom: 15px;
  border-bottom: 2px solid #c7000b;
}

.magazine-item .section-title i {
  color: #c7000b;
  font-size: 20px;
}

.magazine-item .section-title span {
  font-size: 18px;
  font-weight: bold;
}

.magazine-content {
  display: flex;
  gap: 15px;
}

.magazine-cover {
  width: 150px;
  height: 200px;
  background: #e0e0e0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-weight: bold;
}

.issues {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.issues a {
  color: #333;
  text-decoration: none;
  font-size: 16px;
  padding: 5px 0;
  display: block;
}

.issues a:hover {
  color: #c7000b;
}

.magazine-right {
  flex: 1;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.magazine-right .section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  margin-bottom: 15px;
  border-bottom: 2px solid #c7000b;
}

.magazine-right .section-title i {
  color: #c7000b;
  font-size: 20px;
}

.magazine-right .section-title span {
  font-size: 18px;
  font-weight: bold;
}

.magazine-right ul {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}

.magazine-right ul li {
  padding: 10px 0;
  border-bottom: 1px dashed #eee;
}

.magazine-right ul li a {
  color: #333;
  text-decoration: none;
  font-size: 16px;
  display: block;
}

.magazine-right ul li a:hover {
  color: #c7000b;
}

.qr-code {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border-top: 1px solid #eee;
  margin-top: 20px;
}

.qr-image {
  width: 80px;
  height: 80px;
  background: #e0e0e0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 12px;
  text-align: center;
}

.qr-text {
  font-size: 16px;
  font-weight: bold;
}

.read-section {
  height: 35vh;
  overflow-y: auto;
}

.navigation {
  background-color: #d74339;
  padding: 0 20px; /* 添加左右内边距 */
}

.nav-center-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  width: 100%;
}

.centered-menu {
  display: inline-flex; /* 关键：使菜单宽度自适应内容 */
  justify-content: center; /* 菜单项居中 */
}

/* 菜单项样式调整 */
.centered-menu.el-menu--horizontal > .el-menu-item {
  padding: 0 20px; /* 调整间距 */
  transition: all 0.3s ease; /* 添加过渡动画 */
}

.centered-menu.el-menu--horizontal > .el-menu-item:hover {
  transform: translateY(-2px); /* 悬停效果 */
}
</style>
