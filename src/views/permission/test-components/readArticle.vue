<template>
  <div class="news-article">
    <!-- 导航路径（可根据实际需求调整为动态生成） -->
    <div class="nav-path">
      <span>党建动态与学习专区 > 工艺管理系统文档 ></span>
    </div>

    <!-- 文章标题 -->
    <h1 class="article-title">{{ articleData.articleTitle }}</h1>
    
    <!-- 标题下方的分割线 -->
    <div class="title-divider" />

    <!-- 发布信息 -->
    <div class="publish-info">
      <span class="publish-date">发表时间: {{ formattedPublishTime }}</span>
      <span class="publish-source">来源: {{ articleData.authorName }}</span>
      <div class="view-controls">
        <button class="icon-btn" @click="adjustFontSize('increase')">大</button>
        <button class="icon-btn" @click="adjustFontSize('decrease')">小</button>
        <button class="icon-btn" @click="shareArticle">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 9C19.6569 9 21 7.65685 21 6C21 4.34315 19.6569 3 18 3C16.3431 3 15 4.34315 15 6C15 7.65685 16.3431 9 18 9Z" stroke="#666" stroke-width="1.5" />
            <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke="#666" stroke-width="1.5" />
            <path d="M18 21C19.6569 21 21 19.6569 21 18C21 16.3431 19.6569 15 18 15C16.3431 15 15 16.3431 15 18C15 19.6569 16.3431 21 18 21Z" stroke="#666" stroke-width="1.5" />
            <path d="M8.59 13.51L15.42 17.49" stroke="#666" stroke-width="1.5" stroke-linecap="round" />
            <path d="M15.41 6.51L8.59 10.49" stroke="#666" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 文章内容（核心修改区域） -->
    <div class="article-content">
      <!-- 动态渲染富文本内容（包含HTML标签） -->
      <div 
        class="content-text" 
        :style="{ fontSize: fontSize + 'em', lineHeight: (fontSize + 0.4) + 'em' }"
        v-html="articleData.content"
      ></div>
    </div>

    <!-- 页脚编辑信息 -->
    <div class="editor-info">
      <span>网站编辑: 黄小宇</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    articleData: {
      type: Object,
      required: true,
      // 建议添加数据校验（根据实际接口返回字段调整）
      validator: (value) => {
        return 'articleTitle' in value && 'content' in value && 'publishTime' in value
      }
    }
  },
  data() {
    return {
      fontSize: 1.0 // 字体缩放因子（初始1倍）
    }
  },
  computed: {
    // 格式化发布时间（只保留日期部分）
    formattedPublishTime() {
      return this.articleData.publishTime.split(' ')[0]
    }
  },
  methods: {
    // 字体大小调整（优化为动态样式绑定）
    adjustFontSize(type) {
      if (type === 'increase' && this.fontSize < 1.5) {
        this.fontSize += 0.1
      } else if (type === 'decrease' && this.fontSize > 0.8) {
        this.fontSize -= 0.1
      }
    },
    // 分享文章（优化参数传递）
    shareArticle() {
      const shareInfo = {
        title: this.articleData.articleTitle,
        text: this.getSummary(), // 自动生成摘要
        url: window.location.href
      }
      
      // 现代浏览器分享API（可选）
      if (navigator.share) {
        navigator.share(shareInfo).catch(console.error)
      } else {
        // 兼容旧浏览器的复制链接提示
        prompt('请手动复制链接分享：', window.location.href)
      }
    },
    // 自动生成摘要（从正文前100字提取）
    getSummary() {
      const fullText = this.stripHtmlTags(this.articleData.content)
      return fullText.length > 100 ? fullText.substring(0, 100) + '...' : fullText
    },
    // 去除HTML标签的工具函数
    stripHtmlTags(html) {
      const tmp = document.createElement('div')
      tmp.innerHTML = html
      return tmp.textContent || tmp.innerText || ''
    }
  }
}
</script>

<style scoped>
.news-article {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Microsoft YaHei', sans-serif;
  color: #333;
}

.nav-path {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}

.article-title {
  font-size: 24px;
  font-weight: bold;
  margin: 15px 0;
  line-height: 1.4;
  color: #222;
}

.title-divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 15px 0;
}

.publish-info {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  font-size: 14px;
  color: #666;
  flex-wrap: wrap; /* 优化小屏幕换行 */
}

.publish-date, .publish-source {
  margin-right: 20px;
  white-space: nowrap; /* 防止日期/来源被换行截断 */
}

.view-controls {
  margin-left: auto;
  display: flex;
  gap: 12px;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
}

.article-image {
  text-align: center;
  margin: 20px 0;
}

.article-image img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1); /* 图片阴影优化 */
}

.article-content {
  font-size: 16px;
  line-height: 1.8;
  margin: 20px 0;
}

/* 富文本内容样式覆盖（针对原文中的特殊标签） */
.content-text ::v-deep p {
  margin-bottom: 1.5em;
  text-indent: 2em;
}

.content-text ::v-deep font[color="#8baa4a"] {
  color: #8baa4a !important; /* 保留原文中的强调色 */
}

.content-text ::v-deep b {
  font-weight: 600;
}

.content-text ::v-deep img {
  margin: 15px 0;
}

.content-text ::v-deep [data-we-empty-p] {
  text-align: center;
}

.editor-info {
  font-size: 14px;
  color: #999;
  margin-top: 40px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-title {
    font-size: 20px;
  }

  .publish-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .view-controls {
    margin-left: 0;
    margin-top: 10px;
  }

  .title-divider {
    margin: 10px 0;
  }
}
</style>