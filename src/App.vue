<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import layoutSettingStore from "@/store/modules/setting";
import {nextTick, onMounted, watch} from "vue";
import {useRoute} from "vue-router";
import {GET_THEME_CONFIG} from "@/utils/themeConfigUtil";
import useThemeConfig from "@/store/modules/themeConfig";
import userStore from "@/store/modules/user";

const settingStore = layoutSettingStore();
const themeConfig = useThemeConfig();
const config =themeConfig.config;
const store = userStore();
const route = useRoute()

watch(() => route.path, newRoute => {
  settingStore.activePath = newRoute
})

// 页面加载时
onMounted(() => {
  nextTick(() => {
    // 获取缓存中的布局配置
    if (GET_THEME_CONFIG()) {
      themeConfig.setThemeConfig(GET_THEME_CONFIG());
    }
  });
});
</script>

<style scoped></style>
