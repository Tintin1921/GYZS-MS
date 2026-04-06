<template>
  <div class="study-section" v-loading="loading" element-loading-text="数据加载...">
    <div class="study-container">
      <div class="study-left">
        <div class="section-title">
          <i class="el-icon-reading" />
          <span>{{ columnData.title }}</span>
        </div>
        <ul class="read-section">
          <li v-for="(item, index) in columnData.data" :key="index">
            <a @click="handleClick(item)"> {{ item.articleCategory }} | {{ item.articleTitle }}</a>
          </li>
        </ul>
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
import pageRead from '@/views/party-building/components/partyBuilding/pageRead.vue';

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
      articleData: {}
    }
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

.read-section {
  height: 17vh;
  overflow-y: auto;
}
</style>
