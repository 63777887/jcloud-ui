//SKU模块接口管理
import mockRequest from '@/utils/mockRequest'
import type { SkuResponseData, SkuInfoData } from './type'
//枚举地址
enum API {
  //获取已有的商品的数据-SKU
  SKU_URL = '/admin/product/list/',
  //上架
  SALE_URL = '/admin/product/onSale/',
  //下架的接口
  CANCELSALE_URL = '/admin/product/cancelSale/',
  //获取商品详情的接口
  SKUINFO_URL = '/admin/product/getSkuInfo/',
  //删除已有的商品
  DELETESKU_URL = '/admin/product/deleteSku/',
}
//获取商品SKU的接口
export const reqSkuList = (page: number, limit: number) =>
  mockRequest.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)
//已有商品上架的请求
export const reqSaleSku = (skuId: number) =>
  mockRequest.get<any, any>(API.SALE_URL + skuId)
//下架的请求
export const reqCancelSale = (skuId: number) =>
  mockRequest.get<any, any>(API.CANCELSALE_URL + skuId)
//获取商品详情的接口
export const reqSkuInfo = (skuId: number) =>
  mockRequest.get<any, SkuInfoData>(API.SKUINFO_URL + skuId)
//删除某一个已有的商品
export const reqRemoveSku = (skuId: number) =>
  mockRequest.delete<any, any>(API.DELETESKU_URL + skuId)
