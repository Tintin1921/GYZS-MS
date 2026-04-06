<template>
  <div>
    <h3>当前： {{ productName }} {{ productRoute }}</h3>
    <h5>已加载点位： {{ tableList.length }} 项</h5>
    <el-divider />
    <el-table
      :key="key"
      :data="tableList"
      :show-header="false"
    >
      <el-table-column type="index" align="center" width="30px" />
      <el-table-column align="center" width="100px">
        <template slot-scope="{row}">
          {{ row.dataPointName.split('_').pop() }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="95px">
        <template slot-scope="{row}">
          <el-tooltip placement="top" content="该指标工艺标准的最大上限（超过该上限时会发出报警）">
            <span>上限：{{ row.upperLimitValue }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" width="95px">
        <template slot-scope="{row}">
          <el-tooltip placement="top" content="该指标工艺标准的最大下限（超过该下限时会发出报警）">
            <span>下限：{{ row.lowerLimitValue }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120px">
        <template slot-scope="{row}">
          <el-tooltip placement="top" :content="`当前安全区间为${row.maxRange} - ${row.minRange}，如果实时数据超过该区间范围则会发出预警`">
            <span>预警强度：{{ parseFloat(1 - row.safeRange).toFixed(2) * 100 }}%</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.switch"
            active-text="开启"
            inactive-text="关闭"
            @change="handleSwitch()"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { generateID } from '@/utils/generateID'

export default {
  props: {
    settingData: {
      type: Object,
      required: true
    },
    qualityStandard: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      productName: '未生产',
      productRoute: '未知生产线',
      tableList: [],
      key: null
    }
  },
  mounted() {
    this.initialization()
  },
  methods: {
    async initialization() {
      const { id } = this.settingData
      const data = this.settingData[id]
      const quality = this.qualityStandard[id]
      if (data === undefined || quality === undefined) {
        this.$message.error('实时数据未加载')
        return
      }
      this.tableList = this.qualityStandard[id]
      const [obj] = data
      const { proName, dataPointName } = obj
      this.productName = proName
      this.productRoute = dataPointName.split('_').shift()
    },
    // 用户操作switch按钮
    handleSwitch() {
      this.$nextTick(() => {
        this.key = generateID()
        const { id } = this.settingData
        const obj = {}
        obj[id] = this.tableList
        this.$emit('handleSetQualityStandard', obj)
      })
    }
  }
}
</script>
