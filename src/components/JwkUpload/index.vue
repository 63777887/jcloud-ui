<template>
  <el-dialog
    :model-value="props.show"
    :title="props.title"
    @close="oncloseHandler"
    width="30%"
  >
    <el-upload
      :drag="props.drag"
      :action="props.action"
      :method="props.method"
      :multiple="props.multiple"
      :headers="props.headers"
      :data="props.data"
      :accept="props.accept"
      :auto-upload="props.autoUpload"
      :disabled="props.disabled"
      :show-file-list="props.showFileList"
      :limit="props.limit"
      :fileList="props.fileList"
      :on-success="props.onSuccess"
      :on-change="props.onChange"
      :on-error="props.onError"
      :before-upload="handleBeforeUpload"
      :http-request="props.httpRequest"
    >
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">
        拖拽文件到此处 或者
        <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          {{ '文件大小不能超过' + formatDataSize(props.size, props.sizeType) }}
        </div>
      </template>
    </el-upload>
    <template #footer v-if="props.confirm">
      <span>
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="JwkUpload">
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import  《组件名称》  from '《组件路径》 ';
import {
  defineProps,
  handleError,
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
} from 'vue'
import { ElMessage, UploadRawFile } from 'element-plus'
import { formatDataSize, convertToMB } from '@/utils/sizeUtil.ts'

const props = defineProps({
  action: { type: String, default: '#' }, // 请求 URL
  show: { type: Boolean, default: false }, // 是否显示
  title: { type: String, default: '' }, // 标题
  size: { type: Number, default: 50 }, // 文件大小
  sizeType: {
    type: String,
    default: 'MB',
    value: 'B' | 'KB' | 'MB' | 'GB',
  }, // 文件大小类型
  multiple: { type: Boolean, default: false }, // 是否支持多文件
  method: { type: String, default: 'post' }, // 设置上传请求方法
  headers: { type: Object | Function }, //设置上传的请求头部
  data: { type: Object }, //上传时附带的额外参数
  accept: { type: String, default: '' }, // 接受上传的文件类型
  disabled: { type: Boolean, default: false }, // 是否禁用上传
  showFileList: { type: Boolean, default: false }, // 是否禁用上传
  drag: { type: Boolean, default: true }, // 是否启用拖拽上传
  autoUpload: { type: Boolean, default: true }, // 是否自动上传文件
  limit: { type: Number }, // 允许上传文件的最大数量
  fileList: { type: Object, default: [] }, // 允许上传文件的最大数量
  confirm: { type: Boolean, default: false }, // 是否二次确认，用于执行上传后的其他动作，如果有的话
  onConfirm: { type: Function }, // 二次确认方法
  beforeRemove: { type: Function }, // 删除文件之前的钩子，参数为上传的文件和文件列表， 若返回 false 或者返回 Promise 且被 reject，则停止删除。
  onRemove: { type: Function }, // 文件列表移除文件时的钩子
  onCancel: { type: Function }, // 二次确认取消方法
  beforeUpload: { type: Function }, // 上传之前的钩子
  onSuccess: { type: Function }, // 上传成功的钩子
  onChange: { type: Function }, // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
  onError: { type: Function }, // 文件上传失败时的钩子
  httpRequest: { type: Function }, // 覆盖默认的 Xhr 行为，允许自行实现上传文件的请求
})

let emits = defineEmits(['close', 'confirm'])

const handleBeforeUpload = (rawFile: UploadRawFile) => {
  // 校验size
  if (
    convertToMB(rawFile.size, 'B') > convertToMB(props.size, props.sizeType)
  ) {
    console.error('文件大小超出限制')
    ElMessage.error('文件大小超出限制')
    return false
  }
  props.beforeUpload(rawFile)
}

const oncloseHandler = () => {
  emits('close')
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

<style scoped lang="scss"></style>
