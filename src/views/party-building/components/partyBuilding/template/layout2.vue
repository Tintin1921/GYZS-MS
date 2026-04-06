<template>
  <div v-loading="loading" class="study-section" element-loading-text="数据加载...">
    <div class="study-container">
      <div class="study-left">
        <div class="section-title">
          <i class="el-icon-reading" />
          <span>{{ originData.title }}</span>
        </div>
        <ul class="read-section">
          <li v-for="(item, index) in originData.dataA" :key="index">
            <a @click="handleClick(item)"> {{ item.articleCategory }} | {{ item.articleTitle }}</a>
          </li>
        </ul>
      </div>
      <div class="study-right">
        <div class="important-opinion">
          <el-tag type="danger">启示</el-tag>
          <el-scrollbar>
            <div class="scroll-content" style="width: 650px">
              <a
                v-for="(item, index) in originData.dataB"
                :key="index"
                @click="handleClick(item)"
              >{{ item.articleTitle }} </a>
            </div>
          </el-scrollbar>
        </div>
        <div class="study-images">
          <a>
            <el-image src="" fit="cover" />
          </a>
          <a>
            <el-image src="" fit="cover" />
          </a>
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
import { getContext } from '@/api/partyBuilding'
import pageRead from '@/views/party-building/components/partyBuilding/pageRead.vue'

export default {
  components: { pageRead },
  props: {
    columnData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      display: false,
      originData: {},
      articleData: {}
    }
  },
  mounted() {
    this.originData = this.columnData
    const dataA = this.columnData.data.filter(item => item.articleCategory !== '启示')
    const dataB = this.columnData.data.filter(item => item.articleCategory === '启示')
    this.originData.dataA = dataA
    this.originData.dataB = dataB
  },
  methods: {
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
.study-section {
  height: 27vh;
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

.read-section {
  height: 17vh;
  overflow-y: auto;
}

.announcement, .notice {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 30px;
  overflow: hidden;
}
</style>
