import request from '@/utils/request'

// 获取所有的角色分类列表
export function getRoleCategories() {
  return request({
    url: '/api/system/role-categories',
    method: 'get'
  })
}

// 获取指定的角色列表
export function getRoleList(categoryId) {
  return request({
    url: `/api/system/role-categories/${categoryId}/roles`,
    method: 'get'
  })
}

// 获取指定角色的路由表
export function getRoleRouter(roleId) {
  return request({
    url: `/api/system/roles/${roleId}/routes`,
    method: 'get'
  })
}

// 获取所有角色的人数
export function getPostCount() {
  return request({
    url: '/api/system/employees/statistic/role_employee_count',
    method: 'get'
  })
}

// 修改角色信息
export function updateRoleInfo(data) {
  return request({
    url: '/api/system/roles',
    method: data.method,
    data: data
  })
}

// 更新分类名称
export function updateCategories(data) {
  return request({
    url: '/api/system/role-categories',
    method: 'patch',
    data: data
  })
}

// 删除角色
export function deleteRole(roleId) {
  return request({
    url: `/api/system/roles/${roleId}`,
    method: 'delete'
  })
}

// 批量为多个职工分配角色
export function batchAssignRole(data) {
  return request({
    url: '/api/system/employees/batch-assign-role',
    method: 'post',
    data: data
  })
}

// 删除角色下的指定职工
export function deleteRoles({ employeeId, roleId }) {
  return request({
    url: `/api/system/employees/${employeeId}/roles/${roleId}`,
    method: 'delete'
  })
}
