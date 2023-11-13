import adminRequest from "@/utils/adminRequest";
import type {MenuParams} from './type'
import {AllMenuResponseData, SetRoleMenuDto} from "./type";
import {GetRoleInfoResponseData} from "@/api/acl/role/type";

//枚举地址
enum API {
    //获取全部菜单与按钮的标识数据
    GET_MENU_TREE = '/sysMenu/tree',
    GET_ALL_MENU = '/sysMenu/allMenu',
    //给某一级菜单新增一个子菜单
    ADD_MENU_URL = '/sysMenu/add',
    //更新某一个已有的菜单
    UPDATE_URL = '/sysMenu/update',
    //删除已有的菜单
    DELETEMENU_URL = '/sysMenu/delete',
    //给相应的职位分配权限
    SET_PERMISTION_URL = '/sysRole/setRoleMenu',
    // 根据角色ID获取菜单信息
    MENU_LIST_BY_ROLE = '/sysMenu/getMenuListByRole',
    GET_MENU_INFO = '/sysMenu',
}

//获取菜单数据
export const reqGetMenuTree = (menuName: string,menuType?: number) =>
    adminRequest.get<any, AllMenuResponseData>(API.GET_MENU_TREE,{
        params: {
            menuName,
            menuType,
        }
    })

//获取菜单数据
export const reqGetMenuAll = () =>
    adminRequest.get<any, AllMenuResponseData>(API.GET_ALL_MENU)
//添加与更新菜单的方法
export const reqAddOrUpdateMenu = (data: MenuParams) => {
    if (data.id) {
        return adminRequest.post<any, any>(API.UPDATE_URL, data)
    } else {
        return adminRequest.post<any, any>(API.ADD_MENU_URL, data)
    }
}


//获取用户账号信息的接口
export const reqGetMenuInfo = (menuId: number) =>
    adminRequest.get<any, GetRoleInfoResponseData>(
        API.GET_MENU_INFO + `/${menuId}`
    )

//给相应的职位下发权限
export const reqSetPermisstion = (setRoleMenuDto: SetRoleMenuDto) =>
    adminRequest.post<any, any>(
        API.SET_PERMISTION_URL, setRoleMenuDto
    )

// 根据角色获取菜单信息
export const reqGetMenuListByRole = (roleId: number,menuType?: number) =>
    adminRequest.get<any, AllMenuResponseData>(API.MENU_LIST_BY_ROLE + `/${roleId}`,{params: {menuType}})

//删除某一个已有的菜单
export const reqRemoveMenu = (menuId: number) =>
    adminRequest.delete<any, any>(`${API.DELETEMENU_URL}/${menuId}`)
