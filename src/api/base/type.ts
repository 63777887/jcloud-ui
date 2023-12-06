//定义全部接口返回数据都拥有ts类型
export interface ResponseData {
  code: string
  msg: string
}

export const SUCCESS_CODE = '0'

//修改密码的ts类型
export interface ExportReq {
  businessType: string
  password: string
  isAll: boolean
  conditions: Map
  exportFields: string[]
}
