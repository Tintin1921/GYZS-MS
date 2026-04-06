<template>
  <div class="app-container">
    <div class="header">
      <div class="header-left">
        <el-card style="height: 290px">
          <el-form ref="form" :model="selectData" :rules="rules">
            <el-form-item prop="columnName" label="父栏目名" required>
              <el-input v-model="selectData.columnName" placeholder="请输入" style="width: 60%" />
            </el-form-item>
            <el-form-item label="* 子栏目名">
              <el-tooltip placement="top" content="目前暂未启用二级分类">
                <el-input disabled placeholder="请输入" style="width: 60%" />
              </el-tooltip>
            </el-form-item>
            <el-form-item prop="layoutType" label="页面布局" required>
              <el-select v-model="selectData.layoutType" placeholder="请选择" style="width: 60%">
                <el-option v-for="(item, index) in options" :key="index" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-form>
          <h4 v-show="selectData.layoutType === '布局一'">拉通布局
          </h4>
          <h4 v-show="selectData.layoutType === '布局二'">左文右图
          </h4>
          <h4 v-show="selectData.layoutType === '布局三'">左右布局
          </h4>
        </el-card>
      </div>
      <el-divider class="vertical-divider" direction="vertical" />
      <div class="header-right">
        <el-card class="cardPosition" :class="{ 'active': selectData.layoutType === '布局三' }">
          <div class="study-section">
            <div class="study-container">
              <div class="study-left">
                <div class="section-title">
                  <i class="el-icon-reading" />
                  <span>左标题</span>
                </div>
                <ul>
                  <li v-for="(item, index) in studyItems" :key="index">
                    <a>{{ item.title }}</a>
                  </li>
                </ul>
              </div>
              <div class="study-left">
                <div class="section-title">
                  <span>更多新闻</span>
                </div>
                <ul>
                  <li v-for="(item, index) in studyItems" :key="index">
                    <a>{{ item.title }}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </el-card>
        <el-card class="cardPosition" :class="{ 'active': selectData.layoutType === '布局二' }">
          <div class="study-section">
            <div class="study-container">
              <div class="study-left">
                <div class="section-title">
                  <i class="el-icon-reading" />
                  <span>标题</span>
                </div>
                <ul>
                  <li v-for="(item, index) in studyItems" :key="index">
                    <a :href="item.link" target="_blank">{{ item.title }}</a>
                  </li>
                </ul>
              </div>
              <div class="study-right">
                <div class="important-opinion">
                  <el-tag type="danger">要论</el-tag>
                  <el-scrollbar>
                    <div class="scroll-content">
                      <a>
                        要论标题1
                      </a>
                      <a>
                        要论标题2
                      </a>
                    </div>
                  </el-scrollbar>
                </div>

                <div class="study-images">
                  <el-image src="" />
                  <el-image src="" />
                </div>
              </div>
            </div>
          </div>
        </el-card>
        <el-card class="cardPosition" :class="{ 'active': selectData.layoutType === '布局一' }">
          <div class="study-section">
            <div class="study-container">
              <div class="study-left">
                <div class="section-title">
                  <i class="el-icon-reading" />
                  <span>标题</span>
                </div>
                <ul>
                  <li v-for="(item, index) in studyItems" :key="index">
                    <a :href="item.link" target="_blank">{{ item.title }}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <div class="bottom">
      <el-button type="primary" icon="el-icon-refresh" class="reset-btn" @click="handleReset">重置</el-button>
      <el-button type="primary" icon="el-icon-check" class="query-btn" @click="handleConfirm">确认</el-button>
    </div>
  </div>
</template>

<script>
import { uploadColumns } from '@/api/partyBuilding'

export default {
  data() {
    return {
      // 用户选择的数据
      selectData: {
        columnName: '',
        layoutType: '布局一'
      },
      rules: {
        'columnName': [{
          required: true, message: '请输入父栏目名', trigger: 'blur'
        }],
        'layoutType': [{
          required: true, message: '请选择布局', trigger: 'blur'
        }]
      },
      studyItems: [
        { title: '标题｜此处展示已发布文章标题1' },
        { title: '标题｜此处展示已发布文章标题2' }
      ],
      options: [{ 'value': '布局一' }, { 'value': '布局二' }]
      // options: [{ 'value': '布局一' }, { 'value': '布局二' }, { 'value': '布局三' }]
    }
  },
  methods: {
    // 点击生成图表后方法启动
    handleConfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm(`确认创建 '${this.selectData.columnName}' 栏目吗？`, '确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(async() => {
            uploadColumns(this.selectData).then(() => {
              this.$message.success(`已创建 '${this.selectData.columnName}' 栏目`)
            })
          })
        }
      })
    },
    handleReset() {
      this.selectData.columnName = ''
      this.selectData.layoutType = '布局一'
      this.$message.success('操作成功')
    }
  }
}

</script>

<style scoped>
.header {
  display: flex;
}

.header-left {
  position: relative;
  width: 350px;
}

.vertical-divider {
  display: inline-block;
  height: 18rem;
}

.header-right {
  position: relative;
  width: 100%;
}

.cardPosition {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 290px;
  opacity: 0;
  transform: translateX(20px) scale(0.98);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 0.1);
  will-change: transform, opacity;
  z-index: 0;
}

.cardPosition.active {
  opacity: 1;
  transform: translateX(0) scale(1);
  z-index: 1;
}

.bottom {
  display: flex;
  justify-content: end;
  margin-top: 24px;
}

/* 效果展示区域 */
.study-section {
  padding: 30px 0;
  margin-top: 10px;
  border-radius: 8px;
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

.important-opinion {
  flex-shrink: 0;
}

.study-images {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  height: 100px;
}
</style>
