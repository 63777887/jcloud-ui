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
    <h1>手机号登录</h1>
    <el-form-item prop="phone" class="ipt-box">
      <el-input
        class="rule-input-edit"
        v-model="loginForm.phone"
        autocomplete="off"
        clearable
        @focus="focusedInput('phone')"
        @blur="blurInput('phone')"
      />
      <label :class="{ move: inputFocused.phone || loginForm.phone }">
        手机号
      </label>
    </el-form-item>
    <el-form-item prop="code" class="ipt-box">
      <el-input
        class="rule-input-edit"
        v-model="loginForm.code"
        @focus="focusedInput('code')"
        @blur="blurInput('code')"
      >
        <template #suffix>
          <el-button v-if="codeShow" plain @click="getCode" class="code-button">
            发送验证码
            <!-- 倒计时 -->
          </el-button>
          <span v-if="!codeShow" class="count">{{ count }}秒后重新获取</span>
        </template>
      </el-input>

      <label :class="{ move: inputFocused.code || loginForm.code }">
        验证码
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
      <em class="login-type" @click="changeLoginType('account')">用户名登陆</em>
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

<script setup lang="ts" name="PhoneLogin">
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import  《组件名称》  from '《组件路径》 ';
import {
  defineProps,
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
import {
  GetCaptchaResponseData,
  GrantType,
  PhoneLoginFormData,
} from '@/api/login/type.ts'
import { useRoute, useRouter } from 'vue-router'
import codeImg001 from '@/assets/images/code_imgs/codeImg001.webp'
import codeImg002 from '@/assets/images/code_imgs/codeImg002.webp'
import codeImg003 from '@/assets/images/code_imgs/codeImg003.webp'
import codeImg004 from '@/assets/images/code_imgs/codeImg004.webp'
import { getTimeAdverbial } from '@/utils/time.ts'
// 引入需要的变量
import { ElMessage, ElNotification, FormRules } from 'element-plus'
// 引入仓库
import userStore from '@/store/modules/user'

import './login.scss'
import { validatePhone } from '@/utils/validateUtil.ts'
import { reqSendCode } from '@/api/login'
import { ResponseData, SUCCESS_CODE } from '@/api/base/type.ts'

const props = defineProps({
  changeLoginType: { type: Function }, // 点击更换登陆方式
})

const count = ref(60)
const codeShow = ref(true)
let timer

const loginForm: PhoneLoginFormData = reactive<PhoneLoginFormData>({
  phone: '',
  code: '',
})

let buttonLoading = ref(false)

let loginFormRef = ref()

const rules = reactive<FormRules<PhoneLoginFormData>>({
  phone: [{ validator: validatePhone, trigger: 'blur' }],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 6, max: 6, message: '验证码长度不匹配', trigger: 'blur' },
  ],
})

const $router = useRouter()
const $route = useRoute()
const store = userStore()
const codeImgs = [codeImg001, codeImg002, codeImg003, codeImg004]
// 表单数据

// 控制表单输入框动态样式
let inputFocused = reactive({
  phone: false,
  code: false,
  up: false,
})

const isShow = ref(false)

const onShow = () => {
  isShow.value = true
}

const onClose = () => {
  isShow.value = false
}

const onSuccess = async () => {
  try {
    const TIME_COUNT = 60
    if (!timer) {
      count.value = TIME_COUNT
      codeShow.value = false
      timer = setInterval(() => {
        if (count.value > 0 && count.value <= TIME_COUNT) {
          count.value--
        } else {
          codeShow.value = true
          clearInterval(timer)
          timer = null
        }
      }, 1000)
    }
    await loginFormRef.value.validateField(['phone'])
    let responseData: GetCaptchaResponseData = await reqSendCode(
      loginForm.phone,
    )
    if (responseData && responseData.code != SUCCESS_CODE) {
      ElMessage.error(responseData.msg)
    }
    console.log(responseData)
    if (responseData.data != 'true') {
      loginForm.code = responseData.data
    }
  } catch (error) {
    ElMessage.error(error.toString())
  } finally {
    onClose() // 验证成功，需要手动关闭模态框
  }
}

// 登陆按钮
const submitForm = async () => {
  try {
    buttonLoading.value = true
    await loginFormRef.value.validate()
    await store.userLogin(loginForm, GrantType.SMS)
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
  } finally {
    buttonLoading.value = false
  }
}

// 输入框获取焦点
function focusedInput(inputType) {
  if (inputType === 'phone') {
    inputFocused.phone = true
  } else if (inputType === 'code') {
    inputFocused.up = true
    inputFocused.code = true
  }
}

// 输入框失去焦点
function blurInput(inputType) {
  if (inputType === 'phone') {
    inputFocused.phone = false
  } else if (inputType === 'code') {
    inputFocused.up = false
    inputFocused.code = false
  }
}

const getCode = async () => {
  await loginFormRef.value.validateField(['phone'])
  onShow()
}

onBeforeMount(() => {}) // 生命周期 - 挂载之前
onMounted(() => {}) // 生命周期 - 挂载完成（可以访问 DOM 元素）
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
  width: 150px;
  height: 40px;
  border: none;
  border-radius: 3px;
  margin-top: 30px;
  letter-spacing: 10px;
  text-indent: 10px;
  cursor: pointer;
  transition: 0.3s;
}

.form-button:hover {
  letter-spacing: 25px;
  text-indent: 25px;
  background-color: #2fa080;
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

.code-button {
  color: #2fa080;
  border: none;
  width: 120px;
  height: 40px;
}

.code-button:hover {
  letter-spacing: 1px;
  text-indent: 1px;
  color: #2fa080;
}
</style>
