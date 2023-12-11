//用户日志模块的接口
import adminRequest from '@/utils/adminRequest'
import { GetLogListResponseData, GetLogReq } from './type'

//枚举地址
enum API {
  // 获取日志数据
  LOG_LIST = '/sysLog/getLog',
  LOG_LOGIN = '/sysLog/getLoginLog',
}

//获取用户日志列表接口
export const reqGetLogList = (getLogReq: GetLogReq) =>
  adminRequest.post<any, GetLogListResponseData>(API.LOG_LIST, {
    data: getLogReq,
  })

//获取用户日志列表接口
export const reqGetLogLogin = () =>
  adminRequest.get<any, GetLogListResponseData>(API.LOG_LOGIN,{
      params: {"serviceId": "jiwkClient"}
  })
