<template>
  <div class="selector-container">
    <!-- 横置布局 -->
    <el-row :gutter="20" class="horizontal-layout">
      <el-col :span="6" v-for="(item, index) in 4" :key="index">
        <div class="selector-item">
          <el-radio-group v-model="radioValue">
            <el-radio :label="1">选项{{ index+1 }}</el-radio>
          </el-radio-group>
        </div>
      </el-col>
    </el-row>

    <!-- 竖置布局 -->
    <el-row :gutter="20" class="vertical-layout">
      <el-col :span="24">
        <div class="selector-item">
          <el-select v-model="selectValue" placeholder="请选择">
            <el-option label="选项1" value="1"></el-option>
            <el-option label="选项2" value="2"></el-option>
            <el-option label="选项3" value="3"></el-option>
            <el-option label="选项4" value="4"></el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.selector-container {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.selector-item {
  padding: 15px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.selector-item:hover {
  transform: translateY(-2px);
}

/* 横置布局 */
.horizontal-layout {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

/* 竖置布局 */
.vertical-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 单选框样式 */
.el-radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.el-radio__inner {
  width: 20px;
  height: 20px;
  border-color: #409eff !important;
}

.el-radio__input.is-checked .el-radio__inner {
  background: #409eff !important;
  border-color: #409eff !important;
}

.el-radio__label {
  font-size: 14px;
  color: #333;
}

/* 下拉框样式 */
.el-select {
  width: 100%;
}

.el-input__inner {
  border-radius: 4px !important;
  border-color: #dcdfe6 !important;
  height: 40px !important;
}

.el-select-dropdown__item.selected {
  color: #409eff;
  font-weight: 500;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .horizontal-layout {
    flex-direction: column;
  }
  
  .el-col {
    width: 100% !important;
  }
}
</style>