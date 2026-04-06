import request from '@/utils/request'

// 获取烘丝所有的点位信息
export function getDataPoint() {
  return request({
    url: '/api/technology/monitor/datapoint',
    method: 'get'
  })
}

// 根据时间范围获取工段及批次信息
export function getProductData(data) {
  return request({
    url: '/api/technology/statistic/segment-product',
    method: 'get',
    params: data
  })
}

// 根据ProCode、startTime、endTime、segmentCode获取工艺质量指标评分
export function getQualityLevelEvaluate(data) {
  return request({
    url: '/api/technology/statistic/quality-metrics/scores',
    method: 'get',
    params: data
  })
}

// 根据时间范围获取规格/牌号
export function getBatch(data) {
  return request({
    url: '/api/technology/monitor/historical-batch-production-data',
    method: 'get',
    params: data
  })
}

// 获取历史数据信息
export function getHistoricalData(data) {
  return request({
    url: '/api/technology/monitor/historical-data',
    method: 'post',
    data: data
  })
}

// 获取工艺质量标准（仅烘丝）
export function getQualityStandard() {
  return request({
    url: '/api/technology/monitor/quality-standard',
    method: 'get'
  })
}
