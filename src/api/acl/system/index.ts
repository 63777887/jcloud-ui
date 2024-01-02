//用户管理模块的接口
import adminRequest from '@/utils/adminRequest'
import type { AllRoleResponseData, UserResponseData } from './type'
import {
  GetRedisInfoResponseData,
  GetUserInfoResponseData,
  UpdatePasswordReq,
  UserReq,
} from './type'
import { UnwrapNestedRefs } from 'vue'
import { UploadRawFile } from 'element-plus'
import { ExportReq, ResponseData } from '@/api/base/type.ts'

//枚举地址
enum API {
  // 获取redis info信息
  SYSTEM_REDIS = '/system/redis/info',
}

//获取用户账号信息的接口
export const GetRedisInfoReq = () =>
  adminRequest.get<any, GetRedisInfoResponseData>(API.SYSTEM_REDIS)
