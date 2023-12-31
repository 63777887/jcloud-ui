<template>
  <el-drawer
    v-model="props.userDrawer"
    :before-close="settingCancel"
    size="380"
    title="个人设置"
  >
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="基本信息" name="base">
        <el-form
          :model="userParams"
          :rules="userRules"
          ref="userFormRef"
          label-width="100px"
        >
          <el-form-item>
            <el-tooltip
              effect="light"
              content="点击更换头像"
              placement="right-start"
            >
              <el-upload
                :show-file-list="false"
                drag
                :http-request="changeAvatar"
                accept="image/*"
                class="upload-avatar"
              >
                <el-avatar
                  :size="100"
                  :src="store.user.icon ? store.user.icon : defaultAvatar"
                />
              </el-upload>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="userParams.username"
              placeholder="请输入用户名"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickname">
            <el-input
              v-model="userParams.nickname"
              placeholder="请输入用户昵称"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="userParams.phone"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="userParams.email"
              placeholder="请输入邮箱"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="saveUser">更新用户信息</el-button>
      </el-tab-pane>
      <el-tab-pane label="安全信息" name="security">
        <el-form
          :model="passwordParams"
          :rules="passwordRules"
          ref="userFormRef"
          label-width="100px"
        >
          <el-form-item label="原密码" prop="oldPassword">
            <el-input
              v-model="passwordParams.oldPassword"
              placeholder="请输入原密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="passwordParams.newPassword"
              placeholder="请输入新密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="passwordParams.confirmPassword"
              placeholder="请再次输入新密码"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="updatePassword">更改密码</el-button>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script setup lang="ts" name="userCenter">
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import  《组件名称》  from '《组件路径》 ';
import {
  defineProps,
  nextTick,
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onDeactivated,
  onErrorCaptured,
  onMounted,
  onRenderTracked,
  onRenderTriggered,
  onUnmounted,
  onUpdated,
  reactive,
  ref,
} from 'vue'
import { UpdatePasswordReq, UserReq } from '@/api/acl/user/type.ts'
import {
  reqAddOrUpdateUser,
  reqImportUser,
  reqUpdatePassword,
} from '@/api/acl/user'
import { ResponseData, SUCCESS_CODE } from '@/api/base/type.ts'
import { ElMessage, UploadRequestOptions } from 'element-plus'
import userStore from '@/store/modules/user.ts'
import { useRoute, useRouter } from 'vue-router'
import { validateEmail, validatePhone } from '@/utils/validateUtil.ts'
import defaultAvatar from '@/assets/images/defaultAvatar.gif'
import { reqOssUpload } from '@/api/acl/oss'
import { OssUploadResponseData } from '@/api/acl/oss/type.ts'

import './css/index.scss'

let store = userStore()
let $router = useRouter()
const $route = useRoute()
let userFormRef = ref()
let avatarList = ref([])

const props = defineProps({
  userDrawer: { type: Boolean, default: false }, // 是否显示抽屉
})

let activeName = ref('base')

let userParams = reactive<UserReq>({
  id: 0,
  updateTime: '',
  username: '',
  nickname: '',
  phone: '',
  email: '',
  orgId: 0,
  status: 0,
  enable: true,
})

let passwordParams = reactive<UpdatePasswordReq>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

let userRules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { min: 2, max: 12, message: '长度在 2 到 12', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 12, message: '长度在 3 到 12', trigger: 'blur' },
  ],
  email: [{ validator: validateEmail, trigger: 'blur' }],
  phone: [{ validator: validatePhone, trigger: 'blur' }],
}

const checkConfirmPassword = (rule: any, value: any, callback: any) => {
  if (!value || value === '') {
    callback(new Error('请输入密码'))
  } else if (value !== passwordParams.newPassword) {
    callback(new Error('两次输入的密码不匹配'))
  } else {
    callback()
  }
}

let passwordRules = {
  oldPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 12, message: '长度在 3 到 12', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 12, message: '长度在 3 到 12', trigger: 'blur' },
  ],
  confirmPassword: [{ validator: checkConfirmPassword, trigger: 'blur' }],
}

const updatePassword = async () => {
  let response = await reqUpdatePassword(passwordParams)
  if (response.code == SUCCESS_CODE) {
    ElMessage.success('密码修改成功，请重新登陆')
    await store.userLogout()
    $router.push({ path: '/login', query: { redirect: $route.path } })
  } else {
    ElMessage.error(response.msg)
  }
}

const changeAvatar = async (options: UploadRequestOptions) => {
  console.log(options.file)
  let ossUpload: OssUploadResponseData = await reqOssUpload(options.file)
  if (ossUpload.code != SUCCESS_CODE) {
    ElMessage.error('头像更换失败')
  }
  // 更新头像地址
  let updateUser = {} as UserReq
  updateUser.id = userParams.id
  updateUser.icon = ossUpload.data
  const result = await reqAddOrUpdateUser(updateUser)
  if (result.code == SUCCESS_CODE) {
    ElMessage.success('头像更换成功')
    window.location.reload()
  } else {
    ElMessage.error(result.msg)
  }
}

let emits = defineEmits(['close'])

const settingCancel = () => {
  emits('close')
  //清除上一次的错误的提示信息
  nextTick(() => {
    clearUserParams()
  })
}

const saveUser = async () => {
  await userFormRef.value.validate()
  const result = await reqAddOrUpdateUser(userParams)
  if (result.code == SUCCESS_CODE) {
    ElMessage.success('更新成功')
    window.location.reload()
  } else {
    ElMessage.error(result.msg)
  }
}

const clearUserParams = () => {
  Object.assign(userParams, {
    id: 0,
    updateTime: '',
    username: '',
    nickname: '',
    phone: '',
    email: '',
    enable: true,
    orgId: 0,
    status: 0,
    password: '',
    roles: [],
  })
}

onBeforeMount(() => {}) // 生命周期 - 挂载之前
onMounted(async () => {
  Object.assign(userParams, store.user)
}) // 生命周期 - 挂载完成（可以访问 DOM 元素）
onBeforeUpdate(() => {}) // 生命周期 - 更新之前
onUpdated(() => {}) // 生命周期 - 更新之后
onBeforeUnmount(() => {}) // 生命周期 - 销毁之前
onUnmounted(() => {}) // 生命周期 - 销毁完成
onErrorCaptured((err) => {}) // 当事件处理程序或生命周期钩子抛出错误时
onRenderTracked((e) => {}) // 渲染的时候可以追踪到
onRenderTriggered((e) => {}) // 重新渲染的时候触发
// 如果页面有 keep-alive 缓存功能,这个两个函数会触发
onActivated(() => {}) // 进入的时候触发
onDeactivated(() => {}) // 离开的时候触发
</script>

<style scoped lang="scss">
.el-tab-pane {
  display: flex;
  flex-direction: column;
  align-items: center;

  button {
    margin-top: 10px;
  }
}
</style>
