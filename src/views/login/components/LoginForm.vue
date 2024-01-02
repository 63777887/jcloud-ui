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
    <div>
      <PasswordLogin
        v-if="loginType == 'account'"
        :changeLoginType="changeLoginType"
      />
      <PhoneLogin
        v-if="loginType == 'phone'"
        :changeLoginType="changeLoginType"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PasswordLogin from '@/views/login/components/PasswordLogin.vue'
import PhoneLogin from '@/views/login/components/PhoneLogin.vue'
import MonitorEyeBallFocus from '@/utils/montor.ts'
import { ref } from 'vue'

// 鼠标移动事件
const { eyeBallY, eyeBallX } = MonitorEyeBallFocus()

let loginType = ref('account')

const changeLoginType = (type) => {
  console.log(type)
  if (type) {
    loginType.value = type
  }
}
</script>

<style scoped lang="scss">
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
</style>
