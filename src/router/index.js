import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import AdminIndex from '../views/AdminIndex'
import EmpIndex from '../views/EmpIndex'

import EmpList from '../views/admin/EmpList'
import DeptList from '../views/admin/DeptList'

import EmpHome from '../views/emp/EmpHome'
import SubmitMission from '../views/emp/SubmitMission'
import SelfOmission from '../views/emp/SelfOmission'
import SelfRecords from '../views/emp/SelfRecords'
import DeptAudit from '../views/emp/DeptAudit'
import DeptOmission from '../views/emp/DeptOmissions'
import DeptRecords from '../views/emp/DeptRecords'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'login',
    component: Login,
    meta:{
      title:"登录"
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta:{
      title:"登录"
    }
  },
  {
    path: '/adminIndex',
    name: 'admin',
    redirect: '/empList',
    component: AdminIndex,
    children:[
      {
        path:'/empList',
        component:EmpList,
        meta:{
          title:"员工信息列表"
        }
      },
      {
        path:'/deptList',
        component:DeptList,
        meta:{
          title:"部门信息列表"
        }
      }
    ],
    meta:{
      title:"管理员主页"
    }
  },
  {
    path: '/empIndex',
    name: 'emp',
    redirect: '/empHome',
    component: EmpIndex,
    meta:{
      title:"员工主页"
    },
    children: [
      {
        path: '/empHome',
        component: EmpHome,
        meta:{
          title:"首页"
        }
      },
      {
        path: '/submitMission',
        component: SubmitMission,
        meta:{
          title:"报工填报"
        }
      },
      {
        path: '/selfOmission',
        component: SelfOmission,
        meta:{
          title:"个人漏报记录"
        }
      },
      {
        path: '/selfRecords',
        component: SelfRecords,
        meta:{
          title:"个人报工记录"
        }
      },
      {
        path: '/deptAudit',
        component: DeptAudit,
        meta:{
          title:"部门审核"
        }
      },
      {
        path: '/deptOmission',
        component: DeptOmission,
        meta:{
          title:"漏报汇总"
        }
      },
      {
        path: '/deptRecords',
        component: DeptRecords,
        meta:{
          title:"部门报工汇总"
        }
      },
    ]
  },
  /*{
    path: '/managerIndex',
    name: 'manager',
    component: ManagerIndex
  },*/
]

const router = new VueRouter({
  routes
})

//解决Uncaught (in promise) NavigationDuplicated: Avoided redundant navigation to current location:
//避免冗余导航到当前位置
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

router.beforeEach((to, from, next) => {
  //获取每个路由的meta信息，赋值给浏览器的标题属性
  window.document.title = to.meta && (to.meta.title || "默认")
  next()
})

export default router
