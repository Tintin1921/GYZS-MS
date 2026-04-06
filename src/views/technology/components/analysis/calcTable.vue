<template>
  <div v-loading="loading" element-loading-text="数据处理中...">
    <h3>统计所选批次的各项指标的平均值</h3>
    <div style="width: 100%;height: 40px;">
      <el-button icon="el-icon-upload" class="el-btn" size="mini" style="float: left;margin-bottom: 0.2rem;" type="primary" @click="handleSaveMode">保存模板</el-button>
    </div>
    <div style="width: 100%">
      <el-checkbox-group v-model="checked">
        <el-checkbox
          v-for="item in checkBox"
          :key="item.key"
          :label="item.label"
          :value="item.value"
        />
      </el-checkbox-group>
    </div>
    <el-table
      :data="calcAll"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="工序" width="150rem" align="center" prop="segment" fixed="left" />
      <el-table-column label="牌号" width="150rem" align="center" prop="proName" fixed="left" />
      <el-table-column label="综合评分" align="center" prop="segmentMark" fixed="left" />
      <el-table-column
        v-for="val in checked"
        :key="val"
        :label="val"
        align="center"
      >
        <el-table-column label="实际值" align="center" width="95rem">
          <template slot-scope="{row}">
            {{ filterData(calcAll, row, val).qualityMetricValue }}
          </template>
        </el-table-column>
        <el-table-column label="工序得分" align="center" width="95rem">
          <template slot-scope="{row}">
            {{ filterData(calcAll, row, val).qualityMetricScore }}
          </template>
        </el-table-column>
        <el-table-column label="权重得分" align="center" width="95rem">
          <template slot-scope="{row}">
            {{ filterData(calcAll, row, val).qualityMetricScoreInSegment }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="开始时间" width="165rem" align="center" prop="miniDate" fixed="right" />
      <el-table-column label="结束时间" width="165rem" align="center" prop="maxDate" fixed="right" />
    </el-table>
  </div>
</template>

<script>
import { generateID } from '@/utils/generateID'
import { formatDate } from '@/utils/formatDate'

export default {
  props: {
    originData: {
      type: Array,
      required: true
    },
    indexName: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      checkBox: [],
      checked: [],
      calcAll: [],
      loading: true
    }
  },
  watch: {
    originData: {
      deep: true,
      handler(val) {
        this.originData = val
      }
    },
    indexName: {
      deep: true,
      handler(val) {
        this.indexName = val
      }
    }
  },
  mounted() {
    const copyData = this.originData
    // 初始化结果对象
    const keysToSkip = ['index', 'batchNo', 'startTime', 'endTime', 'id', 'segment', 'proName']
    // 初始化累加器对象
    const extractedData = copyData.map(item => {
      const newObj = {}
      Object.keys(item).forEach(key => {
        if (!keysToSkip.includes(key)) {
          newObj[key] = parseFloat(item[key])
        }
      })
      return newObj
    })
    // 计算平均值
    const result = extractedData.reduce((acc, obj) => {
      Object.keys(obj).forEach(key => {
        if (!acc[key]) {
          acc[key] = 0
        }
        acc[key] += obj[key]
      })
      return acc
    })
    // 保留小数
    Object.keys(result).forEach(key => {
      result[key] = parseFloat((result[key] / copyData.length).toFixed(2))
    })
    // 添加工序和牌号
    const maxDate = copyData.reduce((max, current) => {
      return current['startTime'] > max ? current['startTime'] : max
    }, copyData[0]['startTime'])
    const minDate = copyData.reduce((min, current) => {
      return current['startTime'] < min ? current['startTime'] : min
    }, copyData[0]['startTime'])
    result['maxDate'] = maxDate
    result['miniDate'] = minDate
    result['segment'] = copyData[0].segment
    result['proName'] = copyData[0].proName
    result['id'] = generateID()
    this.calcAll = [result]
    // 此处需要将indexName也就是存放列头的列表组合成适用于多选框的对象的集合
    const tmpList = []
    this.indexName.map((item, index) => {
      const obj = {}
      obj.index = index
      obj.label = item
      obj.value = item
      tmpList.push(obj)
    })
    this.checkBox = tmpList
    this.checked = this.indexName
    this.loading = false
  },
  methods: {
    // 根据指标来过滤数据
    filterData(origin, row, val) {
      let obj = null
      const index = row.index
      const dataList = origin.filter(item => item.index === index)[0]
      for (const item in dataList) {
        if (item.includes(val)) {
          obj = {
            qualityMetricScore: `${dataList[val + 'qualityMetricScore']}`,
            qualityMetricScoreInSegment: `${dataList[val + 'qualityMetricScoreInSegment']}`,
            qualityMetricValue: `${dataList[val + 'qualityMetricValue']}`
          }
        }
      }
      if (obj === null) {
        obj = {
          qualityMetricScore: '/',
          qualityMetricScoreInSegment: '/',
          qualityMetricValue: '/'
        }
      }
      return obj
    },
    handleSaveMode() {
      // 判断要添加的模板是否在mode列表内
      let data = JSON.parse(sessionStorage.getItem('mode'))
      if (data === null) {
        data = []
      }
      this.calcAll[0]['date'] = formatDate(new Date())
      data.push(this.calcAll[0])
      sessionStorage.setItem('indexName', JSON.stringify(this.indexName))
      sessionStorage.setItem('mode', JSON.stringify(data))
      this.$message.success('保存成功')
    }
  }
}
</script>

<style scoped>
  .el-btn {
    padding: 10px 20px;
    border-radius: 4px;
    transition: all 0.3s;
    background: linear-gradient(45deg, #409eff, #79bbff);
    border-color: #79bbff;
  }
  .el-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
  }

</style>
