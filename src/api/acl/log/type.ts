//账号信息的ts类型
import { RoleData } from '@/api/acl/role/type'
import { ResponseData } from '@/api/base/type'

//获取日志列表的ts类型
export interface GetLogReq {
  logTypeList?: number[]
  logTitle?: string
  remoteAddr?: string
  requestUri?: string
  method?: string
  params?: string
  mixTime?: number
  maxTime?: number
  exception?: string
  status: number
}


//日志实体的ts类型
export interface Log {
  id: number
  logType: number
  logTitle: string
  remoteAddr: string
  requestUri: string
  userAgent: string
  method: string
  params: string
  time: number
  exception: string
  createTime: string
  updateTime: string
}

//获取全部用户信息接口返回的数据ts类型
export interface GetLogListResponseData extends ResponseData {
  data: Log[]
}
