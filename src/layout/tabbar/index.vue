<template>
  <div class="tabbar">
    <div class="tabbar-top">
      <div class="tabbar-left">
        <Breadcrumb></Breadcrumb>
      </div>
      <div class="tabbar-right">
        <Setting></Setting>
      </div>
    </div>
    <div class="tabbar-bottom" v-if="config.allowTabs">
      <Tabs></Tabs>
    </div>
  </div>
</template>

<script setup lang="ts" name="Tabbar">
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
import Tabs from './tabs/index.vue'
import useThemeConfig from '@/store/modules/themeConfig'

const config = useThemeConfig().config
</script>

<style scoped lang="scss">
.tabbar {
  display: flex;
  flex-direction: column;
  //width: 100%;
  height: 100%;
  .tabbar-top {
    height: $base-breadcrumb-height;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // 渐变色
    //background-image: linear-gradient(to right, #1a2b52, #001529, #1a2b52);
    background-color: var(--next-bg-topBarBackground);
    .tabbar-left,
    .tabbar-right {
      display: flex;
      align-items: center;
    }
  }
  .tabbar-bottom {
    height: $base-tabbar-height - $base-breadcrumb-height;
  }
}
</style>
