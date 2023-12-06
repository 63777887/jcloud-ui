<template>
  <div>
    <el-card>
      <div class="box">
        <div class="info-box">
          <img
            :src="store.avatar ? store.avatar : defaultAvatar"
            alt=""
            class="avatar"
          />
          <div class="bottom">
            <h3 class="title">
              {{ getTimeAdverbial() }}好呀, {{ store.user.username }}
            </h3>
            <p class="subtitle">{{ settingStore.title }}</p>
          </div>
        </div>
        <time-box></time-box>
      </div>
    </el-card>
    <el-row class="bottoms" justify="space-around">
      <!--        欢迎-->
      <el-col :span="9">
        <svg-icon name="welcome" width="500px" height="300px"></svg-icon>
      </el-col>
      <!--        登陆日志-->
      <el-col :span="9">
        <div class="log-title">
          <el-text class="log-title-text" size="large">登陆记录</el-text>
        </div>
        <div class="log-box">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in logList"
              :key="item.id"
              :type="item.type"
              :hollow="item.hollow"
              :color="item.color"
              :size="item.size"
              :timestamp="item.timestamp"
            >
              <el-text class="log-title-text" size="large">
                {{ item.logTitle + ' - ' + item.remoteAddr }}
              </el-text>
            </el-timeline-item>
            <el-timeline-item hollow color="#0bbd87">
              <el-text class="log-title-text" size="large">...</el-text>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import  《组件名称》  from '《组件路径》 ';
import { dateFormat, getTimeAdverbial } from '@/utils/time'
import {
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
  ref,
} from 'vue'
import TimeBox from '@/components/TimeBox/index.vue'
import userStore from '@/store/modules/user'
import layoutSettingStore from '@/store/modules/setting'
import defaultAvatar from '@/assets/images/defaultAvatar.gif'
import { reqGetLogList, reqGetLogLogin } from '@/api/acl/log'
import { SUCCESS_CODE } from '@/api/base/type.ts'
import { GetLogListResponseData, GetLogReq } from '@/api/acl/log/type.ts'

const store = userStore()
const settingStore = layoutSettingStore()

let logList = ref()

// setup在beforeCreate之前执行一次，this是undefined。
onBeforeMount(() => {}) // 生命周期 - 挂载之前
onMounted(async () => {
  let response: GetLogListResponseData = await reqGetLogLogin()
  if (response.code == SUCCESS_CODE) {
    logList.value = response.data
    logList.value.forEach((item) => {
      if (item.status == 1) {
        item.color = '#0bbd87'
      } else {
        item.color = '#FF0000'
      }
      item.type = 'primary'
      item.timestamp = dateFormat(item.createTime)
      item.hollow = true
    })
  }
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
.box {
  display: flex;
  justify-content: space-between;

  .info-box {
    display: flex;

    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }

    .bottom {
      margin-left: 20px;

      .title {
        font-size: 30px;
        font-weight: 900;
        margin-bottom: 30px;
      }

      .subtitle {
        font-style: italic;
        color: skyblue;
      }
    }
  }

  .timeBox {
    margin: 0;
  }
}

.bottoms {
  margin-top: 10px;

  .log-title {
    margin-bottom: 30px;

    .log-title-text {
      font-size: 22px;
      font-weight: 500;
    }
  }

  .log-box {
    margin-left: 50px;
  }
}
</style>
