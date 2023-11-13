import { defineStore } from 'pinia'
import { ThemeConfigState } from '@/store/modules/types/type'
import { changeTheme, getLightColor } from '@/utils/themeUtil'
import watermark from '@/utils/wartermark'

/**
 * 修改配置时：
 * 1、需要每次都清理 "window.localStorage" 浏览器永久缓存
 * 2、或者点击布局配置最底部 "一键恢复默认" 按钮即可看到效果
 */
let useThemeConfig = defineStore('themeConfig', {
  state: (): ThemeConfigState => {
    return {
      config: {
        // 是否开启布局配置抽屉
        themeDrawer: false,

        /**
         * 全局主题
         */
        // 默认 primary 主题颜色
        primary: '#3589ff',
        // 是否开启深色模式
        isDark: false,
        // 是否开启灰色模式
        isGrayscale: false,
        // 是否开启色弱模式
        isInvert: false,

        /**
         * 菜单设置
         */
        // 默认菜单导航背景颜色
        menuBackground: '#001529',
        // 默认菜单导航字体颜色
        menuColor: '#FFFFFF',
        // 默认菜单高亮背景色
        menuActiveColor: '#9acd32',

        /**
         * 顶栏设置
         */
        // 默认顶栏导航背景颜色
        topBarBackground: '#001529',
        // 默认顶栏导航字体颜色
        topBarColor: '#FFF',
        allowMenuFold: true,
        topBarIcon: true,

        /**
         * 界面设置
         */
        // 是否开启菜单水平折叠效果
        isCollapse: false,
        // 是否开启侧边栏Logo
        asideLogo: true,
        // 是否开启标签页
        allowTabs: true,
        // 是否开启标签页图标
        allowTabsIcon: false,
        // 是否开启水印
        allowWartermark: true,
        // 是否开启页脚
        openFooter: true,
        // 水印文案
        defaultWartermarkText: 'Jcloud',
      },
    }
  },
  actions: {
    setThemeConfig(data) {
      this.config = data
    },
    syncMenuBackground(color?: string) {
      if (!color) {
        color = this.config.menuBackground
      }
      color = color as string
      const lightLevel = 3
      document.documentElement.style.setProperty(
        '--next-bg-menuBackground',
        color,
      )
      document.documentElement.style.setProperty(
        '--el-menu-hover-bg-color',
        getLightColor(color, lightLevel),
      )
      document.documentElement.style.setProperty(
        '--next-bg-menuBackground-light-1',
        getLightColor(color, lightLevel),
      )
    },
    syncDark() {
      if (this.config.isDark) {
        this.config.isGrayscale = false
        this.config.isInvert = false
        this.syncGrayscale()
        this.syncIsInvert()
      }
      //获取HTML根节点
      let html = document.documentElement
      //判断HTML标签是否有类名dark
      if (this.config.isDark) {
        html.className = 'dark'
        this.syncMenuBackground('#000')
      } else {
        html.className = ''
        this.syncMenuBackground()
      }
    },
    syncGrayscale(needClear = true) {
      const appEle = document.body
      if (this.config.isGrayscale) {
        this.config.isDark = false
        this.config.isInvert = false
        this.syncDark()
        appEle.setAttribute('style', `filter: grayscale(100%)`)
      } else if (needClear) {
        appEle.setAttribute('style', `filter: grayscale(0%)`)
      }
    },
    syncIsInvert(needClear = true) {
      const appEle = document.body
      if (this.config.isInvert) {
        this.config.isDark = false
        this.config.isGrayscale = false
        this.syncDark()
        appEle.setAttribute('style', `filter: invert(80%)`)
      } else if (needClear) {
        appEle.setAttribute('style', `filter: invert(0%)`)
      }
    },
    syncMenuTextColor() {
      document.documentElement.style.setProperty(
        '--el-menu-text-color',
        this.config.menuColor,
      )
    },
    syncMenuActiveTextColor() {
      document.documentElement.style.setProperty(
        '--el-menu-active-color',
        this.config.menuActiveColor,
      )
    },
    syncTopBarBackground() {
      document.documentElement.style.setProperty(
        '--next-bg-topBarBackground',
        this.config.topBarBackground,
      )
    },
    syncTopBarTextColor() {
      const lightLevel = 50
      document.documentElement.style.setProperty(
        '--next-bg-topBarColor',
        this.config.topBarColor,
      )
      document.documentElement.style.setProperty(
        '--next-bg-topBarColor-light-1',
        getLightColor(this.config.topBarColor, lightLevel),
      )
    },
    syncWartermark(wartermarkText: string) {
      this.config.allowWartermark
        ? watermark.set(wartermarkText)
        : watermark.del()
    },
    initThemeStyle(username: string) {
      // 初始化主题
      changeTheme(this.config.primary)
      // 初始化暗黑模式（内部已经初始化了菜单背景样式）
      this.syncDark()
      // 初始化灰色模式
      this.syncGrayscale(false)
      // 初始化色弱模式
      this.syncIsInvert(false)
      // 初始化菜单文字样式
      this.syncMenuTextColor()
      // 初始化菜单文字高亮样式
      this.syncMenuActiveTextColor()
      // 初始化顶部栏背景样式
      this.syncTopBarBackground()
      // 初始化顶部栏文字样式
      this.syncTopBarTextColor()
      // 初始化水印样式
      this.syncWartermark(username)
    },
  },
  getters: {},
})

export default useThemeConfig
