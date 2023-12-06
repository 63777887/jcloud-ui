<template>
  <div class="timeBox">
    <div class="timeItem">
      <div class="time">{{ time.time }}</div>
      <div class="second">{{ time.second }}</div>
    </div>
    <div class="dateItem">
      <div class="week">{{ time.week }}</div>
      <div class="date">{{ time.date }}</div>
    </div>
  </div>
</template>

<script setup lang="ts" name="TimeBox">
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
import dayjs from "dayjs";
import {parseDate} from "@/utils/time.ts";


const timer: any = ref(null);
const time: any = ref({});
const getDate = () => {
  time.value = parseTime(new Date());
};
// 根据传入的时间，处理成需要的对象函数
const parseTime = (time) => {
  let resObj: any = {};
  let week = ['日', '一', '二', '三', '四', '五', '六'];
  resObj.date = parseDate(time, 'YYYY年MM月DD日');
  resObj.week = `星期${week[dayjs(time).day()]}`;
  resObj.time = parseDate(time, 'HH:mm');
  resObj.second = parseDate(time, 'ss');
  return resObj;
};


onBeforeMount(() => {
})// 生命周期 - 挂载之前
onMounted(() => {
  timer.value = setInterval(() => {
    getDate();
  }, 1000);
})// 生命周期 - 挂载完成（可以访问 DOM 元素）
onBeforeUpdate(() => {
})// 生命周期 - 更新之前
onUpdated(() => {
})// 生命周期 - 更新之后
onBeforeUnmount(() => {
  clearInterval(timer.value);
  timer.value = null;
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
.timeBox {
  width: 60%;
  border-radius: 30px;
  margin: 0 auto;
  background: linear-gradient(to right bottom, #7cafe3, #046ac1);
  display: flex;
  padding: 20px 0;
  justify-content: center;
  cursor: default;

  .timeItem {
    display: flex;
    color: white;
    width: 220px;

    .time {
      font: 60px/100px 'pf';
    }

    .second {
      font: 30px/30px 'pf';
      margin: 45px 0 0 20px;
    }
  }

  .dateItem {
    width: 200px;
    color: white;
    padding-top: 25px;
    padding-left: 40px;

    .week {
      font: 22px/22px 'pf';
    }

    .date {
      margin-top: 10px;
      font: 18px/18px 'pf';
    }
  }
}
</style>
