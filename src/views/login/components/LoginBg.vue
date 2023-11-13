<template>
  <div class="particles-container">
    <Particles
      id="tsparticles"
      :particlesInit="particlesInit"
      :particlesLoaded="particlesLoaded"
      :options="options"
    />
  </div>
</template>

<script setup lang="ts">
// 这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
// 例如：import  《组件名称》  from '《组件路径》 ';
import { reactive } from 'vue'
import { Engine } from 'tsparticles-engine'
import { loadFull } from 'tsparticles'

const particlesInit = async (engine: Engine) => {
  await loadFull(engine)
}

const particlesLoaded = async (container: any) => {
  console.log('Particles container loaded', container)
}
const options = reactive({
  background: {
    image:
      'https://img0.baidu.com/it/u=1435639120,2241364006&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500',
    position: '50% 50%',
    repeat: 'no-repeat',
    size: 'cover',
    opacity: 1,
    color: {
      // value: "#fff", // 粒子颜色
      // value: "#1dc797", // 粒子颜色
    },
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: 'repulse', // 可用的click模式有: "push", "remove", "repulse", "bubble"。
      },
      onHover: {
        enable: true,
        mode: 'bubble', // 可用的hover模式有: "grab", "repulse", "bubble"。
      },
      resize: true,
    },
    modes: {
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 10,
      },
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: '#e6b8af',
    },
    links: {
      // color: "#1dc797", // '#dedede'。线条颜色。
      color: '#e6b8af', // '#dedede'。线条颜色。
      distance: 150, // 线条长度
      enable: true, // 是否有线条
      opacity: 1, // 线条透明度。
      width: 2, // 线条宽度。
    },
    collisions: {
      enable: false,
    },
    move: {
      direction: 'none',
      enable: true,
      outMode: 'bounce',
      random: false,
      speed: 2, // 粒子运动速度。
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 80, // 粒子数量。
    },
    opacity: {
      value: 0.5, // 粒子透明度。
    },
    shape: {
      type: 'circle', // 可用的粒子外观类型有："circle","edge","triangle", "polygon","star"
    },
    size: {
      random: true,
      value: 2, // 粒子大小。
    },
  },
  detectRetina: true,
})
</script>

<style scoped lang="scss">
.particles-container {
  width: 100%;
  height: 100vh;
  background-image: url('../../../assets/images/bizhi001.webp');
  background-size: cover;
  background-position: center;
}
</style>
