// 创建用户相关的仓库
import { defineStore } from 'pinia'
// 引入接口
import { LayoutSetting } from '@/store/modules/types/type'
import * as static from '@/console.assert()'
// 引入路由

let layoutSettingStore = defineStore('SettingStore', {
  // 存储数据
  state: (): LayoutSetting => {
    return {
      isCollapse: false,
      refreshWeb: false,
      activePath: '/home',
      title: 'JCloud管理后台',
    }
  },
  // 处理逻辑/异步
  actions: {},
  getters: {},
})

export default layoutSettingStore
