//用户管理模块的接口
import adminRequest from "@/utils/adminRequest";
import type {AllRoleResponseData, UserResponseData,} from './type'
import {GetUserInfoResponseData, UserReq} from "./type";
import {UnwrapNestedRefs} from "vue";

//枚举地址
enum API {
    //获取全部已有用户账号信息
    USER_LIST = '/user/list',
    // 根据ID获取用户信息
    GET_USER_INFO = '/user',
    //添加一个新的用户账号
    ADD_USER_URL = '/user/register',
    //更新已有的用户账号
    UPDATE_USER_URL = '/user/update',
    //给已有的用户分配角色接口
    //删除某一个账号
    DELETE_USER_URL = '/user/delete',
    //批量删除的接口
    DELETE_ALL_USER_URL = '/user/deleteBatch',
}

//获取用户账号信息的接口
export const reqUserListByPage = (page: number, limit: number, username: string) =>
    adminRequest.get<any, UserResponseData>(
        API.USER_LIST, {
            params: {
                size: limit,
                current: page,
                username: username
            }
        }
    )
//添加用户与更新已有用户的接口
export const reqAddOrUpdateUser = (data: UnwrapNestedRefs<UserReq>) => {
    //携带参数有ID更新
    if (data.id) {
        if (!data.status && data.enable) {
            // 启用
            data.status = 1
        } else if (!data.status && data.enable) {
            // 停用
            data.status = 3
        }
        return adminRequest.post<any, any>(API.UPDATE_USER_URL, data)
    } else {
        return adminRequest.post<any, any>(API.ADD_USER_URL, data)
    }
}
//获取用户账号信息的接口
export const reqGetUserInfo = (userID: number) =>
    adminRequest.get<any, GetUserInfoResponseData>(
        API.GET_USER_INFO + `/${userID}`
    )
//删除某一个账号的信息
export const reqRemoveUser = (userId: number) =>
    adminRequest.delete<any, any>(`${API.DELETE_USER_URL}/${userId}`)
//批量删除的接口
export const reqDelUserBatch = (userIds: number[]) =>
    adminRequest.post(API.DELETE_ALL_USER_URL, userIds)
