<template>
  <div class="container">
    <div class="panda">
      <div class="ear left"></div>
      <div class="ear right"></div>
      <div class="face">
        <div class="eye-shadow left"></div>
        <div class="eye-white left">
          <div
            class="eye-ball"
            :style="[
              eyeBallY && { top: eyeBallY },
              eyeBallX && { left: eyeBallX },
            ]"
          ></div>
        </div>
        <div class="eye-shadow right"></div>
        <div class="eye-white right">
          <div
            class="eye-ball"
            :style="[
              eyeBallY && { top: eyeBallY },
              eyeBallX && { left: eyeBallX },
            ]"
          ></div>
        </div>
        <div class="nose"></div>
        <div class="mouth"></div>
      </div>
      <div class="body"></div>
      <div class="foot left">
        <div class="sole"></div>
      </div>
      <div class="foot right">
        <div class="sole"></div>
      </div>
    </div>

    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="rules"
      class="login-box"
      :class="{ up: inputFocused.up }"
      @keydown="submitForm"
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
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
// 引入需要的变量
import MonitorEyeBallFocus from '../../../utils/montor.ts'
import { ElNotification, FormRules } from 'element-plus'
// 引入仓库
import userStore from '@/store/modules/user'
import { LoginFormData } from '@/api/user/type'
import { useRoute, useRouter } from 'vue-router'
import { getTimeAdverbial } from '@/utils/time'
import codeImg001 from '@/assets/images/code_imgs/codeImg001.webp'
import codeImg002 from '@/assets/images/code_imgs/codeImg002.webp'
import codeImg003 from '@/assets/images/code_imgs/codeImg003.webp'
import codeImg004 from '@/assets/images/code_imgs/codeImg004.webp'

const $router = useRouter()
const $route = useRoute()
const store = userStore()
const codeImgs = [codeImg001, codeImg002, codeImg003, codeImg004]
// 表单数据

let loginForm = reactive<LoginFormData>({
  username: '',
  password: '',
})

let buttonLoading = ref(false)
let loginFormRef = ref()
// 表单规则
const rules = reactive<FormRules<LoginFormData>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 12, message: '长度在 3 到 12', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 12, message: '长度在 3 到 12', trigger: 'blur' },
  ],
})

// 控制表单输入框动态样式
let inputFocused = reactive({
  username: false,
  password: false,
  up: false,
})
// 鼠标移动事件
const { eyeBallY, eyeBallX } = MonitorEyeBallFocus()

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
    await store.userLogin(loginForm)
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
</script>

<style scoped lang="scss">
.el-form-item {
  margin-bottom: 0;
}

.form-button {
  color: #fff;
  background-color: #1dc797;
}

/* 开始画熊猫 */
.panda {
  /* 相对定位 */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  /* 弹性布局 居中 垂直排列 */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /* 设置过渡 */
  transition: 0.3s;
}

/* 脸部 */
.face {
  width: 200px;
  height: 200px;
  background-color: #fff;
  border-radius: 100%;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
}

/* 耳朵 */
.ear {
  width: 70px;
  height: 70px;
  background-color: #000;
  border-radius: 100%;
  position: absolute;
  top: -10px;
}

.ear.left {
  left: -10px;
}

.ear.right {
  right: 0;
}

/* 黑眼圈 */
.eye-shadow {
  width: 50px;
  height: 80px;
  background-color: #000;
  border-radius: 50%;
  /* 绝对定位 */
  position: absolute;
  top: 40px;
}

.eye-shadow.left {
  transform: rotate(45deg);
  left: 30px;
}

.eye-shadow.right {
  transform: rotate(-45deg);
  right: 30px;
}

/* 眼白 */
.eye-white {
  width: 30px;
  height: 30px;
  background-color: #fff;
  border-radius: 100%;
  position: absolute;
  top: 68px;
}

.eye-white.left {
  left: 38px;
}

.eye-white.right {
  right: 38px;
}

/* 眼球 */
.eye-ball {
  width: 20px;
  height: 20px;
  background-color: #000;
  border-radius: 100%;
  position: absolute;
  left: 5px;
  top: 5px;
}

/* 鼻子 */
.nose {
  width: 35px;
  height: 20px;
  background-color: #000;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  bottom: 65px;
  border-radius: 42px 42px 60px 60px / 30px 30px 60px 60px;
}

/* 嘴巴 */
.mouth {
  width: 68px;
  height: 25px;
  border-bottom: 7px solid #000;
  border-radius: 50%;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  bottom: 35px;
}

/* 身体 */
.body {
  width: 250px;
  height: 280px;
  background-color: #fff;
  position: relative;
  left: -0px;
  top: -0x;
  border-radius: 100px 100px 100px 100px / 126px 126px 96px 96px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
}

/* 脚 */
.foot {
  width: 82px;
  height: 120px;
  background-color: #000;
  position: absolute;
  bottom: 8px;
  z-index: 3;
  border-radius: 40px 40px 35px 40px / 26px 26px 63px 63px;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
}

.foot.left {
  left: -80px;
}

.foot.right {
  right: -80px;
  transform: rotateY(180deg);
}

/* 脚掌-大椭圆 */
.foot::after {
  content: '';
  width: 55px;
  height: 65px;
  background-color: #222;
  position: absolute;
  border-radius: 50%;
  left: 0;
  right: 0;
  margin: auto;
  bottom: 10px;
}

/* 脚掌-三个小椭圆 */
.foot .sole,
.foot .sole::before,
.foot .sole::after {
  width: 20px;
  height: 30px;
  background-color: #222;
  position: absolute;
  border-radius: 50%;
  left: 0;
  right: 0;
  margin: auto;
  top: 8px;
}

.foot .sole::before {
  content: '';
  left: -50px;
}

.foot .sole::after {
  content: '';
  left: 25px;
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

button:hover {
  letter-spacing: 25px;
  text-indent: 25px;
  background-color: #2fa080;
}

// input框点击动画
.move {
  color: #1dc797 !important;
  font-size: 12px !important;
  transform: translateY(-15px);
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
