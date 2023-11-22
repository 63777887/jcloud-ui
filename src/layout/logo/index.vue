<template>
  <div class="logo">
    <el-image :src="logo" fit="fill"></el-image>
    <p v-if="!config.isCollapse">{{ settingStore.title }}</p>
  </div>
</template>

<script setup lang="ts" name="Logo">
import useThemeConfig from '@/store/modules/themeConfig'
import layoutSettingStore from '@/store/modules/setting'
import logo from '@/assets/images/jcloud.png'
const config = useThemeConfig().config
const settingStore = layoutSettingStore()
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 20px;

  .el-image {
    width: 40px;
    height: 40px;
  }

  p {
    font-size: $base-logo-title-fontSize;
    margin-left: 10px;
    color: var(--el-menu-text-color);
  }
}
</style>
