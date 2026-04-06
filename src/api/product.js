import request from '@/utils/request'

// 获取所有的分类列表
export function getTodayPlan() {
  return request({
    url: '/api/production/statistic/today-plan',
    method: 'get'
  })
}
