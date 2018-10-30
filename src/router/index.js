import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const routes = [
  {
   path: '*',
   component: resolve => require(['@/page/common/404.vue'], resolve)
  }, {
    path: '/',
    component: resolve => require(['@/page/login.vue'], resolve)
  }, {
    path: '/login',
    component: resolve => require(['@/page/login.vue'], resolve)
  }, {
    path: '/home',
    component: resolve => require(['@/page/home.vue'], resolve),
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: '/internet-thing/index',  //物联框架首页
        component: resolve => require(['@/page/internet-thing/index.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/applicationList',  //应用管理 -- 应用列表
        component: resolve => require(['@/page/internet-thing/app-authority/app-manage/application-list.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/applicationDetails',  //应用管理 -- 应用详情
        component: resolve => require(['@/page/internet-thing/app-authority/app-manage/application-details.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/companyGather',  //公司应用 -- 公司列表主页面
        component: resolve => require(['@/page/internet-thing/app-authority/company-app/company-gather.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/companyDetails',  //公司应用 -- 当前公司详情页面
        component: resolve => require(['@/page/internet-thing/app-authority/company-app/company-details.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/companyFacility',  //公司应用 -- 公司设备展示页面
        component: resolve => require(['@/page/internet-thing/app-authority/company-app/company-facility.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/facilityList',  //终端设备 -- 终端设备主页面
        component: resolve => require(['@/page/internet-thing/terminal-manage/terminal-facility/facility-list.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/facilityBatchenter',  //终端设备 -- 终端设备批量录入
        component: resolve => require(['@/page/internet-thing/terminal-manage/terminal-facility/facility-batchenter.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/calculate/index',  //计算框架首页
        component: resolve => require(['@/page/calculate/index.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/operationSDK',  //SDK首页
        component: resolve => require(['@/page/internet-thing/resource-manage/SDK/operationSDK.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/operationSDKDetail',  //SDK详情
        component: resolve => require(['@/page/internet-thing/resource-manage/SDK/operationSDKDetail.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/operationServer',  //服务器环境列表
        component: resolve => require(['@/page/internet-thing/resource-manage/Server/operationServer.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/operationServerDetail',  //服务器环境 -- 详情
        component: resolve => require(['@/page/internet-thing/resource-manage/Server/operationServerDetail.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/operationAPK',  //安装包列表
        component: resolve => require(['@/page/internet-thing/resource-manage/APK/operationAPK.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/operationAPKDetail',  //安装包 -- 详情
        component: resolve => require(['@/page/internet-thing/resource-manage/APK/operationAPKDetail.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/operationAPKTwin',  //安装包 -- 分发列表页
        component: resolve => require(['@/page/internet-thing/resource-manage/APK/operationAPKTwin.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/algorManage',  //算法管理 -- 主页面
        component: resolve => require(['@/page/calculate/algorithm-manage/algorManage.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/algorManageDetail',  //算法管理 -- 详情页面
        component: resolve => require(['@/page/calculate/algorithm-manage/algorManageDetail.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/algorithmOrder',  //算法订购 -- 主页面
        component: resolve => require(['@/page/calculate/algorithm-order/algorithmOrder.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/algorithmSetting',  //算法订购 -- 订购页面
        component: resolve => require(['@/page/calculate/algorithm-order/algorithmSetting.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/auditRecord',  //申请纪录
        component: resolve => require(['@/page/calculate/audit-record/auditRecord.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }, {
        path: '/auditRecordDetail',  //申请纪录详情
        component: resolve => require(['@/page/calculate/audit-record/auditRecordDetail.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/downRecordList',  //算法下载记录
        component: resolve => require(['@/page/calculate/down-record/downRecordList.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/secretKeyManage/apply',  //秘钥管理
        component: resolve => require(['@/page/calculate/secret-key-manage/apply.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/secretKeyManage/apply-info',  //申请秘钥-填写信息
        component: resolve => require(['@/page/calculate/secret-key-manage/apply-info.vue'], resolve)
      },
      {
        path: '/secretKeyManage/list', //申请秘钥-秘钥管理
        component: resolve => require(['@/page/calculate/secret-key-manage/list.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/portShow',  //接口调试展示页面
        component: resolve => require(['@/page/calculate/demo/portShow.vue'], resolve),
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/algorithmCall',  //接口调试展示页面
        component: resolve => require(['@/page/calculate/demo/algorithmCall.vue'], resolve),
        meta: {
          requireAuth: true
        }
      }
    ]
  }
]

const router = new Router({
  routes
});

var localStorage = window.localStorage

router.beforeEach((to, from, next) => {
  var storage = JSON.parse(localStorage.getItem('USER_INFO'))
  if (to.fullPath === '/login' || to.fullPath === '/') {
    if (storage) {
      next({
        path: '/internet-thing/index',
        query: {redirect: to.fullPath}
      })
      return
    }
  }
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
      if (storage) {  // 通过storage判断是否登录
        next();
      } else {
        next({
          path: '/login',
            query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
        })
      }
    } else {
      next();
    }
  })

export default router;