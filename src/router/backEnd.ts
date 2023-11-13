import {useRoutesListStore} from "@/store/modules/routesList";
import pinia from "@/store";
import {anyRoute, constantRoute} from "@/router/routes";
import router from "@/router/index";
import {UserInfoResponseData} from "@/api/user/type";

/**
 * 获取目录下的 .vue、.tsx 全部文件
 * @method import.meta.glob
 * @link 参考：https://cn.vitejs.dev/guide/features.html#json
 */
const viewsModules: any = import.meta.glob('@/views/**/*.{vue,tsx}');
const dynamicViewsModules: Record<string, Function> = Object.assign({}, {...viewsModules});

/**
 * 后端控制路由：初始化方法，防止刷新时路由丢失
 * @method NextLoading 界面 loading 动画开始执行
 * @method useUserInfo().setUserInfos() 触发初始化用户信息 pinia
 * @method useRequestOldRoutes().setRequestOldRoutes() 存储接口原始路由（未处理component），根据需求选择使用
 * @method setAddRoute 添加动态路由
 * @method setFilterMenuAndCacheTagsViewRoutes 设置路由到 pinia routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
 */
export async function initBackEndControlRoutes(userInfoResponseData: UserInfoResponseData) {
    let menuAll = []
    if ((userInfoResponseData.data.sysMenu || []).length > 0) {
        menuAll = await backEndComponent(userInfoResponseData.data.sysMenu);

    }
    //菜单需要的数据整理完毕
    //目前路由器管理的只有常量路由:用户计算完毕异步路由、任意路由动态追加
    ;[...menuAll, anyRoute].forEach((route: any) => {
        router.addRoute(route)
    })

    // 设置路由到 pinia routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
    const storesRoutesList = useRoutesListStore(pinia);
    storesRoutesList.routesList = [...constantRoute, ...menuAll, anyRoute]
}

/**
 * 后端路由 component 转换
 * @param routes 后端返回的路由表数组
 * @returns 返回处理成函数后的 component
 */
export function backEndComponent(routes: any) {
    if (!routes) return;
    return routes.map((item: any) => {
        const firstPath = item.path.split('/')[1]

        if ('/' + firstPath == item.path) {
            // 一级目录给基础组件
            item.component = () => import('@/layout/index.vue')
        } else if (item.path) {
            item.component = dynamicImport(dynamicViewsModules, item.path.split('/:')[0], item);
        }
        if (item.children && item.children.length > 0) {
            item.children = item.children.sort((a: { order: number }, b: { order: number }) => a.order > b.order ? -1 : 1)
            backEndComponent(item.children);
        }
        if (item.children) {
            item.redirect = item.children[0].path;
        }
        item.meta = {title: item.name, icon: item.icon, hidden: item.hidden, tab: item.tab}
        return item;
    });
}

/**
 * 后端路由 component 转换函数
 * @param dynamicViewsModules 获取目录下的 .vue、.tsx 全部文件
 * @param component 当前要处理项 component
 * @returns 返回处理成函数后的 component
 */
export function dynamicImport(dynamicViewsModules: Record<string, Function>, component: string, item: any) {
    const keys = Object.keys(dynamicViewsModules);

    const matchKeys = keys.filter((key) => {
        return key.endsWith(`${component}/index.vue`) || key.endsWith(`/${component}/index.vue`);
    });
    if (matchKeys?.length === 1) {
        const matchKey = matchKeys[0];
        return dynamicViewsModules[matchKey];
    }
    if (matchKeys?.length > 1) {
        return false;
    }
}
