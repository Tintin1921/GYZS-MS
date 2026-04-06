<template>
  <el-row :gutter="615" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('A')">
        <el-tooltip placement="left" content="切换实时数据显示至烘丝A线">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="chart" class-name="card-panel-icon" />
          </div>
        </el-tooltip>
        <div class="card-panel-description">
          <div class="card-panel-text" style="color: #118a78">
            烘丝A线
          </div>
          <div>
            <div class="card-panel-text">
              瞬时量
            </div>
            <count-to :start-val="6000" :end-val="filterData('A', '流量')" :duration="3000" class="card-panel-num" />
          </div>
          <div>
            <div class="card-panel-text">
              出口水分
            </div>
            <count-to :start-val="10" :end-val="filterData('A', '含水率')" :duration="3000" class="card-panel-num" />
          </div>
          <div>
            <div class="card-panel-text">
              出口温度
            </div>
            <count-to :start-val="45" :end-val="filterData('A', '温度')" :duration="3000" class="card-panel-num" />
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('B')">
        <el-tooltip placement="left" content="切换实时数据显示至烘丝B线">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="chart" class-name="card-panel-icon" />
          </div>
        </el-tooltip>
        <div class="card-panel-description">
          <div class="card-panel-text" style="color: #118a78">
            烘丝B线
          </div>
          <div>
            <div class="card-panel-text">
              主工艺气
            </div>
            <count-to :start-val="12000" :end-val="filterData('B', '主工艺气')" :duration="3000" class="card-panel-num" />
          </div>
          <div>
            <div class="card-panel-text">
              出口水分
            </div>
            <count-to :start-val="10" :end-val="filterData('B', '含水率')" :duration="3000" class="card-panel-num" />
          </div>
          <div>
            <div class="card-panel-text">
              出口温度
            </div>
            <count-to :start-val="45" :end-val="filterData('B', '温度')" :duration="3000" class="card-panel-num" />
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('C')">
        <el-tooltip placement="left" content="切换实时数据显示至烘丝C线">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="chart" class-name="card-panel-icon" />
          </div>
        </el-tooltip>
        <div class="card-panel-description">
          <div class="card-panel-text" style="color: #118a78">
            烘丝C线
          </div>
          <div>
            <div class="card-panel-text">
              瞬时量
            </div>
            <count-to :start-val="6000" :end-val="filterData('C', '流量')" :duration="3000" class="card-panel-num" />
          </div>
          <div>
            <div class="card-panel-text">
              出口水分
            </div>
            <count-to :start-val="10" :end-val="filterData('C', '含水率')" :duration="3000" class="card-panel-num" />
          </div>
          <div>
            <div class="card-panel-text">
              出口温度
            </div>
            <count-to :start-val="45" :end-val="filterData('C', '温度')" :duration="3000" class="card-panel-num" />
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: {
    realData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      data: []
    }
  },
  watch: {
    realData: {
      deep: true,
      handler(val) {
        this.data = val
      }
    }
  },
  methods: {
    filterData(route, event) {
      const res = this.data.filter(item => item.dataPointName.includes(route) && item.dataPointName.includes(event))
      if (res.length === 0) {
        return 0
      }
      return parseInt(res[0].dataPointValue)
    },
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    width: 590px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #118a78;
      }

      .icon-message {
        background: #118a78;
      }

      .icon-money {
        background: #118a78;
      }
    }

    .icon-people {
      color: #118a78;
    }

    .icon-message {
      color: #118a78;
    }

    .icon-money {
      color: #118a78;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      display: flex;
      font-weight: bold;
      margin: 26px;
      .card-panel-text {
        margin-left: 15px;
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        margin-left: 15px;
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
