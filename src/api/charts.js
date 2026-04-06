import request from '@/utils/request'

// 根据日期获取当日计划产量(kg)和实际产量(kg)
export function dailyOutput(data) {
  return request({
    url: 'api/production/statistic/daily-output',
    method: 'get',
    params: data
  })
}

// 获取日期当天ABC线松散、烘掺工序的出口参数合格率
export function qualificationRates(data) {
  return request({
    url: 'api/technology/statistic/quality-metrics/qualification-rates',
    method: 'get',
    params: data
  })
}

// 获取日期当天ABC线加料、加香工序的精度平均值
export function accuracyAverages(data) {
  return request({
    url: 'api/technology/statistic/quality-metrics/accuracy-averages',
    method: 'get',
    params: data
  })
}

// 根据日期获取当日各工序批次完成情况
export function processBatchStatus(data) {
  return request({
    url: 'api/production/statistic/process-batch-status',
    method: 'get',
    params: data
  })
}

// 根据日期获取机电修设备维保完成情况
export function dailyCompletionStatus(data) {
  return request({
    url: 'api/equipment/maintain/statistic/daily-completion-status',
    method: 'get',
    params: data
  })
}

// 根据日期获取当天生产调度计划
export function getSchedulePlan(data) {
  return request({
    url: 'api/production/statistic/schedule/daily-plan',
    method: 'get',
    params: data
  })
}
