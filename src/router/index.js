import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    hidden: true
  }
]

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'dashboard',
    meta: {
      title: '主页',
      icon: 'dashboard',
      roles: []
    },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: {
          title: '主页',
          roles: []
        }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人信息', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/party-building',
    component: Layout,
    redirect: '/party-building/partyBuilding',
    name: 'PartyBuilding',
    meta: {
      title: '红色党建',
      icon: 'star',
      roles: []
    },
    children: [
      {
        path: 'partyBuilding',
        component: () => import('@/views/party-building/partyBuilding.vue'),
        name: 'PartyBuilding',
        meta: {
          title: '党建专栏',
          icon: 'star',
          roles: []
        }
      },
      {
        path: 'authorColumn',
        component: () => import('@/views/party-building/authorColumn.vue'),
        name: 'AuthorColumn',
        meta: {
          title: '作者专栏',
          icon: 'edit',
          roles: []
        }
      },
      {
        path: 'management',
        component: () => import('@/views/party-building/management.vue'),
        name: 'Management',
        meta: {
          title: '后台管理',
          icon: 'tree',
          roles: []
        }
      }
    ]
  },
  {
    path: '/technology',
    component: Layout,
    redirect: '/technology/technologyAnalysis',
    name: 'Technology',
    meta: {
      title: '工艺模块',
      icon: 'chart',
      roles: []
    },
    children: [
      {
        path: 'technologyIndex',
        component: () => import('@/views/technology/technologyIndex.vue'),
        name: 'TechnologyIndex',
        meta: {
          title: '生产概况',
          icon: 'tab',
          roles: []
        }
      },
      {
        path: 'technologyAnalysis',
        component: () => import('@/views/technology/technologyAnalysis.vue'),
        name: 'TechnologyAnalysis',
        meta: {
          title: '工艺报表',
          icon: 'form',
          roles: []
        }
      },
      {
        path: 'technologyCharts',
        component: () => import('@/views/technology/technologyCharts.vue'),
        name: 'TechnologyCharts',
        meta: {
          title: '工艺图表',
          icon: 'example',
          roles: []
        }
      }
    ]
  },
  {
    path: '/training',
    component: Layout,
    redirect: '/training/TrainingLibrary',
    name: 'Training',
    meta: {
      title: '培训模块',
      icon: 'component',
      roles: []
    },
    children: [
      {
        path: 'trainingLibrary',
        component: () => import('@/views/training/trainingLibrary.vue'),
        name: 'TrainingLibrary',
        meta: {
          title: '资料浏览',
          icon: 'documentation',
          roles: []
        }
      },
      {
        path: 'trainingLearning',
        component: () => import('@/views/training/trainingLearning.vue'),
        name: 'TrainingLearning',
        meta: {
          title: '学习中心',
          icon: 'form',
          roles: []
        }
      },
      {
        path: 'trainingManagement',
        component: () => import('@/views/training/trainingManagement.vue'),
        name: 'TrainingManagement',
        meta: {
          title: '培训管理',
          icon: 'example',
          roles: []
        }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/rolePermission',
    name: 'Permission',
    meta: {
      title: '权限模块',
      icon: 'lock',
      roles: []
    },
    children: [
      {
        path: 'rolePermission',
        component: () => import('@/views/permission/rolePermission.vue'),
        name: 'RolePermission',
        meta: {
          title: '权限管理',
          icon: 'password',
          roles: []
        }
      },
      {
        path: 'roleTest',
        component: () => import('@/views/permission/roleTest.vue'),
        name: 'RoleTest',
        meta: {
          title: '测试中心',
          icon: 'tab',
          roles: []
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由
}

export default router
