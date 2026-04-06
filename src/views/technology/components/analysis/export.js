import XLSX from 'xlsx'

export function exportXlsx(data, dynamicFields) {
  // 基础表头
  const headerRow1 = ['序号', '批次号', '综合得分']
  const headerRow2 = ['', '', ''] // 第一行空白，用于合并单元格

  // 动态表头部分
  dynamicFields.forEach(field => {
    headerRow1.push(field, '', '')
    headerRow2.push('实际值', '工序得分', '权重得分')
  })

  // 追加基础表头
  headerRow1.push('批次开始时间', '批次结束时间')
  headerRow2.push('', '')
  // 生成数据行
  const exportData = data.map(item => {
    const row = [
      item.index,
      item.batchNo,
      item.segmentMark
    ]

    dynamicFields.forEach(field => {
      row.push(item[field + 'qualityMetricValue'] || '')
      row.push(item[field + 'qualityMetricScoreInSegment'] || '')
      row.push(item[field + 'qualityMetricValue'] || '')
    })

    row.push(item.startTime)
    row.push(item.endTime)
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

  // 设置列宽：调整批次号、开始时间、结束时间的宽度
  ws['!cols'] = [
    { wch: 5 }, // 序号列宽度
    { wch: 16 }, // 批次号列宽度
    { wch: 8 }, // 综合得分列宽度
    ...dynamicFields.flatMap(() => [{ wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }]), // 动态字段的宽度设置为
    { wch: 20 }, // 开始时间列宽度
    { wch: 20 } // 结束时间列宽度
  ]

  // 创建工作簿并导出
  const wb = XLSX.utils.book_new()
  const date = new Date().toLocaleString()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  XLSX.writeFile(wb, `导出的数据表${date}.xlsx`)
}
