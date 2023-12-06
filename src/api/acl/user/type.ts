//账号信息的ts类型
import { RoleData } from '@/api/acl/role/type'
import { ResponseData } from '@/api/base/type'

//代表一个账号信息的ts类型
export interface User {
  id?: number
  updateTime?: string
  username?: string
  nickname: string
  phone?: string
  email: string
  orgId: number
  status: number
  enable: boolean
  password: string
  sysRoles: RoleData[]
}

//代表一个账号信息的ts类型
export interface UserReq {
  id?: number
  updateTime?: string
  username?: string
  nickname: string
  phone?: string
  email: string
  orgId: number
  status: number
  enable: boolean
  password: string
  roles: number[]
}

//修改密码的ts类型
export interface UpdatePasswordReq {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}
//数组包含全部的用户信息
type Records = User[]
//获取全部用户信息接口返回的数据ts类型
export interface UserResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

//获取全部用户信息接口返回的数据ts类型
export interface GetUserInfoResponseData extends ResponseData {
  data: User
}
