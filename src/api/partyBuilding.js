import request from '@/utils/request'

// 新增/更新栏目
export function uploadColumns(data) {
  return request({
    url: 'api/party-building/articles/columns/admin',
    method: 'post',
    data: data
  })
}

// 获取所有栏目
export function getColumns() {
  return request({
    url: 'api/party-building/articles/columns/admin/list',
    method: 'get'
  })
}

// 获取所有启用栏目
export function getEnableColumns() {
  return request({
    url: 'api/party-building/articles/columns/author/list/enabled',
    method: 'get'
  })
}

// 获取文章分类
export function getCategory(data) {
  return request({
    url: 'api/party-building/articles/categories/list',
    method: 'get',
    data: data
  })
}

// 上传图片获取URL链接
export function imageURL(data) {
  return request({
    url: 'api/party-building/articles/author/image-url',
    method: 'post',
    data: data
  })
}

// 上传保存草稿文本
export function saveDraft(data) {
  return request({
    url: 'api/party-building/articles/author/draft',
    method: 'post',
    data: data
  })
}

// 发布文章
export function publishContext(data) {
  return request({
    url: 'api/party-building/articles/author/publish',
    method: 'post',
    data: data
  })
}

// 上传保存图片
export function saveImage(articleId, data) {
  return request({
    url: `api/party-building/articles/author/${articleId}/image`,
    method: 'post',
    data: data
  })
}

// 分页条件查询文章列表(用户)
export function queryColumns(data) {
  return request({
    url: 'api/party-building/articles/author/page',
    method: 'post',
    data: data
  })
}

// 分页条件查询文章列表(管理员)
export function queryAdminColumns(data) {
  return request({
    url: 'api/party-building/articles/admin/page',
    method: 'post',
    data: data
  })
}

// 获取文章（可编辑）
export function getEditContext(articleId) {
  return request({
    url: `api/party-building/articles/author/${articleId}`,
    method: 'get'
  })
}

// 获取文章
export function getContext(articleId) {
  return request({
    url: `/api/party-building/articles/user/${articleId}`,
    method: 'get'
  })
}

// 删除文章
export function delContext(articleId) {
  return request({
    url: `/api/party-building/articles/${articleId}`,
    method: 'delete'
  })
}

// 审核文章
export function audit(data) {
  return request({
    url: 'api/party-building/articles/admin/audit',
    method: 'post',
    data: data
  })
}

// 审核文章（全部通过）
export function auditAllPass(data) {
  return request({
    url: 'api/party-building/articles/admin/audit/all-pass',
    method: 'post'
  })
}

// 获取待审核的文章记录
export function auditRecords(data) {
  return request({
    url: 'api/party-building/articles/admin/audit-records/page',
    method: 'get',
    params: data
  })
}

// 获取所有轮播图
export function getCarousel() {
  return request({
    url: 'api/party-building/carousel/admin/all',
    method: 'get'
  })
}

// 添加轮播图
export function uploadCarousel(data) {
  return request({
    url: 'api/party-building/carousel/admin',
    method: 'post',
    data: data
  })
}

// 删除轮播
export function deleteCarousel(carouselId) {
  return request({
    url: `api/party-building/carousel/admin/${carouselId}`,
    method: 'delete'
  })
}
