<template>
  <a-modal
      :visible="store.state.isVerify"
      :footer="null"
      :maskClosable="false"
      :closable="false"
      width="350px"
      :body-style="{ padding: '20px' }"
      @cancel="onClose"
      centered
  >
    <div class="image-body">
      <div class="verify-title">
        请先完成以下安全验证：
      </div>
      <a-spin :spinning="loading" tip="加载中...">
        <div  v-if="loading" class="image-div"></div>
      </a-spin>
      <div v-if="!loading&&bkImage&&slideImage" class="image-div">
        <ElImage class="image-bk" :src="bkImage"></ElImage>
        <ElImage
            :style="{ marginLeft: marginLeft + 'px' }"
            class="image-slide"
            :src="slideImage"
        ></ElImage>
      </div>
      <div class="image-slide-div">
        <div class="image-slide-text">
          <span class="image-slide-tips">
            {{ showTips ? "向右拖动滑块完成拼图" : "&nbsp;" }}
          </span>
        </div>
        <div :style="slideStyle" class="slide-div">
          <ElButton
              :style="slideButtonStyle"
              @mousedown="handleDrag"
              class="slide-button"
              :round="false"
              type="primary"
              plain
          >
            <div class="iconbox">
              <i
                  class="iconfont icon-jiantou"
                  v-if="result === 'default'"
                  style="color:#52ccba;font-size: 16px"
              >
              </i>
              <i class="iconfont icon-duigou" v-if="result === 'success'" style="color: #fff;font-size: 28px"></i>
              <i class="iconfont icon-a-shanchu_huaban1" v-if="result === 'error'" style="color: rgb(246, 185, 186);"></i>
            </div>
          </ElButton>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts" name="SliderValidation">
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
  onDeactivated
} from 'vue'


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
import { onMounted, ref, computed, reactive, nextTick } from 'vue'
// import { Modal, Spin, message } from 'ant-design-vue'
import $http from '@/utils/request/api'
import { ElImage, ElButton } from 'element-plus'
// import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
// import CryptoJS from 'crypto-js'
export default {
  components: {
    ElImage,
    ElButton
  },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(false)
    // 验证码背景图片
    const bkImage = ref('')
    // 验证码滑块图片
    const slideImage = ref('')
    const secretKey = ref('')
    const currentToken = ref('')
    // 是否显示提示文字
    const showTips = ref(true)
    // 验证码滑块图片移动量
    const marginLeft = ref(0)
    // 验证码状态
    const result = ref('default')
    // 滑动背景样式
    const slideStyleJson = reactive({})
    // 滑块按钮样式
    const slideButtonStyleJson = reactive({})
    const slideStyle = computed(() => {
      return slideStyleJson
    })
    const slideButtonStyle = computed(() => {
      return slideButtonStyleJson
    })

    function loadImage () {
      loading.value = true
      $http.getSlider().then((res) => {
        loading.value = !loading.value
        bkImage.value = res.data.original_img_base_64
        slideImage.value = res.data.slider_img_base_64
        secretKey.value = res.data.secret_key
        currentToken.value = res.data.token
      })
    }
    function onClose () {

    }
    /**
     * 改变拖动时改变
     */
    function dragChangeSildeStyle () {
      slideStyleJson.background = 'rgba(25,145,250,0.5)'
      slideStyleJson.transition = null
      slideButtonStyleJson.transition = null
    }
    /**
     * 验证成功
     */

    const reload = () => {
      store.commit('SET_IS_RELOAD', true)
      nextTick(() => {
        store.commit('SET_IS_RELOAD', false)
      })
    }

    function handleSuccess () {
      result.value = 'success'
      slideStyleJson.background = '#d2f4ef'
      slideButtonStyleJson.background = '#52ccba'
      slideButtonStyleJson.color = 'white'
      // slideButtonStyleJson.transform = 'translateX(0px)'
      slideButtonStyleJson.border = '1px solid #52ccba'
      message.success('验证成功')
      //这里写自己的代码，以下代码只是参考（可自己封装）
      setTimeout(() => {
        if (route.path.split('/').includes('detail')) {
          router.go(0)
        } else {
          reload()
        }
        onClose()
      }, 400)
    }
    /**
     * 验证失败
     */
    function handleError () {
      result.value = 'error'
      slideStyleJson.background = 'rgba(245,122,122,0.5)'
      slideButtonStyleJson.background = '#f57a7a'
      slideButtonStyleJson.transition = 'transform 0.5s'
      slideButtonStyleJson.color = 'white'
      slideButtonStyleJson.border = '1px solid #f57a7a'
      message.error('验证失败请重试')
      //这里写自己的代码，以下代码只是参考（可自己封装）
      setTimeout(() => {
        handleReset()
      }, 300)
    }
    /**
     * 重置验证码
     */
    function handleReset () {
      result.value = 'default'
      marginLeft.value = 0
      slideStyleJson.width = '0px'
      slideButtonStyleJson.marginLeft = '0px'
      slideButtonStyleJson.transform = 'translateX(0px)'
      slideButtonStyleJson.color = null
      slideButtonStyleJson.border = null
      slideButtonStyleJson.background = null
      // slideStyleJson.transition = 'all ease 0.5s'
      slideButtonStyleJson.transition = 'margin-left 0.5s'
      showTips.value = true
      loadImage()
    }

    onMounted(() => {
      loadImage()
    })
    // 添加移动事件
    function handleDrag (c) {
      let moveX = 0; let offset = 0; const y = 5
      const clickX = c.clientX
      dragChangeSildeStyle()
      showTips.value = false
      const handleMove = (e) => {
        moveX = e.clientX
        offset = Math.min(Math.max(moveX - clickX, 0), 260)
        slideStyleJson.width = offset + 'px'
        slideButtonStyleJson.transform = `translateX(${offset}px)`
        marginLeft.value = offset
      }
      const handleUp = async () => {
        document.removeEventListener('mousemove', handleMove)
        document.removeEventListener('mouseup', handleUp)
        // 校验验证码
        // aes加密
        const key = CryptoJS.enc.Utf8.parse(secretKey.value)
        const srcs = CryptoJS.enc.Utf8.parse(JSON.stringify({ x: offset, y: y }))
        const encrypted = CryptoJS.AES.encrypt(srcs, key, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        })
        // 将ciphertext字符串转二进制
        const params = {
          point_json: CryptoJS.enc.Base64.stringify(encrypted.ciphertext),
          token: currentToken.value
        }
        const res = await $http.verifyCodeCheck(params)
        if (res.code === 0) {
          // 成功
          handleSuccess()
        } else {
          // 失败
          handleError()
        }
      }
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleUp)
      requestAnimationFrame(() => {
        handleMove(c)
      })
    }

    return {
      onClose,
      loadImage,
      bkImage,
      loading,
      slideImage,
      marginLeft,
      handleDrag,
      slideStyle,
      slideButtonStyle,
      result,
      showTips,
      store
    }
  }
}
</script>
<style lang="scss" scoped>
.iconbox{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.iconfont{
  font-size: 20px;
  color: #333;
}
.image-body {
  margin: 0 auto;
  width: 310px;
  margin-top: 10px;
  .verify-title{
    font-size: 14px;
    color: #333;
    margin-bottom: 10px;
  }
  .image-div {
    width: 310px;
    height: 155px;
    background: rgb(153, 216, 197);
    .image-bk {
      width: 310px;
      height: 155px;
      z-index: 1;
      position: absolute;
    }
    .image-slide {
      width: 50px;
      height: 155px;
      position: absolute;
      z-index: 2;
    }
  }
  .image-slide-div {
    width: 310px;
    height: 39px;
    margin-top: 15px;
    position: relative;
    .image-slide-text {
      text-align: center;
      background: #eef1f8;
      border: 1px solid #ebebeb;
      .image-slide-tips {
        display: inline-block;
        font-size: 14px;
        color: #b7bcd1;
        line-height: 36px;
        height: 36px;
        text-align: center;
      }
    }
    .slide-div {
      width: 0px;
      height: 38px;
      margin-top: -39px;
      .slide-button {
        width: 50px;
        height: 38px;
        border: none;
        border-left: 1px solid;
        border-right: 1px solid;
        border-bottom: 1px solid;
        border-color: #ebebeb;
        box-shadow: 0 0 4px #ccc;
        background: white;
        cursor: pointer;
        &:hover {
          background: #52ccba;
          border-color: #52ccba;
          color: white;
          .icon-jiantou{
            color: #fff!important;
          }
        }
      }
    }
  }
}
</style>
