import { onBeforeMount } from 'vue'
import tinycolor from 'tinycolor2'

const html = document.documentElement

/** 变量前缀 */
const PRE = '--el-color-primary'
/** 浅色变量前缀 */
const PRE_LIGHT = `${PRE}-light`
/** 深色变量前缀 */
const PRE_DARK = `${PRE}-dark`
/** 色阶 */
// const Levels = [3, 5, 7, 8, 9]
const Levels = [1, 2, 3, 4, 5, 6, 7, 8, 9]

/** 白色 */
const WHITE = '#FFFFFF'
/** 黑色 */
const BLACK = '#000000'

export { PRE, PRE_LIGHT, PRE_DARK, Levels, WHITE, BLACK }

/**
 * 更换颜色的方法
 * @param color 颜色
 */
export const changeTheme = (color?: string | null) => {
  if (!color) {
    console.warn('未获取到颜色的值')
    return
  }
  // 设置主要颜色变量 --el-color-primary
  html.style.setProperty(PRE, color)
  // 循环设置色阶颜色
  // --el-color-primary-light-${level}
  Levels.forEach((level) => {
    html.style.setProperty(
      `${PRE_LIGHT}-${level}`,
      tinycolor(color).lighten(10).toString(),
    )
  })
  // 设置主要暗色
  // --el-color-primary-dark-2
  html.style.setProperty(
    `${PRE_DARK}-2`,
    tinycolor(color).darken(20).toString(),
  )
}

export const getLightColor = (color: string, level: number): string => {
  if (!color) {
    console.warn('未获取到颜色的值')
    return ''
  }
  return tinycolor(color).lighten(level).toString()
}

export function useElementPlusTheme(color?: string) {
  onBeforeMount(() => {
    changeTheme(color)
  })

  return {
    changeTheme,
  }
}
