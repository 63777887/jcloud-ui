<template>
  <el-drawer
    v-model="config.themeDrawer"
    :before-close="settingCancel"
    size="250"
  >
    <template #header>
      <h4>布局设置</h4>
    </template>
    <template #default>
      <el-scrollbar>
        <el-form label-position="left" label-width="150px">
          <el-divider content-position="left">主题设置</el-divider>
          <el-form-item label="主题颜色">
            <el-color-picker
              @change="changeTheme"
              v-model="config.primary"
              show-alpha
              :predefine="predefineColors"
            />
          </el-form-item>
          <el-form-item label="暗黑模式">
            <el-switch
              @change="changeDark"
              v-model="config.isDark"
              inline-prompt
              active-icon="MoonNight"
              inactive-icon="Sunny"
            />
          </el-form-item>
          <el-form-item label="灰色模式">
            <el-switch
              @change="changeGrayscale"
              v-model="config.isGrayscale"
              inline-prompt
              active-icon="MoonNight"
              inactive-icon="Sunny"
            />
          </el-form-item>
          <el-form-item label="色弱模式">
            <el-switch
              @change="changeIsInvert"
              v-model="config.isInvert"
              inline-prompt
              active-icon="MoonNight"
              inactive-icon="Sunny"
            />
          </el-form-item>
          <el-divider content-position="left">菜单设置</el-divider>
          <el-form-item label="菜单背景颜色">
            <el-color-picker
              @change="changeMenuBackground"
              v-model="config.menuBackground"
              show-alpha
              :predefine="predefineColors"
            />
          </el-form-item>
          <el-form-item label="菜单字体颜色">
            <el-color-picker
              @change="changeMenuTextColor"
              v-model="config.menuColor"
              show-alpha
              :predefine="predefineColors"
            />
          </el-form-item>
          <el-form-item label="菜单高亮颜色">
            <el-color-picker
              @change="changeMenuActiveTextColor"
              v-model="config.menuActiveColor"
              show-alpha
              :predefine="predefineColors"
            />
          </el-form-item>
          <el-divider content-position="left">顶部设置</el-divider>
          <el-form-item label="顶部背景颜色">
            <el-color-picker
              @change="changeTopBarBackground"
              v-model="config.topBarBackground"
              show-alpha
              :predefine="predefineColors"
            />
          </el-form-item>
          <el-form-item label="顶部字体颜色">
            <el-color-picker
              @change="changeTopBarTextColor"
              v-model="config.topBarColor"
              show-alpha
              :predefine="predefineColors"
            />
          </el-form-item>
          <el-form-item label="开启菜单折叠">
            <el-switch
              @change="SET_THEME_CONFIG(config)"
              v-model="config.allowMenuFold"
              inline-prompt
              active-icon="MoonNight"
              inactive-icon="Sunny"
            />
          </el-form-item>
          <el-form-item label="开启顶部图标">
            <el-switch
              @change="SET_THEME_CONFIG(config)"
              v-model="config.topBarIcon"
              inline-prompt
              active-icon="MoonNight"
              inactive-icon="Sunny"
            />
          </el-form-item>
          <el-divider content-position="left">页面设置</el-divider>
          <el-form-item label="菜单折叠">
            <el-switch
              @change="SET_THEME_CONFIG(config)"
              v-model="config.isCollapse"
              inline-prompt
              active-icon="MoonNight"
              inactive-icon="Sunny"
            />
          </el-form-item>
          <el-form-item label="侧边栏Logo">
            <el-switch
              @change="SET_THEME_CONFIG(config)"
              v-model="config.asideLogo"
              inline-prompt
              active-icon="MoonNight"
              inactive-icon="Sunny"
            />
          </el-form-item>
          <el-form-item label="开启标签页">
            <el-switch
              @change="SET_THEME_CONFIG(config)"
              v-model="config.allowTabs"
              inline-prompt
              active-icon="MoonNight"
              inactive-icon="Sunny"
            />
          </el-form-item>
          <el-form-item label="开启标签页图标">
            <el-switch
              @change="SET_THEME_CONFIG(config)"
              v-model="config.allowTabsIcon"
              inline-prompt
              active-icon="MoonNight"
              inactive-icon="Sunny"
            />
          </el-form-item>
          <el-form-item label="开启水印">
            <el-switch
              @change="changeWartermark"
              v-model="config.allowWartermark"
              inline-prompt
              active-icon="MoonNight"
              inactive-icon="Sunny"
            />
          </el-form-item>
          <el-form-item label="开启页脚">
            <el-switch
              @change="changeFooter"
              v-model="config.openFooter"
              inline-prompt
              active-icon="MoonNight"
              inactive-icon="Sunny"
            />
          </el-form-item>
          <el-button
            class="copy-config-btn-reset"
            type="info"
            @click="restoreDefaultConfig"
          >
            <el-icon class="refresh-icon">
              <component :is="'RefreshRight'"></component>
            </el-icon>
            恢复默认配置
          </el-button>
        </el-form>
      </el-scrollbar>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="theme">
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import  《组件名称》  from '《组件路径》 ';
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
  ref,
} from 'vue'
import { useElementPlusTheme } from '@/utils/themeUtil'
import pinia from '@/store'
import userStore from '@/store/modules/user'
import {
  REMOVE_THEME_CONFIG,
  SET_THEME_CONFIG,
} from '@/utils/themeConfigUtil.ts'
import useThemeConfig from '@/store/modules/themeConfig'

// 主体配置
let themeConfig = useThemeConfig(pinia)
let config = themeConfig.config
const store = userStore()
const { changeTheme } = useElementPlusTheme(config.primary)
//收集开关的数据
let dark = ref<boolean>(false)

const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

//switch开关的chang事件进行暗黑模式的切换
const changeDark = () => {
  themeConfig.syncDark()
  SET_THEME_CONFIG(config)
}
//switch开关的chang事件进行灰色模式的切换
const changeGrayscale = () => {
  themeConfig.syncGrayscale(true)
  SET_THEME_CONFIG(config)
}

//switch开关的chang事件进行色弱模式的切换
const changeIsInvert = () => {
  themeConfig.syncIsInvert()
  SET_THEME_CONFIG(config)
}

//菜单主体颜色的切换
const changeMenuBackground = () => {
  themeConfig.syncMenuBackground()
  SET_THEME_CONFIG(config)
}

//菜单字体颜色的切换
const changeMenuTextColor = () => {
  themeConfig.syncMenuTextColor()
  SET_THEME_CONFIG(config)
}

//菜单字体高亮颜色的切换
const changeMenuActiveTextColor = () => {
  themeConfig.syncMenuActiveTextColor()
  SET_THEME_CONFIG(config)
}

//菜单字体高亮颜色的切换
const changeTopBarTextColor = () => {
  themeConfig.syncTopBarTextColor()
  SET_THEME_CONFIG(config)
}

//顶部栏背景颜色的切换
const changeTopBarBackground = () => {
  themeConfig.syncTopBarBackground()
  SET_THEME_CONFIG(config)
}

const changeWartermark = () => {
  const username = store.user?.username || config.defaultWartermarkText
  themeConfig.syncWartermark(username)
  SET_THEME_CONFIG(config)
}

const restoreDefaultConfig = () => {
  REMOVE_THEME_CONFIG()
  window.location.reload()
}

const settingCancel = () => {
  config.themeDrawer = false
  SET_THEME_CONFIG(config)
}

onBeforeMount(() => {}) // 生命周期 - 挂载之前
onMounted(() => {
  // 初始化主题样式
  const username = store.user?.username || config.defaultWartermarkText
  themeConfig.initThemeStyle(username)
}) // 生命周期 - 挂载完成（可以访问 DOM 元素）
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

<style scoped lang="scss">
.copy-config-btn-reset {
  width: 100%;
  margin: 10px 0 0;
  .refresh-icon {
    margin-right: 10px;
  }
}
</style>
