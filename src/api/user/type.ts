//定义用户相关数据的ts类型
//用户登录接口携带参数的ts类型
import { Menu } from '@/api/acl/menu/type'
import { ResponseData } from '@/api/base/type'

export interface LoginFormData {
  username: string
  password: string
}

//定义全部接口返回数据都拥有ts类型
export interface TokenData {
  sub: string
  clientId: string
  iss: string
  token_type: string
  userId: number
  orgId: number
  access_token: string
  refresh_token: string
  aud: string[]
  license: string
  nbf: number
  scope: string[]
  exp: number
  expires_in: number
  iat: number
  jti: string
  username: string
}

//定义全部接口返回数据都拥有ts类型
export interface SysMenu {
  id: number
  parentId: number
  menuName: string
  sort: number
  permission: string
  path: string
  icon: string
  status: number
  hidden: number
  tab: number
  type: number
}

//定义全部接口返回数据都拥有ts类型
export interface SysUser {
  id: number
  orgId: number
  username: string
  password: string
  phone: string
  email: string
  icon: string
  status: number
}

//定义全部接口返回数据都拥有ts类型
export interface UserInfo {
  sysUser: SysUser
  sysApis: []
  sysMenu: Menu[]
  buttons: Menu[]
}

//定义登录接口返回数据类型
export interface LoginResponseData extends ResponseData {
  data: TokenData
}

//定义获取用户信息返回数据类型
export interface CheckTokenResponseData extends ResponseData {
  data: TokenData
}

//定义获取用户信息返回数据类型
export interface UserInfoResponseData extends ResponseData {
  data: UserInfo
}
