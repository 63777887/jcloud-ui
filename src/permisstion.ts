// 路由鉴权
import router from '@/router'

import { close, start } from '@/nprogress'
import pinia from '@/store'
import userStore from '@/store/modules/user'
import setting from '@/setting'
import { SET_TAGS_VIEW_LIST } from '@/utils/tabs'
import { initBackEndControlRoutes } from '@/router/backEnd'
import { UserInfoResponseData } from '@/api/user/type'
import layoutSettingStore from '@/store/modules/setting'

let store = userStore(pinia)
const settingStore = layoutSettingStore()

router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = `${settingStore.title} - ${to.meta.title}`
  start()
  const token = store.token
  const user = store.user
  if (token) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (user != null && user.username) {
        SET_TAGS_VIEW_LIST(to)
        next()
      } else {
        try {
          // 没有用户信息时，发请求获取用户信息
          let responseData: UserInfoResponseData = await store.userInfo()
          // 后端控制路由：路由数据初始化，防止刷新时丢失
          await initBackEndControlRoutes(responseData)
          SET_TAGS_VIEW_LIST(to)
          //万一:刷新的时候是异步路由,有可能获取到用户信息、异步路由还没有加载完毕,出现空白的效果
          next({ ...to })
        } catch (error) {
          console.log(error)
          await store.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

router.afterEach((to: any, from: any) => {
  close()
})
