<template>
  <div>
    等待后续...
  </div>
</template>

<script setup lang="ts">
import {
  nextTick,
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate, onDeactivated,
  onErrorCaptured,
  onMounted,
  onRenderTracked, onRenderTriggered,
  onUnmounted,
  onUpdated, reactive, ref, toRefs
} from "vue";

onBeforeMount(() => {
}) // 生命周期 - 挂载之前
onMounted(async () => {
}) // 生命周期 - 挂载完成（可以访问 DOM 元素）
onBeforeUpdate(() => {
}) // 生命周期 - 更新之前
onUpdated(() => {
}) // 生命周期 - 更新之后
onBeforeUnmount(() => {
}) // 生命周期 - 销毁之前
onUnmounted(() => {
}) // 生命周期 - 销毁完成
onErrorCaptured((err) => {
}) // 当事件处理程序或生命周期钩子抛出错误时
onRenderTracked((e) => {
}) // 渲染的时候可以追踪到
onRenderTriggered((e) => {
}) // 重新渲染的时候触发
// 如果页面有 keep-alive 缓存功能,这个两个函数会触发
onActivated(() => {
}) // 进入的时候触发
onDeactivated(() => {
}) // 离开的时候触发
</script>

<style scoped lang="scss">

</style>
