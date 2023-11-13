import { defineStore } from 'pinia';
import router from "@/router";
import {constantRoute} from "@/router/routes";

/**
 * 路由列表
 * @methods setRoutesList 设置路由数据
 * @methods setColumnsMenuHover 设置分栏布局菜单鼠标移入 boolean
 * @methods setColumnsNavHover 设置分栏布局最左侧导航鼠标移入 boolean
 */
export const useRoutesListStore = defineStore('RoutesList', {
	state: () => ({
		routesList: [],
	}),
	actions: {
		async setRoutesList(data: Array<string>) {
			this.routesList = data;
		},
		async removeRoutesList() {
			this.routesList = [];
			router.getRoutes().forEach(item => {
				router.removeRoute(item.name)
			})
			constantRoute.forEach(item => {
				router.addRoute(item)
			})
		},
	},
});
