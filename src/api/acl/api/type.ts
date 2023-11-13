//菜单数据与按钮数据的ts类型
import { ResponseData } from '@/api/base/type'

export interface Api {
  id?: number
  createTime: string
  updateTime: string
  apiDesc: number
  url: string
  status: number
  createBy: string
  updateBy: string
}
export type ApiList = Api[]
//接口数据返回的数据类型
export interface ApiListResponseData extends ResponseData {
  data: ApiList
}
