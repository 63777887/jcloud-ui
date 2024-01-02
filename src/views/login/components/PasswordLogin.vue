<template>
  <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="rules"
      class="login-box"
      :class="{ up: inputFocused.up }"
      @keydown.enter="submitForm"
  >
    <div class="hand left"></div>
    <div class="hand right"></div>
    <h1>用户登录</h1>
    <el-form-item prop="username" class="ipt-box">
      <el-input
          class="rule-input-edit"
          v-model="loginForm.username"
          autocomplete="off"
          clearable
          @focus="focusedInput('username')"
          @blur="blurInput('username')"
      />
      <label :class="{ move: inputFocused.username || loginForm.username }">
        用户名
      </label>
    </el-form-item>
    <el-form-item prop="password" class="ipt-box">
      <el-input
          class="rule-input-edit"
          v-model="loginForm.password"
          type="password"
          autocomplete="off"
          show-password
          clearable
          @focus="focusedInput('password')"
          @blur="blurInput('password')"
      />
      <label :class="{ move: inputFocused.password || loginForm.password }">
        密码
      </label>
    </el-form-item>
    <el-form-item>
      <el-button
          :loading="buttonLoading"
          class="form-button"
          @click="submitForm"
      >
        登录
      </el-button>
    </el-form-item>
    <div class="change-login">
    <em class="login-type" @click="changeLoginType('phone')">手机号登陆</em>
    <em class="login-type" @click="downloadTemp">注册</em>
    </div>
  </el-form>

  <!--    滑块验证码-->
  <template>
    <verify
        :imgs="codeImgs"
        :show="isShow"
        @success="onSuccess"
        @close="onClose"
    />
  </template>
</template>

<script setup lang="ts" name="PasswordLogin">
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import  《组件名称》  from '《组件路径》 ';
import {
  ref,
  reactive,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured,
  onRenderTracked,
  onRenderTriggered,
  onActivated,
  onDeactivated, defineProps
} from 'vue'
import {AccountLoginFormData} from "@/api/user/type.ts";
import {useRoute, useRouter} from "vue-router";
import codeImg001 from "@/assets/images/code_imgs/codeImg001.webp";
import codeImg002 from "@/assets/images/code_imgs/codeImg002.webp";
import codeImg003 from "@/assets/images/code_imgs/codeImg003.webp";
import codeImg004 from "@/assets/images/code_imgs/codeImg004.webp";
import {getTimeAdverbial} from "@/utils/time.ts";
// 引入需要的变量
import { ElNotification, FormRules } from 'element-plus'
// 引入仓库
import userStore from '@/store/modules/user'

import "./login.scss"
import {GrantType} from "@/api/login/type.ts";


const props = defineProps({
  changeLoginType: { type: Function }, // 点击更换登陆方式
})

let loginForm = reactive<AccountLoginFormData>({
  username: '',
  password: '',
})


let buttonLoading = ref(false)

let loginFormRef = ref()
// 表单规则
const rules = reactive<FormRules<AccountLoginFormData>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 12, message: '长度在 3 到 12', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 12, message: '长度在 3 到 12', trigger: 'blur' },
  ],
})


const $router = useRouter()
const $route = useRoute()
const store = userStore()
const codeImgs = [codeImg001, codeImg002, codeImg003, codeImg004]
// 表单数据

// 控制表单输入框动态样式
let inputFocused = reactive({
  username: false,
  password: false,
  up: false,
})


const isShow = ref(false)

const onShow = () => {
  isShow.value = true
}

const onClose = () => {
  isShow.value = false
  buttonLoading.value = false
}

const onSuccess = async () => {
  try {
    await store.userLogin(loginForm,GrantType.PASSWORD)
    onClose() // 验证成功，需要手动关闭模态框
    // 是否重定向
    const redirect: any = $route.query.redirect
    await $router.push({ path: redirect || '/' })
    // 登陆成功，提示信息
    ElNotification.success({
      message: '欢迎回来',
      title: `HI,${getTimeAdverbial()}好`,
    })
  } catch (error) {
    ElNotification.error(error.toString())
    onClose() // 验证成功，需要手动关闭模态框
  } finally {
    buttonLoading.value = false
  }
}

// 登陆按钮
const submitForm = async () => {
  await loginFormRef.value.validate()
  buttonLoading.value = true
  onShow()
}

// 输入框获取焦点
function focusedInput(inputType) {
  if (inputType === 'username') {
    inputFocused.username = true
  } else if (inputType === 'password') {
    inputFocused.up = true
    inputFocused.password = true
  }
}

// 输入框失去焦点
function blurInput(inputType) {
  if (inputType === 'username') {
    inputFocused.username = false
  } else if (inputType === 'password') {
    inputFocused.up = false
    inputFocused.password = false
  }
}


onBeforeMount(() => {
})// 生命周期 - 挂载之前
onMounted(() => {
})// 生命周期 - 挂载完成（可以访问 DOM 元素）
onBeforeUpdate(() => {
})// 生命周期 - 更新之前
onUpdated(() => {
})// 生命周期 - 更新之后
onBeforeUnmount(() => {
})// 生命周期 - 销毁之前
onUnmounted(() => {
})// 生命周期 - 销毁完成
onErrorCaptured((err) => {
})// 当事件处理程序或生命周期钩子抛出错误时
onRenderTracked((e) => {
})// 渲染的时候可以追踪到
onRenderTriggered((e) => {
})// 重新渲染的时候触发
// 如果页面有 keep-alive 缓存功能,这个两个函数会触发
onActivated(() => {
})// 进入的时候触发
onDeactivated(() => {
})// 离开的时候触发

</script>

<style scoped lang="scss">
.change-login {
  width: 100%;
  display: flex;
  margin-top: 20px;
  margin-right: 40px;
  justify-content: flex-end;
  .login-type {
    color: #1dc797;
    cursor: pointer;
    margin-right: 10px;
    font-size: 15px;
  }
}


.el-form-item {
  margin-bottom: 0;
}

.form-button {
  color: #fff;
  background-color: #1dc797;
}


/* 手 */
.hand,
.hand::before,
.hand::after {
  width: 40px;
  height: 30px;
  background-color: #000;
  border-radius: 50px;
  position: absolute;
  top: 70px;
  left: -20px;
}

.hand::before {
  content: '';
  top: 16px;
  left: 0;
}

.hand::after {
  content: '';
  top: 32px;
  left: 0;
}

.hand.right {
  right: -20px;
  left: auto;
}


/* 登录框 */
.login-box {
  width: 400px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -110px);
  z-index: 2;
  /* 弹性布局 居中 垂直排列 */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /* 设置过渡 */
  transition: 0.3s;
}


// input框点击动画
.move {
  color: #1dc797 !important;
  font-size: 12px !important;
  transform: translateY(-15px);
}

h1 {
  color: #1dc797;
  font-weight: normal;
  margin-bottom: 5px;
  font-size: 1.4rem;
}

.ipt-box {
  width: 80%;
  margin-top: 25px;
  position: relative;
}

.ipt-box label {
  position: absolute;
  left: 5px;
  top: -3px;
  font-size: 14px;
  color: #888;
  transition: 0.3s;
  pointer-events: none;
  margin-bottom: 10px;
}

button:hover {
  letter-spacing: 25px;
  text-indent: 25px;
  background-color: #2fa080;
}

button {
  width: 150px;
  height: 40px;
  background-color: #1dc797;
  border: none;
  border-radius: 3px;
  margin-top: 30px;
  color: #fff;
  letter-spacing: 10px;
  text-indent: 10px;
  cursor: pointer;
  transition: 0.3s;
}

.rule-input-edit :deep {
  .el-input__wrapper {
    box-shadow: 0 0 0 0;
    padding: 0;
    border-bottom: 1px solid #bbb;
  }

  /* 输入框选中或有值时输入框的样式 */
  .el-input__wrapper.is-focus {
    box-shadow: 0 1px #1dc797;
    padding: 0;
    border-bottom: 1px solid #1dc797;
  }

  .el-input__inner {
    --el-input-inner-height: calc(var(--el-input-height, 32px));
    padding: 0 10px;
  }
}

.el-input__wrapper:focus {
  color: red;
  font-size: 12px;
  transform: translateY(-15px);
}

/* 登录框向上举 */
.up {
  transform: translate(-50%, -180px);
}
</style>
