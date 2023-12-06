//用户管理模块的接口
import adminRequest from '@/utils/adminRequest'
import type {AllRoleResponseData, UserResponseData} from './type'
import {GetUserInfoResponseData, UpdatePasswordReq, UserReq} from './type'
import {UnwrapNestedRefs} from 'vue'
import {UploadRawFile} from "element-plus";
import {ExportReq, ResponseData} from "@/api/base/type.ts";

//枚举地址
enum API {
    // 获取全部已有用户账号信息
    USER_LIST = '/user/list',
    // 根据ID获取用户信息
    GET_USER_INFO = '/user',
    // 添加一个新的用户账号
    ADD_USER_URL = '/user/register',
    // 更新已有的用户账号
    UPDATE_USER_URL = '/user/update',
    // 删除某一个账号
    DELETE_USER_URL = '/user/delete',
    // 批量删除的接口
    DELETE_ALL_USER_URL = '/user/deleteBatch',
    // 修改密码
    UPDATE_PASSWORD_URL = '/user/updatePassword',
    // 用户导入
    IMPORT_USER_URL = '/user/importUser',
    // 用户导入
    EXPORT_USER_URL = '/user/exportUser',
}

//获取用户账号信息的接口
export const reqUserListByPage = (
    page: number,
    limit: number,
    username: string,
) =>
    adminRequest.get<any, UserResponseData>(API.USER_LIST, {
        params: {
            size: limit,
            current: page,
            username: username,
        },
    })
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
        API.GET_USER_INFO + `/${userID}`,
    )
//删除某一个账号的信息
export const reqRemoveUser = (userId: number) =>
    adminRequest.delete<any, any>(`${API.DELETE_USER_URL}/${userId}`)
//批量删除的接口
export const reqDelUserBatch = (userIds: number[]) =>
    adminRequest.post(API.DELETE_ALL_USER_URL, userIds)

//批量删除的接口
export const reqUpdatePassword = (passwordReq: UpdatePasswordReq) =>
    adminRequest.post(API.UPDATE_PASSWORD_URL, passwordReq)

//用户导入的接口
export const reqImportUser: ResponseData = (file: UploadRawFile) => {
    const formData = new FormData()
    formData.append('file', file)
    return adminRequest.post(API.IMPORT_USER_URL, formData)
}

//用户导出的接口
export const reqExportUser: ResponseData = (excelReq: ExportReq) =>
    adminRequest.post(API.EXPORT_USER_URL, excelReq, {responseType: 'blob'})
        .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            let fileName = decodeURI((response.headers['content-disposition'].split("="))[1])
            if (!fileName) {
                fileName = "unknow.xlsx"
            }
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
        })


// //用户导入的接口
// export const reqExportUser:ResponseData = (file: UploadRawFile) => {
//   let exportList=
//       {
//         code: "", // 设置字段名
//         name: "", // 设置导出字段列名称
//         children: [
//           {
//             code: "", // 设置二级表头的字段名
//             name: "" // 设置二级表头的导出字段列名称
//           }
//           // 添加更多二级表头
//         ]
//       }
//   // 添加更多表头
//
//   const formData = new FormData()
//   formData.append('file',file)
//   const blob = new Blob([JSON.stringify(exportList)], {
//     type: 'application/json',
//   });
//   formData.append('excelReq',  blob)
//   return adminRequest.post(API.EXPORT_USER_URL, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   })
// }


