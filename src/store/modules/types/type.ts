import { RouteRecordRaw } from 'vue-router'
import {TokenData} from "@/api/user/type";
export interface UserState {
  token: string | null
  avatar: string
  user: TokenData
  buttons: string[]
}

export interface LayoutSetting {
  isCollapse: boolean
  refreshWeb: boolean
  activePath: string
  title: string
}

// 布局配置
export interface ThemeConfigState {
  config: {
    themeDrawer: boolean;
    primary: string;
    isDark: boolean;
    isGrayscale: boolean;
    isInvert: boolean;
    menuBackground: string;
    menuColor: string;
    menuActiveColor: string;
    topBarBackground: string;
    topBarColor: string;
    allowMenuFold: boolean;
    topBarIcon: boolean;
    isCollapse: boolean;
    asideLogo: boolean;
    allowTabs: boolean;
    allowTabsIcon: boolean;
    allowWartermark: boolean;
    openFooter: boolean;
    defaultWartermarkText: string;

  };
}
