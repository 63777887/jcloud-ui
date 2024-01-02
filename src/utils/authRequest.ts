//进行axios二次封装:使用请求与响应拦截器
import axios from 'axios'
import { ElMessage } from 'element-plus'
import userStore from '@/store/modules/user'
//第一步:利用axios对象的create方法,去创建axios实例(其他的配置:基础路径、超时的时间)
const request = axios.create({
  //基础路径
  baseURL: import.meta.env.VITE_OAUTH_BASE_API, //基础路径上会携带/api
  timeout: 50000, //超时的时间的设置
})
//第二步:request实例添加请求与响应拦截器
request.interceptors.request.use((config) => {
  //config配置对象,headers属性请求头,经常给服务器端携带公共参数
  const store = userStore()
  // 获取仓库中数据
  if (store.token) {
    config.headers.token = 'Bearer ' + store.token
  }
  //返回配置对象
  return config
})

//第三步:响应拦截器
request.interceptors.response.use(
  (response) => {
    //成功回调
    //简化数据
    return response.data
  },
  (error) => {
    //失败回调:处理http网络错误的
    //定义一个变量:存储网络错误信息
    console.log('======================')
    console.log(error)
    let message = ''
    //http状态码
    const status = error.response.status
    switch (status) {
      case 401:
        message = error.response.data.msg
        break
      case 403:
        message = error.response.data.msg
        break
      case 424:
        message = error.response.data.msg
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = error.response.data.msg
        break
      default:
        message = '网络出现问题'
        break
    }
    console.log("---------",message)
    //提示错误信息
    return Promise.reject(message)
  },
)
//对外暴露
export default request
