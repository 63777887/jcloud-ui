<template>
  <el-popover
    placement="right"
    :width="350"
    trigger="click"
    @hide="pswPopoverCancel"
    :visible="pswPopoverVisible"
    @show="showPswPopoverAction(row)"
    ref="popoverRef"
    :virtual-ref="userFormRef"
  >
    <template #reference>
      <div>
        <el-tooltip
          effect="dark"
          content="修改密码"
          placement="top"
          :enterable="false"
        >
          <el-button
            v-auth="'sys_user_update'"
            text
            type="primary"
            icon="RefreshLeft"
            size="small"
            @click="showPswPopover"
          >
            密码
          </el-button>
        </el-tooltip>
      </div>
    </template>
    <el-form
      :model="userParams"
      :rules="userRules"
      ref="userFormRef"
      label-width="100px"
      v-click-outside="onClickOutside"
    >
      <el-form-item label-width="10px" prop="password">
        <el-col :span="16">
          <el-input
            v-model="userParams.password"
            show-password
            clearable
            placeholder="请输入用户密码"
          ></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="pswPopoverConfirm">确定</el-button>
        </el-col>
      </el-form-item>
    </el-form>
  </el-popover>
</template>

<script setup lang="ts">
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import  《组件名称》  from '《组件路径》 ';
import { defineEmits, defineProps, nextTick, reactive, ref, unref } from 'vue'
import { User } from '@/api/acl/user/type'
import { reqAddOrUpdateUser } from '@/api/acl/user'
import { ElMessage } from 'element-plus'
import store from '@/store'
import { ClickOutside as vClickOutside } from 'element-plus'
import { SUCCESS_CODE } from '@/api/base/type'
import {validateEmail, validatePhone} from "@/utils/validateUtil.ts";
type props = {
  data: User
}
const popoverRef = ref()
const userFormRef = ref()
const onClickOutside = () => {
  pswPopoverVisible.value = false
  unref(popoverRef).popperRef?.delayHide?.()
}
// 接收父组件传过来的参数
const props = defineProps<props>()
let action = defineEmits(['getHasUser'])
let pswPopoverVisible = ref<boolean>(false)

let userRules = {
  username: [
    { required: true, message: '请输入用户姓名', trigger: 'blur' },
    { min: 3, max: 12, message: '长度在 3 到 12', trigger: 'blur' },
  ],
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { min: 2, max: 12, message: '长度在 2 到 12', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 12, message: '长度在 3 到 12', trigger: 'blur' },
  ],
  email: [
    {validator: validateEmail, trigger: 'blur'}
  ],
  phone: [
    {validator: validatePhone, trigger: 'blur'}
  ],
}

let userParams = reactive<User>({
  id: 0,
  updateTime: '',
  username: '',
  nickname: '',
  phone: '',
  email: '',
  orgId: 0,
  status: 0,
  enable: true,
  password: '',
  sysRoles: [],
})

const showPswPopoverAction = () => {
  Object.assign(userParams, {
    id: props.data.id,
    username: props.data.username,
    nickname: props.data.nickname,
    phone: props.data.phone,
    email: props.data.email,
    orgId: props.data.orgId,
    enable: props.data.enable,
    status: props.data.status,
  })
}

const pswPopoverCancel = () => {
  pswPopoverVisible.value = false
  //清空数据
  nextTick(() => {
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
    userFormRef.value.clearValidate()
  })
}

const getHasUser = () => {
  action('getHasUser')
}

const showPswPopover = () => {
  pswPopoverVisible.value = true
}

const pswPopoverConfirm = async () => {
  await userFormRef.value.validate()
  const result = await reqAddOrUpdateUser(userParams)
  if (result.code == SUCCESS_CODE) {
    ElMessage.success(userParams.id ? '更新成功' : '添加成功')
    if (!userParams.id) {
      await getHasUser()
    } else if (userParams.id == store.userId) {
      window.location.reload()
    } else {
      await getHasUser()
    }
  } else {
    ElMessage.error(result.msg)
  }
  //清除上一次的错误的提示信息
  nextTick(() => {
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
  })
  pswPopoverVisible.value = false
}
</script>

<style scoped>
.el-button {
  margin-left: 15px;
}
</style>
