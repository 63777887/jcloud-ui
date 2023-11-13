import { ThemeConfigState } from '@/store/modules/types/type'

export const SET_THEME_CONFIG = (themeConfig: ThemeConfigState) => {
  return localStorage.setItem('themeConfig', JSON.stringify(themeConfig))
}
export const GET_THEME_CONFIG = () => {
  return JSON.parse(localStorage.getItem('themeConfig'))
}
export const REMOVE_THEME_CONFIG = () => {
  return localStorage.removeItem('themeConfig')
}
