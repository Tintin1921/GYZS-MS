<template>
  <div class="app-container">
    <div>
      <el-button style="margin:0 0 20px 20px;" type="primary" icon="el-icon-document" @click="exportToExcel">
        导出Excel
      </el-button>
    </div>
    <el-table
      ref="dragTable"
      :data="list"
      row-key="index"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="id"
        prop="id"
        align="center"
        width="50rem"
      >
        <template slot-scope="{row}">
          <span>{{ row.index }}</span>
        </template>
      </el-table-column>
      <el-table-column label="综合评分" align="center">
        <template slot-scope="{row}">
          <span>{{ row.segmentMark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="批次号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.batchNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="叶丝干燥" align="center">
        <el-table-column label="实际值" align="center">
          <template slot-scope="{row}">
            <span>{{ row.叶丝干燥indexValue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工序得分" align="center">
          <template slot-scope="{row}">
            <span>{{ row.叶丝干燥remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权重得分" align="center">
          <template slot-scope="{row}">
            <span>{{ row.叶丝干燥segmentValue }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="筛分加料" align="center">
        <el-table-column label="实际值" align="center">
          <template slot-scope="{row}">
            <span>{{ row.筛分加料indexValue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工序得分" align="center">
          <template slot-scope="{row}">
            <span>{{ row.筛分加料remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权重得分" align="center">
          <template slot-scope="{row}">
            <span>{{ row.筛分加料segmentValue }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import XLSX from 'xlsx'

export default {
  data() {
    return {
      list: [{
        index: '1',
        segmentMark: '25',
        batchNo: 'GX',
        叶丝干燥indexValue: '21',
        叶丝干燥remark: '2',
        叶丝干燥segmentValue: '3',
        筛分加料indexValue: '21',
        筛分加料remark: '2',
        筛分加料segmentValue: '3',
        startTime: '2024-01-05',
        endTime: '2024-01-09'
      },
      {
        index: '2',
        segmentMark: '85',
        batchNo: 'GYHJP',
        叶丝干燥indexValue: '25',
        叶丝干燥remark: '25',
        叶丝干燥segmentValue: '31',
        筛分加料indexValue: '214',
        筛分加料remark: '42',
        筛分加料segmentValue: '23',
        startTime: '2024-01-35',
        endTime: '2024-01-49'
      }]
    }
  },
  methods: {
    exportToExcel() {
      const data = this.list
      // 提取所有的动态字段
      const dynamicFields = Object.keys(data[0])
        .filter(key => key.includes('indexValue') || key.includes('remark') || key.includes('segmentValue'))
        .map(key => {
          const match = key.match(/^[^\d]+/) // 匹配非数字字符的前缀部分
          return match ? match[0] : null // 如果匹配成功则返回前缀，否则返回null
        })
        .filter((value, index, self) => value && self.indexOf(value) === index) // 过滤掉null值，并确保唯一性

      // 基础表头
      const headerRow1 = ['序号', '批次号', '综合得分']
      const headerRow2 = ['', '', ''] // 第一行空白，用于合并单元格

      // 动态表头部分
      dynamicFields.forEach(field => {
        headerRow1.push(field, '', '')
        headerRow2.push('实际值', '工序得分', '权重得分')
      })

      // 追加基础表头
      headerRow1.push('开始时间', '结束时间')
      headerRow2.push('', '')

      // 生成数据行
      const exportData = data.map(item => {
        const row = [
          item.index,
          item.batchNo,
          item.segmentMark
        ]

        dynamicFields.forEach(field => {
          row.push(item[field] || '')
          row.push(item[field] || '')
          row.push(item[field] || '')
        })

        row.push(item.startTime || '')
        row.push(item.endTime || '')
        return row
      })

      // 插入表头
      exportData.unshift(headerRow2) // 插入第二行表头
      exportData.unshift(headerRow1) // 插入第一行表头
      // 创建工作表
      const ws = XLSX.utils.aoa_to_sheet(exportData)

      // 合并单元格设置
      ws['!merges'] = ws['!merges'] || []

      // 合并“序号”、“批次号”、“综合得分”列的上下单元格
      ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 1, c: 0 }}) // 合并序号
      ws['!merges'].push({ s: { r: 0, c: 1 }, e: { r: 1, c: 1 }}) // 合并批次号
      ws['!merges'].push({ s: { r: 0, c: 2 }, e: { r: 1, c: 2 }}) // 合并综合得分

      // 合并动态字段主标题的单元格
      let mergeIndex = 3
      dynamicFields.forEach(() => {
        ws['!merges'].push({ s: { r: 0, c: mergeIndex }, e: { r: 0, c: mergeIndex + 2 }})
        mergeIndex += 3
      })

      // 合并“开始时间”、“结束时间”列的上下单元格
      ws['!merges'].push({ s: { r: 0, c: mergeIndex }, e: { r: 1, c: mergeIndex }}) // 合并开始时间
      ws['!merges'].push({ s: { r: 0, c: mergeIndex + 1 }, e: { r: 1, c: mergeIndex + 1 }}) // 合并结束时间

      // 设置单元格样式(暂不生效)
      const range = XLSX.utils.decode_range(ws['!ref'])
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell_address = { r: R, c: C }
          const cell_ref = XLSX.utils.encode_cell(cell_address)
          if (!ws[cell_ref]) continue
          ws[cell_ref].s = { alignment: { horizontal: 'center' }}
        }
      }

      // 创建工作簿并导出
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
      XLSX.writeFile(wb, 'exported_data.xlsx')
    }
  }
}
</script>
