<template>
  <el-tooltip
    class="item"
    effect="dark"
    content="刷新"
    placement="top"
    :enterable="false"
  >
    <el-button
      size="small"
      icon="Refresh"
      circle
      @click="refreshWeb"
    ></el-button>
  </el-tooltip>
  <el-tooltip
    class="item"
    effect="dark"
    content="全屏"
    placement="top"
    :enterable="false"
  >
    <el-button
      size="small"
      icon="FullScreen"
      circle
      @click="fullScreen"
    ></el-button>
  </el-tooltip>
  <el-tooltip
    class="item"
    effect="dark"
    content="布局设置"
    placement="top"
    :enterable="false"
  >
    <el-button
      size="small"
      icon="Setting"
      circle
      @click="themeSetting"
    ></el-button>
  </el-tooltip>

  <el-image :src="store.user.icon ? store.user.icon : defaultAvatar"></el-image>
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ store.user.username ? store.user.username : '用户未登录' }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="showUserCenter">个人中心</el-dropdown-item>
        <el-dropdown-item @click="logout">退出登陆</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <user-center
    v-if="userDrawer"
    :user-drawer="userDrawer"
    @close="closeUserCenter"
  ></user-center>
  <Theme></Theme>
</template>

<script setup lang="ts">
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import  《组件名称》  from '《组件路径》 ';
import Theme from './theme/index.vue'
import UserCenter from './userCenter/index.vue'
import {
  nextTick,
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onDeactivated,
  onErrorCaptured,
  onMounted,
  onRenderTracked,
  onRenderTriggered,
  onUnmounted,
  onUpdated,
  ref,
} from 'vue'
import layoutSettingStore from '@/store/modules/setting'
import userStore from '@/store/modules/user'
import useThemeConfig from '@/store/modules/themeConfig'
import { useElementPlusTheme } from '@/utils/themeUtil'
import {
  GET_THEME_CONFIG,
  REMOVE_THEME_CONFIG,
  SET_THEME_CONFIG,
} from '@/utils/themeConfigUtil'
import defaultAvatar from '@/assets/images/defaultAvatar.gif'
import { useRoute, useRouter } from 'vue-router'
import watermark from '@/utils/wartermark.ts'
// useElementPlusTheme("#3589ff")
let settingStore = layoutSettingStore()
let store = userStore()
let $router = useRouter()
let $route = useRoute()
let config = useThemeConfig().config
let userDrawer = ref(false)

// 刷新按钮
const refreshWeb = () => {
  settingStore.refreshWeb = !settingStore.refreshWeb
}

const showUserCenter = () => {
  userDrawer.value = true
}

const closeUserCenter = () => {
  userDrawer.value = false
}

// 全屏按钮
const fullScreen = () => {
  // 判断是否是全屏
  const fullscreenElement = document.fullscreenElement

  // 全屏切换
  if (!fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const themeSetting = () => {
  config.themeDrawer = true
  SET_THEME_CONFIG(config)
}

// 退出登录
const logout = async () => {
  await store.userLogout()
  $router.push({ path: '/login', query: { redirect: $route.path } })
}

onBeforeMount(() => {}) // 生命周期 - 挂载之前
onMounted(() => {}) // 生命周期 - 挂载完成（可以访问 DOM 元素）
onBeforeUpdate(() => {}) // 生命周期 - 更新之前
onUpdated(() => {}) // 生命周期 - 更新之后
onBeforeUnmount(() => {}) // 生命周期 - 销毁之前
onUnmounted(() => {}) // 生命周期 - 销毁完成
onErrorCaptured((err) => {}) // 当事件处理程序或生命周期钩子抛出错误时
onRenderTracked((e) => {}) // 渲染的时候可以追踪到
onRenderTriggered((e) => {}) // 重新渲染的时候触发
// 如果页面有 keep-alive 缓存功能,这个两个函数会触发
onActivated(() => {}) // 进入的时候触发
onDeactivated(() => {}) // 离开的时候触发
</script>
<script lang="ts">
export default {
  name: 'Setting',
}
</script>
<style scoped lang="scss">
.el-dropdown {
  color: #fff;
}

.el-image {
  margin-left: 10px;
  margin-right: 10px;
  width: 30px;
  height: 30px;
}
</style>
