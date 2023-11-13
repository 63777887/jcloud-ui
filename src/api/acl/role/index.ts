//角色管理模块的的接口
import type {AllRoleResponseData, RoleData, RoleResponseData} from './type'
import {GetRoleInfoResponseData} from "./type";
import adminRequest from "@/utils/adminRequest";

//枚举地址
enum API {
    //获取全部的职位接口
    ROLE_LIST_BY_PAGE = '/sysRole/list',
    //新增角色
    ADD_ROLE_URL = '/sysRole/add',
    //更新已有的职位
    UPDATE_ROLE_URL = '/sysRole/update',
    //删除已有的职位
    REMOVE_ROLE_URL = '/sysRole/delete',
    //获取全部角色
    ALL_ROLE_URL = '/sysRole/all',
    //根据ID获取角色详情
    GET_ROLE_INFO = '/sysRole',
}

//获取全部的角色
export const reqRoleListByPage = (page: number, limit: number, roleName: string) =>
    adminRequest.get<any, RoleResponseData>(API.ROLE_LIST_BY_PAGE,
        {
            params: {
                size: limit,
                current: page,
                roleName: roleName
            }
        }
    )
//获取全部职位以及包含当前用户的已有的职位
export const reqAllRole = () =>
    adminRequest.get<any, AllRoleResponseData>(API.ALL_ROLE_URL)
//添加职位与更新已有职位接口
export const reqAddOrUpdateRole = (data: RoleData) => {
    if (data.id) {
        return adminRequest.post<any, any>(API.UPDATE_ROLE_URL, data)
    } else {
        return adminRequest.post<any, any>(API.ADD_ROLE_URL, data)
    }
}

//获取用户账号信息的接口
export const reqGetRoleInfo = (roleId: number) =>
    adminRequest.get<any, GetRoleInfoResponseData>(
        API.GET_ROLE_INFO + `/${roleId}`
    )


//删除已有的职位
export const reqRemoveRole = (roleId: number) =>
    adminRequest.delete<any, any>(`${API.REMOVE_ROLE_URL}/${roleId}`)
