<template>
  <el-tabs
      v-model="editableTabsValue"
      type="border-card"
      class="tabs"
      @tab-remove="removeTab"
      @tab-change="changeTab"
  >
    <el-tab-pane
        key="home"
        label="首页"
        name="/home"
        :closable="false"
    >
    </el-tab-pane>
    <el-tab-pane
        v-for="item in editableTabs"
        :key="item.path"
        :label="item.title"
        :name="item.path"
        :closable="item.path!=='home'"
    >
      <template #label>
        <span class="custom-tabs-label">
          <el-icon v-if="config.allowTabsIcon">
                      <component :is="item.icon"></component>
                    </el-icon>
          <span>{{ item.title }}</span>
        </span>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import  《组件名称》  from '《组件路径》 ';
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
  ref
} from 'vue'
import {GET_TAGS_VIEW_LIST, REMOVE_TAGS_VIEW_ITEM} from "@/utils/tabs";
import {TabPaneName} from "element-plus";
import router from "@/router";
import layoutSettingStore from "@/store/modules/setting";
import useThemeConfig from "@/store/modules/themeConfig";


let editableTabs = ref()
const settingStore = layoutSettingStore();
const config = useThemeConfig().config;

const removeTab = (targetName: string) => {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.path === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.path
        } else {
          activeName = '/home'
        }
      }
    })
  }
  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => tab.path !== targetName)
  settingStore.activePath = activeName
  REMOVE_TAGS_VIEW_ITEM(targetName)
}

const storageTagsChange = (event) => {
  if (event.type === 'storageTagsChange') {
    // 处理变化的操作
    const tagsViewList = GET_TAGS_VIEW_LIST();
    editableTabs.value = JSON.parse(tagsViewList)
  }
}


const changeTab = (name: TabPaneName) => {
  router.push(name)
}

let editableTabsValue = computed({
  get() {
    return settingStore.activePath
  },
  set(newValue) {
  }
})

onBeforeMount(() => {
})// 生命周期 - 挂载之前
onMounted(() => {
  const tagsViewList = GET_TAGS_VIEW_LIST();
  editableTabs.value = JSON.parse(tagsViewList)
  window.addEventListener('storageTagsChange', storageTagsChange);
})// 生命周期 - 挂载完成（可以访问 DOM 元素）
onBeforeUpdate(() => {
})// 生命周期 - 更新之前
onUpdated(() => {
})// 生命周期 - 更新之后
onBeforeUnmount(() => {
  window.removeEventListener('storageTagsChange', storageTagsChange);
})// 生命周期 - 销毁之前
onUnmounted(() => {
})// 生命周期 - 销毁完成
onErrorCaptured((err) => {
})// 当事件处理程序或生命周期钩子抛出错误时
onRenderTracked((e) => {
})// 渲染的时候可以追踪到
onRenderTriggered((e) => {
})// 重新渲染的时候触发
// 如果页面有 keep-alive 缓存功能,这个两个函数会触发
onActivated(() => {
})// 进入的时候触发
onDeactivated(() => {
})// 离开的时候触发

</script>

<style scoped lang="scss">

.el-tabs {
  --el-tabs-header-height: 35px;
  border: none;

  :deep .el-tabs__nav {
    padding: 0 20px;
  }
  :deep .el-tabs__item {
    border-radius: 50px;
  }
}
.custom-tabs-label {
  display: flex;
  align-items: center;
  span {
    margin-left: 3px;
  }
}

</style>
