import request from '@/utils/request'

// 获取所有的培训文档
export function getTrainingFile() {
  return request({
    url: 'api/training/files/all',
    method: 'get'
  })
}

// 下载文档
export function fileDownload(fileId) {
  return request({
    url: `api/training/files/${fileId}/download`,
    method: 'get'
  })
}

// 预览文档
export function previewFile(fileId) {
  return request({
    url: `/api/training/files/${fileId}/preview-url`,
    method: 'get'
  })
}

// 删除文档
export function fileDelete(fileId) {
  return request({
    url: `/api/training/files/${fileId}`,
    method: 'delete'
  })
}

// 上传文档
export function updateFileInfo(data) {
  return request({
    url: '/api/training/files',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data
  })
}

// 获取题库
export function getQuestionsBand() {
  return request({
    url: '/api/training/questions/banks',
    method: 'get'
  })
}

// 创建培训任务/获取所有培训任务
export function learningOrder(data, method) {
  return request({
    url: '/api/training/tasks',
    method: method,
    data: data
  })
}

// 删除培训任务
export function delOrder(taskId) {
  return request({
    url: `/api/training/tasks/${taskId}`,
    method: 'delete'
  })
}

// 根据任务ID获取该任务下所有学员的任务详情
export function orderDetails(taskId) {
  return request({
    url: `/api/training/tasks/${taskId}/trainees/task-details`,
    method: 'get'
  })
}

// 获取学员任务摘要面板列表
export function getTaskSummary(data) {
  return request({
    url: '/api/training/tasks/trainees/task-summary',
    method: 'post',
    data: data
  })
}

// 获取当前学员的所有培训任务及详细信息
export function getTaskDetails() {
  return request({
    url: '/api/training/my/tasks',
    method: 'get'
  })
}

// 获取当前学员的培训任务学习数据统计摘要
export function getUserSummary() {
  return request({
    url: '/api/training/my/tasks/summary',
    method: 'get'
  })
}

// 自动保存试卷答案
export function updateExam(data) {
  return request({
    url: '/api/training/my/tasks/exam-paper/answer/auto-save',
    method: 'post',
    data: data
  })
}

// 更新当前学员的任务进度
export function updateProgress(taskId, data) {
  return request({
    url: `/api/training/my/tasks/${taskId}/progress`,
    method: 'patch',
    data: data
  })
}

// 根据学员ID获取该学员所有任务详情
export function getDetailById(employeeId) {
  return request({
    url: `/api/training/tasks/trainees/${employeeId}/task-detail`,
    method: 'get'
  })
}

// 管理员提交评分
export function setScoring(data) {
  return request({
    url: '/api/training/tasks/exam-paper/scoring',
    method: 'post',
    data: data
  })
}

// 提交任务
export function submitOrder(data) {
  return request({
    url: '/api/training/my/tasks/exam-paper/submit',
    method: 'post',
    data: data
  })
}

