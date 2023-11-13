
//菜单数据与按钮数据的ts类型
import {ResponseData} from "@/api/base/type";

export interface Permisstion {
  id?: number
  createTime: string
  updateTime: string
  hidden: number
  menuName: string
  parentId: number
  path: string
  permission: string
  sort: number
  tab: number
  type: number
}
export type PermisstionList = Permisstion[]

//菜单数据与按钮数据的ts类型
export interface Menu {
  id: number
  createTime: string
  updateTime: string
  hidden: number
  menuName: string
  parentId: number
  path: string
  permission: string
  sort: number
  tab: number
  type: number
  children: Menu[]
}

export type MenuList = Menu[]
//菜单接口返回的数据类型
export interface PermisstionResponseData extends ResponseData {
  data: PermisstionList
}

export interface AllMenuResponseData extends ResponseData {
  data: MenuList
}

//添加与修改菜单携带的参数的ts类型
export interface MenuParams {
  id: number
  hidden: number
  menuName: string
  parentId: number
  path: string
  permission: string
  sort: number
  tab: number
  type: number
}

//添加与修改菜单携带的参数的ts类型
export interface SetRoleMenuDto {
  roleId: number //角色ID
  menuType: number //菜单类型
  menuIds: number[] //菜单ID集合
}
