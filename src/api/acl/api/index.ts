import adminRequest from '@/utils/adminRequest'
import type { MenuParams } from './type'
import {
  AllMenuResponseData,
  ApiListResponseData,
  SetRoleMenuDto,
} from './type'
import { GetRoleInfoResponseData } from '@/api/acl/role/type'

//枚举地址
enum API {
  //获取Api集合
  GET_API_LIST = '/sysApi/list',
}

//获取菜单数据
export const reqGetApiList = (url?: string) =>
  adminRequest.get<any, ApiListResponseData>(API.GET_API_LIST, {
    params: {
      url,
    },
  })
