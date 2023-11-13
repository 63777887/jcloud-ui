// 创建用户相关的仓库
import { defineStore } from 'pinia'
// 引入接口
import { reqLogin, reqLogout, reqUserInfo } from '@/api/user'
import {
  LoginFormData,
  LoginResponseData,
  TokenData,
  UserInfoResponseData,
} from '@/api/user/type'
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

const routesListStore = useRoutesListStore(pinia)

let userStore = defineStore('User', {
  // 存储数据
  state: (): UserState => {
    return {
      token: GET_ACCESS_TOKEN(),
      avatar: '',
      user: {} as TokenData,
      //存储当前用户是否包含某一个按钮
      buttons: [],
    }
  },
  // 处理逻辑/异步
  actions: {
    async userLogin(data: LoginFormData) {
      const responseData: LoginResponseData = await reqLogin(data)
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
        this.user.username = responseData.data.sysUser.username
        // this.avatar = responseData.data.avatar
        this.user.userId = responseData.data.sysUser.id
        if (responseData.data.buttons) {
          this.buttons = responseData.data.buttons.map((t) => t.permission)
        }
        return responseData
      } else {
        return Promise.reject(new Error(responseData.msg as string))
      }
    },
    async userLogout() {
      // 退出
      const responseData = await reqLogout()
      if (responseData.code == SUCCESS_CODE) {
        // 退出
        this.token = ''
        this.user = {} as TokenData
        this.avatar = ''
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
