// 创建用户相关的仓库
import { defineStore } from 'pinia'
// 引入接口
import {
  reqPasswordLogin,
  reqLogout,
  reqUserInfo,
  reqCaptchaLogin,
} from '@/api/login'
import {
  AccountLoginFormData,
  LoginResponseData,
  SysUser,
  TokenData,
  UserInfoResponseData,
} from '@/api/login/type'
import { UserState } from '@/store/modules/types/type'
import {
  GET_ACCESS_TOKEN,
  REMOVE_ACCESS_TOKEN,
  REMOVE_REFRESH_TOKEN,
  SET_ACCESS_TOKEN,
  SET_REFRESH_TOKEN,
} from '@/utils/token'
// 引入路由
import { REMOVE_TAGS_VIEW_LIST } from '@/utils/tabs'
import { useRoutesListStore } from '@/store/modules/routesList'
import pinia from '@/store'
import { SUCCESS_CODE } from '@/api/base/type'
import watermark from '@/utils/wartermark.ts'

const routesListStore = useRoutesListStore(pinia)

let userStore = defineStore('User', {
  // 存储数据
  state: (): UserState => {
    return {
      token: GET_ACCESS_TOKEN(),
      user: {} as SysUser,
      //存储当前用户是否包含某一个按钮
      buttons: [],
    }
  },
  // 处理逻辑/异步
  actions: {
    async userLogin(data: any, grantType: String) {
      let responseData: LoginResponseData
      if (grantType == 'sms') {
        responseData = await reqCaptchaLogin(data)
      } else {
        responseData = await reqPasswordLogin(data)
      }
      if (responseData.code == SUCCESS_CODE) {
        let token: string = responseData.data.access_token
        SET_ACCESS_TOKEN(token)
        SET_REFRESH_TOKEN(responseData.data.refresh_token)
        this.token = token
        return 'ok'
      } else {
        return Promise.reject(new Error(responseData.msg as string))
      }
    },
    async userInfo() {
      //    获取用户信息存储
      const responseData: UserInfoResponseData = await reqUserInfo()
      if (responseData.code == SUCCESS_CODE) {
        this.user = responseData.data.sysUser
        if (responseData.data.buttons) {
          this.buttons = responseData.data.buttons.map((t) => t.permission)
        }
        return responseData
      } else {
        return Promise.reject(new Error(responseData.msg as string))
      }
    },
    async userLogout() {
      watermark.del()
      // 退出
      const responseData = await reqLogout()
      if (responseData.code == SUCCESS_CODE) {
        // 退出
        this.token = ''
        this.user = {} as TokenData
        REMOVE_ACCESS_TOKEN()
        REMOVE_REFRESH_TOKEN()
        REMOVE_TAGS_VIEW_LIST()
        routesListStore.removeRoutesList()
        return 'ok'
      } else {
        return Promise.reject(new Error(responseData.message as string))
      }
    },
  },
  getters: {},
})

export default userStore
