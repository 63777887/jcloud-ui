<template>
  <el-container class="layout-container">
    <!--      侧边栏-->
    <el-aside class="layout-aside" :class="{ fold: config.isCollapse }">
      <Logo v-if="config.asideLogo"></Logo>
      <!--        滚动组件-->
      <el-scrollbar class="scrollbar">
        <el-menu
          :default-active="$router.path"
          :collapse="config.isCollapse"
          :collapse-transition="false"
          unique-opened
          router
        >
          <Menu :menuList="routesListStore.routesList"></Menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <!--    主体-->
    <el-container>
      <!--    头部-->
      <el-header class="layout-header">
        <Tabbar></Tabbar>
      </el-header>
      <!--      右侧内容主体-->
      <el-main class="layout-main">
        <!--      右侧内容主体-->
        <Main></Main>
      </el-main>
      <el-footer v-if="config.openFooter">
        <p>Copyright © 2023.</p>
        <a href="https://gitee.com/musi1996/jcloud">
          https://gitee.com/musi1996/jcloud
        </a>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import  《组件名称》  from '《组件路径》 ';
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import Main from './main/index.vue'
import Tabbar from './tabbar/index.vue'
import userStore from '@/store/modules/user'
import layoutSettingStore from '@/store/modules/setting'
import {
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
} from 'vue'
import { useRoute } from 'vue-router'
import { useRoutesListStore } from '@/store/modules/routesList'
import useThemeConfig from '@/store/modules/themeConfig'

let $router = useRoute()
let store = userStore()
const routesListStore = useRoutesListStore()
let settingStore = layoutSettingStore()
const themeConfig = useThemeConfig()
const config = themeConfig.config

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
  name: 'Layout',
}
</script>

<style scoped lang="scss">
.fold {
  width: 75px !important;
}

.el-menu {
  border-right: none;
  background-color: var(--next-bg-menuBackground);
}

.layout-container {
  width: 100%;
  height: 100vh;

  .layout-aside {
    width: $base-menu-width;
    background-color: var(--next-bg-menuBackground);

    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);
    }
  }

  .layout-header {
    overflow: hidden;
    height: auto;
    --el-header-padding: 0;
    color: white;
  }
}

.el-footer {
  background: #fff;
  border-top: 1px solid #d0d0d0;
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    color: #4c4d4f;
    padding-right: 10px;
  }

  a {
    color: #4c4d4f;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
}
</style>
