<template>
  <!--  路由组件出口的位置-->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!--      渲染路由的子路由-->
      <component v-if="flag" :is="Component" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import layoutSettingStore from '@/store/modules/setting'
import { nextTick, ref, watch } from 'vue'

let flag = ref(true)

let settingStore = layoutSettingStore()
watch(
  () => settingStore.refreshWeb,
  () => {
    // 点击刷新
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>
<script lang="ts">
export default {
  name: 'Main',
}
</script>
<style scoped lang="scss">
.fade-enter-form {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: all 1s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
