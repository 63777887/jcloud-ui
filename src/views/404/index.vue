<template>
  <el-container>
    <el-main>
      <div class="da-error-code">
        error
        <span>404</span>
      </div>
      <h1 class="da-error-heading">哎哟喂！页面让狗狗叼走了！</h1>
      <a href="">
        <h3>返回首页</h3>
      </a>
    </el-main>
    <el-footer v-if="config.openFooter">
      <p>Copyright © 2023.</p>
      <a href="https://gitee.com/musi1996/jcloud">
        https://gitee.com/musi1996/jcloud
      </a>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
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
  onDeactivated,
} from 'vue'
import useThemeConfig from '@/store/modules/themeConfig'

const config = useThemeConfig().config

// setup在beforeCreate之前执行一次，this是undefined。
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
.el-container {
  height: 100vh;
  width: 100%;

  .el-main {
    display: flex;
    flex-direction: column;
    align-items: center;

    a {
      color: #73991f;
      text-decoration: none;
      padding-top: 30px;
    }

    a:hover {
      text-decoration: underline;
    }

    .da-error-heading {
      color: #e15656;
      font-size: 24px;
      margin-top: 100px;
      font-family: Georgia, 'Times New Roman', Times, serif;
    }

    .da-error-code {
      width: 285px;
      height: 170px;
      padding: 127px 16px 0 16px;
      font-size: 32px;
      text-align: center;
      background: url('../../assets/images/error_images/error-hanger.png')
        no-repeat center center;

      // 指定动画效果
      -webkit-animation: error-swing infinite 2s ease-in-out alternate;
      -moz-animation: error-swing infinite 2s ease-in-out alternate;
      animation: error-swing infinite 2s ease-in-out alternate;

      span {
        font-size: 96px;
      }
    }

    @-webkit-keyframes error-swing {
      0% {
        -webkit-transform: rotate(1deg);
      }
      100% {
        -webkit-transform: rotate(-2deg);
      }
    }

    @-moz-keyframes error-swing {
      0% {
        -moz-transform: rotate(1deg);
      }
      100% {
        -moz-transform: rotate(-2deg);
      }
    }

    @keyframes error-swing {
      0% {
        transform: rotate(1deg);
      }
      100% {
        transform: rotate(-2deg);
      }
    }
  }

  background-image: url('../../assets/images/error_images/blueprint.png');

  .el-footer {
    background: #fff;
    border-top: 1px solid #d0d0d0;
    display: flex;
    align-items: center;
    justify-content: center;

    p {
      color: #4c4d4f;
      padding-right: 10px;
    }

    a {
      color: #4c4d4f;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  }
}
</style>
