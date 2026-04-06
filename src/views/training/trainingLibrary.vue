<template>
  <div class="app-container">
    <el-form ref="form" :model="selectData">
      <el-card class="custom-top-query-card" shadow="hover">
        <div class="card-header">
          <span class="title"><i slot="prefix" class="el-icon-s-fold custom-icon" />培训资料浏览</span>
          <div class="header-actions">
            <el-tooltip placement="top" content="操作指引">
              <el-button type="text" icon="el-icon-guide" @click.prevent.stop="guide" />
            </el-tooltip>
          </div>
        </div>
        <el-divider />
        <el-row :gutter="24" align="middle" class="query-row">
          <el-col id="step1" :span="5">
            <el-tooltip placement="top" content="输入关键词模糊搜索资料">
              <el-input v-model="selectData.searchUser" placeholder="输入关键词模糊搜索资料" clearable style="width: 100%;margin-bottom: 10px">
                <i slot="prefix" class="el-icon-search" style="line-height: 40px;vertical-align: middle" />
              </el-input>
            </el-tooltip>
          </el-col>
          <!-- 日期选择 -->
          <el-col id="step2" :span="5" class="query-item">
            <el-form-item id="step1" prop="date">
              <el-tooltip placement="top" content="选择需要查询资料的上传时间范围">
                <el-date-picker
                  v-model="selectData.date"
                  type="datetimerange"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  style="width: 100%;"
                  @change="handleSelectDate"
                />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col id="step3" :span="3.5" class="query-item">
            <el-form-item prop="route">
              <el-tooltip placement="top" content="选择需要查询资料的分类">
                <el-select
                  id="step2"
                  v-model="selectData.class"
                  placeholder="资料分类"
                  filterable
                  clearable
                  @change="handleSelectClass"
                >
                  <el-option
                    v-for="(item, index) in filterClass"
                    :key="index"
                    :value="item.skillCategory"
                    :label="item.skillCategory"
                  />
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <el-table
      id="step4"
      v-loading="loading"
      :data="paginatedData"
      border
      fit
      stripe
      class="custom-table"
      element-loading-text="操作处理中..."
    >
      <el-table-column label="序号" type="index" align="center" width="95px" />
      <el-table-column label="分类" align="center" prop="skillCategory" width="155px" />
      <el-table-column label="名称" align="center" prop="fileName" min-width="135px">
        <template slot-scope="{ row }">
          <button>
            <el-tooltip placement="top" content="点击预览文档">
              <span @click="handlePreview(row)">{{ row.fileName }}</span>
            </el-tooltip>
          </button>
        </template>
      </el-table-column>
      <el-table-column label="上传人" align="center" prop="creatorName" width="155px" />
      <el-table-column label="上传时间" align="center" prop="createTime" width="255px" />
      <el-table-column label="操作" align="center" width="205px">
        <template slot-scope="{ row }">
          <button>
            <el-tooltip placement="top" content="点击下载文档">
              <span @click="handleDownload(row)">下载</span>
            </el-tooltip>
          </button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="filteredData.length"
      :page-size="limit"
      :page-sizes="[10,15,25]"
      :current-page="page"
      layout="total, sizes,prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import steps from './components/library/guideStep'
import 'driver.js/dist/driver.min.css'
import Driver from 'driver.js'
import {fileDownload, getTrainingFile, previewFile} from '@/api/training'

export default {
  data() {
    return {
      // 用户选择的数据
      selectData: {
        date: null,
        class: null,
        searchUser: undefined
      },
      // 表格数据
      tempData: [],
      originData: [],
      // 是否加载
      loading: true,
      // 分页
      limit: 15,
      page: 1
    }
  },
  computed: {
    filterClass() {
      const map = new Map()
      this.tempData.forEach(item => map.set(item['skillCategory'], item))
      return Array.from(map.values())
    },
    filteredData() {
      const keyword = this.selectData.searchUser
      if (keyword === undefined) {
        return this.tempData
      } else {
        return this.tempData.filter(item =>
          Object.values(item).some(val =>
            String(val).includes(keyword)
          )
        )
      }
    },
    paginatedData() {
      const startIndex = (this.page - 1) * this.limit
      const endIndex = startIndex + this.limit
      return this.filteredData.slice(startIndex, endIndex)
    }
  },
  created() {
    this.getData()
    // 初始化操作引导实例
    this.driver = new Driver()
  },
  methods: {
    // 操纵引导
    guide() {
      this.driver.defineSteps(steps)
      this.driver.start()
    },
    getData() {
      getTrainingFile().then(res => {
        const { data } = res
        this.tempData = data
        this.originData = data
        this.loading = false
      })
    },
    // 模糊搜索以及翻页
    handleSearch() {
      this.page = 1
    },
    handleSizeChange(val) {
      this.limit = val
      this.page = 1
    },
    handleCurrentChange(val) {
      this.page = val
    },
    handleSelectDate(e) {
      if (e !== null) {
        const [startTime, endTime] = e
        this.tempData = this.originData.filter(item => new Date(item.createTime) >= startTime && new Date(item.createTime) <= endTime)
        return
      }
      this.tempData = this.originData
    },
    handleSelectClass(e) {
      this.tempData = this.originData.filter(item => item.skillCategory.includes(e))
    },
    handleDownload(row) {
      this.loading = true
      const { trainingFileId } = row
      fileDownload(trainingFileId).then(res => {
        const blob = new Blob([res], {
          type: 'application/octet-stream;charset=UTF-8'
        })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = row.fileName
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(link.href)
        this.loading = false
        this.$message.success('下载成功')
      })
    },
    handlePreview(row) {
      this.loading = true
      const { trainingFileId } = row
      previewFile(trainingFileId).then(res => {
        const { data } = res
        window.open(data, 'newWindow', 'width=1000, height=800, left=200, top=100')
        this.loading = false
      })
    }
  }
}
</script>
