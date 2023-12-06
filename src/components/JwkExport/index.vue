<template>
  <el-dialog
      :model-value="props.show"
      :title="props.title"
      @close="oncloseHandler"
      width="50%"
  >
    <el-transfer
        v-model="checkedValue"
        style="text-align: left; display: inline-block"
        filterable
        :titles=props.transferTitles
        :button-texts=props.buttonTexts
        :props="{
          key: 'field',
          label: 'fieldName',
        }"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}',
        }"
        :data="props.data"
    >
      <template #default="{ option }">
        <el-text size="large">{{ option.fieldName }}</el-text>
      </template>
      <template #left-footer>
      </template>
      <template #right-footer>
      </template>
    </el-transfer>

    <template #footer>
      <el-button type="primary" @click="onConfirmHandler">
        导出
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="JwkExport">
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import  《组件名称》  from '《组件路径》 ';
import {
  defineProps, handleError,
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
  onUpdated, ref,
} from 'vue'
import {ElMessage, UploadRawFile} from "element-plus";
import {formatDataSize, convertToMB} from "@/utils/sizeUtil.ts";


const props = defineProps({
  show: {type: Boolean, default: false}, // 是否显示
  title: {type: String, default: ""}, // 标题
  data: {type: Object, default: []}, // Transfer 的数据源
  defaultValue: {type: Object, default: []}, // 标题
  transferTitles: {type: Object, default: ['未选字段', '已选字段']}, // 自定义列表标题
  buttonTexts: {type: Object, default: ['To left', 'To right']}, // 自定义按钮文案
  defaultExport: {type: Object, default: []}, // 默认导出的字段
  onConfirm: {type: Function}, // 点击下载执行的方法
})

let emits = defineEmits(["close","confirm"]);


let checkedValue = ref(props.defaultExport)

const oncloseHandler = () => {
  checkedValue.value = props.defaultExport
  emits("close")
}

const onConfirmHandler = () => {
  emits("confirm", checkedValue.value)
}

onBeforeMount(() => {
  props.data?.forEach(t=>{
    t.disabled=props.defaultExport?.includes(t.field)
  })
}) // 生命周期 - 挂载之前
onMounted(() => {
}) // 生命周期 - 挂载完成（可以访问 DOM 元素）
onBeforeUpdate(() => {
}) // 生命周期 - 更新之前
onUpdated(() => {
}) // 生命周期 - 更新之后
onBeforeUnmount(() => {
}) // 生命周期 - 销毁之前
onUnmounted(() => {
}) // 生命周期 - 销毁完成
onErrorCaptured((err) => {
}) // 当事件处理程序或生命周期钩子抛出错误时
onRenderTracked((e) => {
}) // 渲染的时候可以追踪到
onRenderTriggered((e) => {
}) // 重新渲染的时候触发
// 如果页面有 keep-alive 缓存功能,这个两个函数会触发
onActivated(() => {
}) // 进入的时候触发
onDeactivated(() => {
}) // 离开的时候触发
</script>

<style scoped lang="scss">
</style>
