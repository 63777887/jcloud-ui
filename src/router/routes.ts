//对外暴露配置路由(常量路由):全部用户都可以访问到的路由
import {RouteRecordRaw} from 'vue-router'

//任意路由
export const anyRoute = {
    //任意路由
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: {
        title: '任意路由',
        hidden: 2,
        tab: 2,
        icon: 'DataLine',
    },
}


//对外暴露配置路由(常量路由):全部用户都可以访问到的路由
export const constantRoute = [
    {
        //登录
        path: '/login',
        component: () => import('@/views/login/index.vue'),
        name: 'login',
        meta: {
            title: '登录', //菜单标题
            hidden: 2, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
            tab: 2,
            icon: 'Promotion', //菜单文字左侧的图标,支持element-plus全部图标
        },
    },
    {
        //登录成功以后展示数据的路由
        path: '/',
        component: () => import('@/layout/index.vue'),
        name: 'layout',
        meta: {
            title: '',
            hidden: 2,
            tab: 2,
            icon: '',
        },
        redirect: '/home',
        children: [
            {
                path: '/home',
                component: () => import('@/views/home/index.vue'),
                meta: {
                    title: '首页',
                    hidden: 1,
                    tab: 1,
                    icon: 'HomeFilled',
                },
            },
        ],
    },
    {
        //404
        path: '/404',
        component: () => import('@/views/404/index.vue'),
        name: '404',
        meta: {
            title: '404',
            hidden: 2,
            tab: 2,
            icon: 'DocumentDelete',
        },
    },
    {
        path: '/screen',
        component: () => import('@/views/screen/index.vue'),
        name: 'Screen',
        meta: {
            hidden: 1,
            tab: 2,
            title: '数据大屏',
            icon: 'Platform',
        },
    },
]

//
// /**
//  *  基础性路由
//  *
//  * 所有节点都是挂载此节点下
//  */
// // 扩展 RouteMeta 接口
// declare module 'vue-router' {
//     interface RouteMeta {
//         isLink?: string;
//         isHide?: boolean;
//         isAuth?: boolean;
//         isKeepAlive?: boolean;
//         isAffix?: boolean;
//         isIframe?: boolean;
//         roles?: string[];
//         icon?: string;
//     }
// }
//
// /**
//  * 定义静态路由（默认路由）
//  * 前端添加路由，请在此处加
//  */
// export const dynamicRoutes = [
//     {
//         path: '/home',
//         component: () => import('@/views/home/index.vue'),
//         name: 'home',
//         meta: {
//             title: '首页', //菜单标题
//             hidden: false, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
//             icon: 'HomeFilled', //菜单文字左侧的图标,支持element-plus全部图标
//             tab: false, //是否展示在tabs
//         },
//     },
//     {
//         path: '/screen',
//         component: () => import('@/views/screen/index.vue'),
//         name: 'screen',
//         meta: {
//             title: '数据大屏',
//             hidden: false,
//             icon: 'DocumentDelete',
//             tab: false, //是否展示在tabs
//         },
//     },
// ]  as RouteRecordRaw[];
//
// //任意路由
// export const notFoundAndNoPower = [{
//     //任意路由
//     path: '/:pathMatch(.*)*',
//     name: 'Any',
//     component: () => import('@/views/404/index.vue'),
//     meta: {
//         title: '404',
//         hidden: true,
//     },
// }] as RouteRecordRaw []
//
// /**
//  * 定义静态路由（默认路由）
//  */
// export const staticRoutes: Array<RouteRecordRaw> = [
//     {
//         //登录
//         path: '/login',
//         component: () => import('@/views/login/index.vue'),
//         name: 'login',
//         meta: {
//             title: '登录', //菜单标题
//             hidden: true, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
//             icon: 'Promotion', //菜单文字左侧的图标,支持element-plus全部图标
//             tab: false, //是否展示在tabs
//         },
//     }
// ] as RouteRecordRaw[];
//
// /**
//  *  基础性路由
//  *
//  * 所有节点都是挂载此节点下
//  */
// export const baseRoutes = [
//     {
//         //登录成功以后展示数据的路由
//         path: '/',
//         component: () => import('@/layout/index.vue'),
//         name: 'layout',
//         redirect: '/home',
//         meta: {
//             title: 'layout',
//             hidden: true,
//             icon: '',
//             tab: false, //是否展示在tabs
//         },
//         children: [],
//     },
// ] as RouteRecordRaw[];
//
//
// export const test = {
//     //登录成功以后展示数据的路由
//     path: '/',
//     component: () => import('@/layout/index.vue'),
//     name: 'layout',
//     meta: {
//         title: '',
//         hidden: false,
//         icon: '',
//     },
//     redirect: '/home',
//     children: [
//         {
//             path: '/home',
//             component: () => import('@/views/home/index.vue'),
//             meta: {
//                 title: '首页',
//                 hidden: false,
//                 icon: 'HomeFilled',
//             },
//         },
//         {
//             path: '/acl',
//             component: () => import('@/layout/index.vue'),
//             name: 'Acl',
//             meta: {
//                 title: '权限管理',
//                 icon: 'Lock',
//             },
//             redirect: '/acl/user',
//             children: [
//                 {
//                     path: '/acl/user',
//                     component: () => import('@/views/acl/user/index.vue'),
//                     name: 'User',
//                     meta: {
//                         title: '用户管理',
//                         icon: 'User',
//                     },
//                 },
//                 {
//                     path: '/acl/role',
//                     component: () => import('@/views/acl/role/index.vue'),
//                     name: 'Role',
//                     meta: {
//                         title: '角色管理',
//                         icon: 'UserFilled',
//                     },
//                 },
//                 {
//                     path: '/acl/menu',
//                     component: () => import('@/views/acl/menu/index.vue'),
//                     name: 'Permission',
//                     meta: {
//                         title: '菜单管理',
//                         icon: 'Monitor',
//                     },
//                 },
//             ],
//         },
//     ],
// } as RouteRecordRaw
