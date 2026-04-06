<template>
  <div class="app-container">
    <!--  顶部步骤条  -->
    <div class="top-steps">
      <el-steps :space="200" :active="step - 1" finish-status="success">
        <el-step title="自定义表名" />
        <el-step title="选择数据点位" />
        <el-step title="生成报表" />
      </el-steps>
    </div>
    <!--  中部显示区域  -->
    <div class="mid-center">
      <transition name="fade" mode="out-in">
        <div :key="step">
          <div v-if="step === 1">
            <div class="stepContainer">
              <h3>自定义表名 （最长不超过20个字符）</h3>
              <el-input v-model="titleAndPoint.title" clearable size="small" maxlength="20" show-word-limit style="width: 60%" /><br>
            </div>
          </div>
          <div v-if="step === 2">
            <div class="stepContainer">
              <h3>选择需要查询的点位 共 {{ titleAndPoint.point.length }} 项</h3>
              <el-input v-model="searchPoint" placeholder="输入关键词模糊搜索点位" clearable style="width: 35%;margin-bottom: 10px" @input="handleSearch">
                <i slot="prefix" class="el-icon-search" style="line-height: 40px;vertical-align: middle" />
              </el-input>
              <el-table
                :data="paginatedData"
                border
                fit
                stripe
                highlight-current-row
                :row-key="row => row.id"
                @selection-change="handleCheck"
              >
                <el-table-column label="序号" type="index" align="center" width="75rem" />
                <el-table-column label="工序" prop="segmentName" align="center" width="145rem" />
                <el-table-column label="点位" prop="dataPointName" align="center" min-width="275rem" />
                <el-table-column label="点位代码" prop="dataPointCode" align="center" width="125rem" />
                <el-table-column label="操作" type="selection" :reserve-selection="true" align="center" width="95rem" />
              </el-table>
              <el-pagination
                :current-page="currentPage"
                :page-sizes="[5,10,15]"
                :page-size="pageSize"
                layout="total, sizes,prev, pager, next, jumper"
                :total="filteredData.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
          <div v-if="step === 3">
            <div class="stepContainer">
              <h3>确认图表生成信息</h3>
              <li>路线： {{ selectData.route }}</li>
              <li>工序： {{ selectData.segment }}</li>
              <li>表名： {{ titleAndPoint.title }}</li>
              <span style="font-size: 15px">点位： </span>
              <li v-for="item in titleAndPoint.point" :key="item.dataPointCode">{{ item.dataPointName }}</li>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="step > 1" class="next-btn" :disabled="step === 1" @click="prevStep"><i class="el-icon-arrow-left el-icon--left" />返回</el-button>
      <el-button v-if="step < 3" class="next-btn" :disabled="step === 3" @click="nextStep">继续<i class="el-icon-arrow-right el-icon--right" /></el-button>
      <el-button v-if="step === 3" class="confirm-btn" @click="finish">提交 <i class="el-icon-check" /></el-button>
    </div>
  </div>
</template>

<script>
import { generateID } from '@/utils/generateID'
import { getDataPoint } from '@/api/technology'

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    length: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      // 全局
      step: 1,
      selectData: this.data,
      // 标题和点位
      titleAndPoint: {
        title: null,
        point: []
      },
      // 表格
      tableList: [],
      currentPage: 1,
      pageSize: 5,
      // 模糊搜索
      searchPoint: null
    }
  },
  computed: {
    // 模糊搜索过滤后的数据
    filteredData() {
      const keyword = this.searchPoint
      if (keyword === null) {
        return this.tableList
      } else {
        return this.tableList.filter(item =>
          Object.values(item).some(val =>
            String(val).includes(keyword)
          )
        )
      }
    },
    // 当前页展示的分页数据
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredData.slice(start, end)
    }
  },
  watch: {
    selectData: {
      deep: true,
      handler(val) {
        this.selectData = val
        this.getData()
        this.setTitle()
      }
    }
  },
  created() {
    // 获取点位
    this.getData()
  },
  mounted() {
    this.setTitle()
  },
  methods: {
    getData() {
      getDataPoint().then(res => {
        const { data } = res
        const { route, segment } = this.selectData
        this.dataPointFilter(data.filter(item => item.segmentName.includes(route)), segment)
          .map(item => this.tableList.push({ ...item, 'id': generateID() }))
      })
    },
    setTitle() {
      // 添加默认表名
      const index = this.length + 1
      const { segment, route } = this.selectData
      this.titleAndPoint.title = segment.concat(route + '线 - ' + index)
    },
    // 过滤点位配置
    dataPointFilter(items, select) {
      let arr = []
      let dpKeys = []
      if (select === '叶片处理前段') {
        dpKeys = ['松散', '滚筒']
      } else if (select === '叶片处理后段') {
        dpKeys = ['筛分', '加料']
      } else if (select === '烘丝掺配') {
        dpKeys = ['烘', '叶丝干燥']
      } else if (select === '烟丝加香') {
        dpKeys = ['加香']
      }
      arr = items.filter(item => {
        return dpKeys.some(value => item.dataPointName.includes(value))
      })
      return arr
    },
    // 用户勾选点位
    handleCheck(val) {
      this.titleAndPoint.point = val
    },
    // 搜索时重置到第一页
    handleSearch() {
      this.currentPage = 1
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    // 下一步
    nextStep() {
      if (this.step === 1) {
        if (this.titleAndPoint.title.length < 1) {
          this.$message.error('请填写表名')
          return
        }
      }
      if (this.step === 2) {
        if (this.titleAndPoint.point.length < 1) {
          this.$message.error('请选择点位')
          return
        }
      }
      // 页码累加
      if (this.step < 3) {
        this.step++
      }
    },
    // 上一步
    prevStep() {
      if (this.step > 1) {
        this.step--
      }
    },
    // 提交
    finish() {
      this.$message.success('创建成功！')
      this.$emit('titleAndPoint', this.titleAndPoint)
    }
  }
}
</script>

<style lang="scss" scoped>

.top-steps {
  margin-left: 12rem;
  padding: 5px;
}

.mid-center {
  height: 45vh;
}

.stepContainer {
  padding: 10px;
  margin-top: 1.5rem;
  li {
    font-size: 15px;
    padding: 2px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  margin-right: 1rem;
  .el-button {
    padding: 10px 20px;
    border-radius: 4px;
    transition: all 0.3s;
    color: #fff;

    &+.el-button {
      margin-left: 12px;
    }

    &.next-btn {
      background: linear-gradient(45deg, #409eff, #79bbff);
      border-color: #79bbff;
    }

    &.confirm-btn {
      background: linear-gradient(45deg, #6dc542, #8ddc6b);
      border-color: #8ddc6b;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
