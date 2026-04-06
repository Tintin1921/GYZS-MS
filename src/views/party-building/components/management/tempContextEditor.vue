<template>
  <div v-loading="loading" class="article-manager" element-loading-text="操作处理中...">
    <!-- 左侧编辑区 -->
    <div class="editor-section">
      <!-- 文章标题 -->
      <div style="display: flex">
        <el-input
          v-model="currentArticle.title"
          placeholder="请输入文章标题"
          style="margin-bottom: 20px; width: 90%"
        />
        <el-select v-model="articles.categoryId" style="width: 10%" placeholder="选择文章类型">
          <el-option v-for="(item, index) in category" :key="index" :value="item.id" :label="item.name" />
        </el-select>
        <el-select v-model="articles.columnId" style="width: 10%" placeholder="选择发布栏目">
          <el-option v-for="(item, index) in columns" :key="index" :value="item.columnId" :label="item.columnName" />
        </el-select>
      </div>

      <!-- 富文本编辑器容器 -->
      <div ref="editorContainer" class="editor-wrap" style="border: 1px solid #e4e7ed; margin-bottom: 20px;z-index: 0;" />

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="success" :disabled="true" @click="authorUpload">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import E from 'wangeditor'
import {
  imageURL,
  saveImage,
  publishContext
} from '@/api/partyBuilding'
import { Input, Button } from 'element-ui'

export default {
  components: {
    'el-input': Input,
    'el-button': Button
  },
  props: {
    articles: {
      type: Object,
      required: true
    },
    category: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // 页面加载
      loading: false,
      // 当前编辑的文章
      currentArticle: {
        id: null, // 唯一标识（用时间戳生成）
        title: '', // 标题
        content: '' // 正文内容（HTML）
      },
      // 返回的文章id
      articleId: 0,
      // 富文本编辑器实例
      editor: null,
      // 存储占位符和图片URL的映射
      imageMap: new Map()
    }
  },
  mounted() {
    // 初始化编辑器
    this.initEditor()
    this.viewArticle(this.articles)
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

    /** 更新文章 */
    async authorUpload() {
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
      // 保存文章
      await publishContext(article).then(res => {
        data = res.data
      })
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
      this.$message.success('提交成功')
      this.loading = false
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

    /** 查看文章详情（示例：弹窗显示内容） */
    viewArticle(article) {
      this.loading = true
      this.currentArticle = article
      this.$set(this.currentArticle, 'title', article.articleTitle)
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
      if (!this.articles.categoryId) {
        this.$message.warning('请选择文章类型！')
        return false
      }
      if (!this.articles.columnId) {
        this.$message.warning('请选择栏目类型！')
        return false
      }
      return true
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
.action-buttons {
  display: flex;
  justify-content: end;
}
</style>
