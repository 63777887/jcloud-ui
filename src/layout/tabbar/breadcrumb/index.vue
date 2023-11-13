<template>
  <el-icon class="topBar-icon" size="22" @click="changeIcon" v-if="config.allowMenuFold">
    <component :is="config.isCollapse ? 'Expand' : 'Fold'"></component>
  </el-icon>
  <el-breadcrumb class="topBar-content" separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="(item, index) in breadcrumbs"
      :key="index"
      :to="item.path"
      v-show="item.meta.title"
    >
      <el-icon v-if="config.topBarIcon">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span style="margin-left: 5px">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import  《组件名称》  from '《组件路径》 ';
import {useRoute} from 'vue-router'
import {
  computed,
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
import useThemeConfig from "@/store/modules/themeConfig";
import {SET_THEME_CONFIG} from "@/utils/themeConfigUtil";

const config = useThemeConfig().config;
const $route = useRoute()

const changeIcon = () => {
  config.isCollapse = !config.isCollapse
  SET_THEME_CONFIG(config)
}
let breadcrumbs = computed(() => {
  return $route.matched.filter((item) => item.path !== '/')
})
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
  name: 'Breadcrumb',
}
</script>
<style scoped lang="scss">
.el-breadcrumb :deep .el-breadcrumb__inner {
  color: var(--next-bg-topBarColor);
  display: flex;
  align-items: center;
}
.el-breadcrumb :deep .el-breadcrumb__inner:hover {
  color: var(--next-bg-topBarColor-light-1);
}
.topBar-icon {
  margin-left: 10px;
  color: var(--next-bg-topBarColor);
}
.topBar-content {
  margin-left: 10px;
}
</style>
