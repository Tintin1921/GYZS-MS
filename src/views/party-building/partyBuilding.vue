<template>
  <div class="page-container">
    <!-- 顶部banner -->
    <div class="header-banner" />
    <!-- 网站头部 -->
    <div class="header">
      <div class="header-container">
        <div class="header-left">
          <!--          <el-image class="logo" :src="require('./components/partyBuilding/image/temp_logo0.png')" />-->
          <div class="title">
            <p>制丝车间党支部 主管</p>
            <p>制丝车间综合组 主办</p>
          </div>
        </div>
        <div class="header-center">
          <el-image
            style="width: 600px; height: 115px"
            :src="require('./components/partyBuilding/image/temp_logo7.png')"
            fit="fill"
          />
          <el-image
            style="width: 600px; height: 115px"
            :src="require('./components/partyBuilding/image/temp_logo4.png')"
            fit="fill"
          />
        </div>
        <div class="header-right">
          <div class="search-box">
            <el-input v-model="searchKeyword" placeholder="请输入搜索内容">
              <el-button slot="append" icon="el-icon-search" @click="handleSearch" />
            </el-input>
          </div>
          <div class="announcement">
            <el-tag type="danger" size="small">公示</el-tag>
            <el-scrollbar>
              <div class="scroll-content" style="width: 250px">
                <a>
                  制丝测试公示制丝测试公示1
                </a>
                <a>
                  制丝测试公示2
                </a>
              </div>
            </el-scrollbar>
          </div>
          <div class="announcement">
            <el-tag type="danger" size="small">启示</el-tag>
            <el-scrollbar>
              <div class="scroll-content" style="width: 250px">
                <a>
                  制丝测试启示1
                </a>
                <a>
                  制丝测试启示制丝测试启示2
                </a>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区 -->
    <pageContent />

    <!-- 页脚 -->
    <div class="footer">
      <div class="footer-container">
        <div class="footer-section">
          <h3>关于我们</h3>
          <p>制丝党建网于2025年搭建,是制丝车间传递党建信息的窗口之一。党建网负责主办xx杂志、xx文选..</p>
          <a>[详细]</a>
        </div>

        <div class="footer-section">
          <h3>制丝人风采</h3>
          <p>阅览制丝党建网,就是我们的同志,让我们共同为党的建设添砖加瓦。</p>
        </div>

        <div class="footer-section">
          <h3>联系我们</h3>
          <p>地址: 生活辅房210室</p>
          <p>电话: 0851-00000000</p>
        </div>
      </div>

      <div class="copyright">
        <p>制丝车间版权所有 转载请注明来源</p>
        <p>版权所有 Copyright© 制丝车间信息化平台</p>
        <p>本网站违法和不良信息举报电话:0851-00000000</p>
      </div>
    </div>
  </div>
</template>

<script>
import pageContent from './components/partyBuilding/pageContent.vue'

export default {
  components: {
    pageContent
  },
  data() {
    return {
      searchKeyword: ''
    }
  },
  methods: {
    handleSearch() {
      if (this.searchKeyword) {
        alert(`搜索关键词: ${this.searchKeyword}`)
      } else {
        this.$message.warning('请输入搜索内容')
      }
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

/* 顶部横幅 */
.header-banner {
  height: 120px;
  background-image: url('./components/partyBuilding/image/topBackground.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* 网站头部 */
.header {
  background-color: #fcfcfc;
  padding: 15px 0;
}

.header-container {
  width: 95%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-left .logo {
  width: 100px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-center .logo {
  width: 100%;
  height: 120px;
}

.header-left .title {
  margin-left: 15px;
  color: #333;
  font-size: 14px;
  line-height: 1.5;
}

.header-center {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  width: 15%;
  flex-direction: column;
  gap: 5px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-input {
  flex: 1;
}

.search-button {
  background: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  color: #c7000b;
  font-weight: bold;
}

.online-submit {
  display: flex;
  align-items: center;
  color: #333;
  font-size: 14px;
}

.online-submit i {
  margin-right: 1px;
}

.online-submit a {
  color: #333;
  text-decoration: none;
}

.announcement, .notice {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 30px;
  overflow: hidden;
}

.scroll-content {
  display: flex;
  gap: 10px;
  animation: scroll 20s linear infinite;
  white-space: nowrap;
}

.scroll-content a {
  color: #333;
  font-size: 14px;
  text-decoration: none;
}

@keyframes scroll {
  0% { transform: translateX(30%); }
  100% { transform: translateX(-50%); }
}

/* 页脚 */
.footer {
  background-color: #d74339;
  color: white;
  padding: 30px 0 15px;
  margin-top: 40px;
}

.footer-container {
  width: 90%;
  max-width: 1450px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.3);
}

.footer-section {
  flex: 1;
}

.footer-section h3 {
  font-size: 18px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(255,255,255,0.5);
}

.footer-section p {
  margin-bottom: 10px;
  line-height: 1.6;
}

.footer-section a {
  color: #ffd;
  text-decoration: none;
}

.copyright {
  width: 90%;
  max-width: 1450px;
  margin: 20px auto 0;
  text-align: center;
  font-size: 12px;
  color: rgba(255,255,255,0.7);
  line-height: 1.8;
}

.copyright a {
  color: rgba(255,255,255,0.9);
}
</style>
