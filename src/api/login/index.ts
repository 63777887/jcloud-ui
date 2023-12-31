//统一管理咱们项目用户相关的接口
import type {
  AccountLoginFormData,
  LoginResponseData,
  CheckTokenResponseData,
} from './type'
import authRequest from '@/utils/authRequest'
import adminRequest from '@/utils/adminRequest'
import {
  CaptchaFormData,
  GetCaptchaResponseData,
  UserInfoResponseData,
} from './type'
import { ResponseData } from '@/api/base/type.ts'

//项目用户相关的请求地址
enum API {
  LOGIN_URL = '/oauth2/token',
  USERINFO_URL = '/user/get',
  CHECK_TOKEN = '/token/check_token',
  LOGOUT_URL = '/token/logout',
  SEND_CODE_URL = '/captcha/sendSmsCode',
}

//密码登录接口
export const reqPasswordLogin = async (
  data: AccountLoginFormData,
): Promise<LoginResponseData> => {
  const formData = new FormData()
  formData.append('username', data.username) // 添加表单字段
  formData.append('password', data.password) // 添加表单字段

  return await authRequest.post<any, LoginResponseData>(
    API.LOGIN_URL + '?grant_type=password&scope=CSJS,server',
    formData,
    {
      headers: {
        Authorization: import.meta.env.VITE_OAUTH_CLIENT_INFO,
      },
    },
  )
}

//验证码登录接口
export const reqCaptchaLogin = async (
  data: CaptchaFormData,
): Promise<LoginResponseData> => {
  const formData = new FormData()
  formData.append('phone', data.phone) // 添加表单字段
  formData.append('captcha', data.code) // 添加表单字段

  return await authRequest.post<any, LoginResponseData>(
    API.LOGIN_URL + '?grant_type=sms&scope=CSJS,server',
    formData,
    {
      headers: {
        Authorization: import.meta.env.VITE_OAUTH_CLIENT_INFO,
      },
    },
  )
}

//获取用户信息
export const reqCheckToken = () =>
  authRequest.get<any, CheckTokenResponseData>(API.CHECK_TOKEN, {
    headers: {
      Authorization: import.meta.env.VITE_OAUTH_CLIENT_INFO,
    },
  })

//获取用户信息
export const reqUserInfo = () =>
  adminRequest.get<any, UserInfoResponseData>(API.USERINFO_URL, {})
//退出登录
export const reqLogout = () => authRequest.delete<any, any>(API.LOGOUT_URL)
//发送短信
export const reqSendCode = (phone: String): GetCaptchaResponseData => {
  let date = new FormData()
  date.append('phone', phone)
  return authRequest.post<any, any>(API.SEND_CODE_URL, date)
}
