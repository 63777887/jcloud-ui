import { createApp } from 'vue'
import App from '@/App.vue'
// 引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 国际化
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// svg需要配置代码
import 'virtual:svg-icons-register'
//引入自定义插件对象:注册整个项目全局组件
import gloalComponent from '@/components'
//引入模板的全局的样式
import '@/styles/index.scss'
// 导入粒子特效
import Particles from 'particles.vue3'
// 引入路由
import router from '@/router'
// 引入仓库
import pinia from '@/store'
// 路由鉴权
import './permisstion'
// 如果只想导入css变量
import 'element-plus/theme-chalk/dark/css-vars.css'
import {directive} from "@/directive";

// 获取应用实例
const app = createApp(App)
// 使用ElementPlus
app.use(ElementPlus, {
  locale: zhCn,
})
// 安装自定义插件
app.use(gloalComponent)
// 注册路由
app.use(router)
// 安装仓库
app.use(pinia)
app.use(Particles)
directive(app);
// 应用挂在到APP组件
app.mount('#app')
