<template>
  <div class="study-section">
    <div class="study-container">
      <div class="study-left">
        <div class="section-title">
          <i class="el-icon-reading" />
          <span>理论强党</span>
        </div>
        <ul>
          <li v-for="(item, index) in columnData" :key="index">
            <a :href="item.link" target="_blank">{{ item.title }}</a>
          </li>
        </ul>
      </div>
      <div class="study-left">
        <div class="section-title">
          <span>更多新闻</span>
        </div>
        <ul>
          <li v-for="(item, index) in columnData" :key="index">
            <a :href="item.link" target="_blank">{{ item.title }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    columnData: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
