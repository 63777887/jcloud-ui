//引入必要的值
import { ref, onMounted, onUnmounted } from 'vue'

//定义一个处理逻辑的公共方法
function MonitorEyeBallFocus() {
  //定义x y 响应式变量  监听鼠标x y轴方向位置
  const eyeBallY = ref('')
  const eyeBallX = ref('')

  function handleMouseMove(event) {
    // 处理鼠标移动事件的逻辑
    let dw = window.innerWidth / 10
    let dh = window.innerHeight / 18
    let x = event.clientX / dw
    let y = event.clientY / dh
    //
    eyeBallX.value = x + 'px'
    eyeBallY.value = y + 'px'
  }

  //onMounted生命周期  执行时页面元素加载完毕  没加载完毕  window事件定义会获取不到
  onMounted(() => {
    //添加  onmousemove事件   当鼠标滑动时触发MovementTrigger
    window.addEventListener('mousemove', handleMouseMove)
  })
  //onUnmounted 组件销毁时触发事件
  onUnmounted(() => {
    //注销掉之前定义的on事件  避免报错
    window.removeEventListener('mousemove', handleMouseMove)
  })
  //返回响应式变量  x y
  return {
    eyeBallY,
    eyeBallX,
  }
}

//导出MonitorFocus方法  给其他地方调用
export default MonitorEyeBallFocus
