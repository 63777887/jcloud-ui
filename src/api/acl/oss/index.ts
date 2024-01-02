//用户日志模块的接口
import adminRequest from '@/utils/adminRequest'
import {GetLogListResponseData, GetLogReq, OssUploadResponseData} from './type'
import {UploadRawFile} from "element-plus";

//枚举地址
enum API {
  // 获取日志数据
  OSS_UPLOAD = '/oss/upload',
  OSS_DOWNLOAD = '/oss/download',
}

//上传文件
export const reqOssUpload = (file: UploadRawFile):OssUploadResponseData =>{
    const formData = new FormData()
    formData.append('file', file)
    return   adminRequest.post<any, GetLogListResponseData>(API.OSS_UPLOAD, formData)
}



//下载文件
export const reqOssDownload = (fileName:String) =>
  adminRequest.get<any, GetLogListResponseData>(API.OSS_DOWNLOAD, {
    params: fileName,
  })
