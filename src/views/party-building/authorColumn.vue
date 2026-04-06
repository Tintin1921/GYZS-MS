<template>
  <div v-loading="loading" class="article-manager" element-loading-text="操作处理中...">
    <!-- 左侧编辑区 -->
    <div class="editor-section">
      <!-- 文章标题 -->
      <div style="display: flex">
        <el-input
          v-model="currentArticle.title"
          placeholder="请输入文章标题"
          style="margin-bottom: 20px; width: 60%"
        />
        <el-input
          v-model="currentArticle.summary"
          placeholder="摘要（无就不填写）"
          style="margin-bottom: 20px; width: 40%"
        />
        <el-select v-model="currentArticle.categoryId" style="width: 10%" placeholder="选择文章类型">
          <el-option v-for="(item, index) in category" :key="index" :value="item.id" :label="item.name" />
        </el-select>
        <el-select v-model="currentArticle.columnId" style="width: 10%" placeholder="选择发布栏目">
          <el-option v-for="(item, index) in columns" :key="index" :value="item.columnId" :label="item.columnName" />
        </el-select>
      </div>

      <!-- 富文本编辑器容器 -->
      <div ref="editorContainer" class="editor-wrap" style="border: 1px solid #e4e7ed; margin-bottom: 20px;z-index: 0;" />

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="primary" @click="authorUpload('drafts')">保存草稿</el-button>
        <el-button type="success" @click="authorUpload('publishedArticles')">发布文章</el-button>
      </div>
    </div>

    <!-- 右侧列表区 -->
    <div class="list-section">
      <!-- 选项卡切换 -->
      <el-tabs v-model="activeTab" class="tab-container">
        <el-tab-pane label="草稿箱" name="drafts">
          <div class="article-list">
            <div
              v-for="draft in drafts"
              :key="draft.id"
              class="article-item"
              @click="viewArticle(draft)"
            >
              <div class="item-header">
                <span class="title">{{ draft.title || '无标题草稿' }}</span>
                <span class="time">{{ formatTime(draft.updateTime) }}</span>
              </div>
              <div class="item-footer">
                <el-button size="mini" type="danger" @click.stop="deleteArticle(draft.articleId)">删除</el-button>
              </div>
            </div>
            <div v-if="drafts.length === 0" class="empty-tip">暂无草稿</div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="已发布" name="published">
          <div class="article-list">
            <div
              v-for="article in publishedArticles"
              :key="article.id"
              class="article-item"
              @click="viewArticle(article)"
            >
              <div class="item-header">
                <span class="title">{{ article.title }}</span>
                <span class="time">{{ formatTime(article.updateTime) }}</span>
              </div>
              <div class="item-footer">
                <el-button size="mini" type="info" @click.stop="deleteArticle(article.articleId)">删除</el-button>
              </div>
            </div>
            <div v-if="publishedArticles.length === 0" class="empty-tip">暂无已发布文章</div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import E from 'wangeditor'
import {
  imageURL,
  saveDraft,
  getColumns,
  saveImage,
  queryColumns,
  getCategory,
  getEditContext,
  delContext, publishContext
} from '@/api/partyBuilding'
import { Input, Button, Tabs, TabPane } from 'element-ui'

export default {
  components: {
    'el-input': Input,
    'el-button': Button,
    'el-tabs': Tabs,
    'el-tab-pane': TabPane
  },
  data() {
    return {
      // 页面加载
      loading: false,
      // 当前编辑的文章
      currentArticle: {
        id: null, // 唯一标识（用时间戳生成）
        title: '', // 标题
        content: '', // 正文内容（HTML）
        categoryId: '', // 文章类型
        columnId: '', // 发布栏目
        summary: '' // 摘要
      },
      // 返回的文章id
      articleId: 0,
      // 草稿列表
      drafts: [],
      // 已发布文章列表
      publishedArticles: [],
      // 当前激活的选项卡
      activeTab: 'drafts',
      // 富文本编辑器实例
      editor: null,
      // 存储占位符和图片URL的映射
      imageMap: new Map(),
      // 类型选项
      category: [],
      // 栏目选项
      columns: []
    }
  },
  created() {
    // 获取文章栏目的下拉选项
    getColumns().then(res => {
      const { data } = res
      this.columns = data
    })
    // 获取文章类型的下拉选项
    getCategory().then(res => {
      const { data } = res
      this.category = data
    })
    // 从服务器获取右边草稿箱和发布箱的数据
    this.loadDataFromServer()
  },
  mounted() {
    // 初始化编辑器
    this.initEditor()
    // 加载本地存储的历史数据
    // this.loadDataFromLocalStorage()
  },
  beforeDestroy() {
    // 销毁编辑器实例（避免内存泄漏）
    if (this.editor) {
      this.editor.destroy()
      this.editor = null
    }
  },
  methods: {
    /** 初始化富文本编辑器 */
    initEditor() {
      this.editor = new E(this.$refs.editorContainer)
      this.editor.config.height = 660
      this.editor.config.uploadImgShowBase64 = true // 开启 base64
      this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 2MB
      // 初始化编辑器
      this.editor.create()
    },

    /** 保存草稿或发布文章 */
    async authorUpload(e) {
      if (e === 'publishedArticles' && this.activeTab === 'published') {
        this.$message.error('不可重复发布')
        return
      }
      if (!this.checkArticleValid()) return // 校验内容
      this.loading = true
      // 提取并替换图片 上传图片并获取URL
      const { processedHtml, imageFiles } = await this.extractAndReplaceImages(this.editor.txt.html())
      // 生成文章对象
      const article = {
        ...this.currentArticle,
        id: 0,
        title: this.currentArticle.title,
        content: processedHtml
      }
      let data = []
      if (e === 'drafts') {
        // 上传草稿文本
        await saveDraft(article).then(res => {
          data = res.data
        })
      } else {
        // 发布文章
        await publishContext(article).then(res => {
          data = res.data
        })
      }
      article['articleId'] = data.articleId
      this.articleId = data.articleId
      // 上传图片以及对应关系
      const uploadImagesFiles = []
      imageFiles.forEach((base64Data, placeholder) => {
        uploadImagesFiles.push({ 'imageName': placeholder, 'imageBase64Data': base64Data })
      })
      if (uploadImagesFiles.length > 0) {
        await saveImage(this.articleId, uploadImagesFiles).then(() => {})
      }
      this.$message.success('保存成功')
      this.loading = false
      this[e].unshift(article)
      // 清空当前编辑内容
      this.clearCurrentArticle()
    },

    // 提取文本中的图片并添加占位符
    extractAndReplaceImages(html) {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html
      const images = tempDiv.querySelectorAll('img')
      const imageFiles = new Map()
      let num = 1
      const placeholder = []
      const nodeArray = []
      // 替换占位符
      images.forEach(img => {
        // 包含http的为网络图片 该图片不参与处理
        if (!img.src.startsWith('http')) {
          placeholder.push(`IMG_${Date.now()}_${num++}`)
          nodeArray.push(img)
        }
      })
      return imageURL(placeholder).then(res => {
        const { data } = res
        nodeArray.forEach((img, index) => {
          imageFiles.set(placeholder[index], img.src)
          const span = document.createElement('span')
          span.className = 'image-placeholder'
          span.dataset.holder = data[index]
          span.textContent = `[${data[index]}]`
          img.parentNode.replaceChild(span, img)
        })
        return {
          processedHtml: tempDiv.innerHTML,
          imageFiles
        }
      })
    },

    /** 删除文章（草稿/已发布） */
    deleteArticle(articleId) {
      this.loading = true
      delContext(articleId).then(() => {
        this.drafts = this.drafts.filter(item => item.articleId !== articleId)
        this.publishedArticles = this.publishedArticles.filter(item => item.articleId !== articleId)
        this.loading = false
        this.$message.success('删除成功！')
      })
    },

    /** 查看文章详情（示例：弹窗显示内容） */
    async viewArticle(article) {
      this.loading = true
      const { articleId } = article
      await getEditContext(articleId).then(res => {
        const { data } = res
        this.currentArticle = data
        this.$set(this.currentArticle, 'title', data.articleTitle)
      })
      // 将图片添加回图片中
      const restoredHtml = this.restoreImages(this.currentArticle.content, new Map(this.currentArticle.images))
      if (this.editor) {
        this.editor.txt.html(restoredHtml)
      }
      document.querySelector('.editor-section').scrollIntoView({ behavior: 'smooth' })
      this.loading = false
    },

    /** 校验文章是否有效 */
    checkArticleValid() {
      if (!this.currentArticle.title.trim()) {
        this.$message.warning('标题不能为空！')
        return false
      }
      if (!this.currentArticle.categoryId) {
        this.$message.warning('请选择文章类型！')
        return false
      }
      if (!this.currentArticle.columnId) {
        this.$message.warning('请选择栏目类型！')
        return false
      }
      return true
    },

    /** 清空当前编辑内容 */
    clearCurrentArticle() {
      this.currentArticle = {
        id: null,
        title: '',
        content: '',
        createTime: 0
      }
      // 清空编辑器内容
      if (this.editor) {
        this.editor.txt.clear()
      }
    },

    /** 从服务器加载数据 */
    loadDataFromServer() {
      queryColumns({ 'pageNumber': 1, 'pageSize': 999, 'state': '草稿' }).then(res => {
        const { data } = res
        this.drafts = data.records
      })
      queryColumns({ 'pageNumber': 1, 'pageSize': 999, 'state': '已发布' }).then(res => {
        const { data } = res
        this.publishedArticles = data.records
      })
    },

    /** 恢复文本中的图片 */
    restoreImages(html) {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html
      // 查找所有占位符
      const placeholders = tempDiv.querySelectorAll('.image-placeholder')
      placeholders.forEach(placeholder => {
        const key = placeholder.dataset.holder
        const img = document.createElement('img')
        // 从映射中获取真实URL
        img.src = `${key}` || ''
        img.alt = `图片`
        placeholder.parentNode.replaceChild(img, placeholder)
      })
      return tempDiv.innerHTML
    },

    /** 格式化时间 */
    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }
  }
}
</script>

<style scoped>
.article-manager {
  display: flex;
  padding: 20px;
  gap: 20px;
  height: calc(100vh - 100px);
}

.editor-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.list-section {
  width: 350px;
  border-left: 1px solid #e4e7ed;
  padding-left: 20px;
}

.tab-container {
  height: 100%;
}

.article-list {
  height: calc(100vh - 200px);
  overflow-y: auto;
}

.article-item {
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.article-item:hover {
  background-color: #f5f7fa;
  border-color: #c0c4cc;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.title {
  font-weight: bold;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.time {
  font-size: 12px;
  color: #909399;
}

.item-footer {
  text-align: right;
}

.empty-tip {
  color: #909399;
  text-align: center;
  padding: 20px;
}

.action-buttons {
  display: flex;
  justify-content: end;
}
</style>
