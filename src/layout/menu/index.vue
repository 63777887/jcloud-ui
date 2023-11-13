<template>
  <!--          菜单组件-->
    <template v-for="(item, index) in menuList" :key="item.path">
<!--      &lt;!&ndash;    初始路由&ndash;&gt;-->
<!--      <template v-if="item.path === '/' && item.children.length > 0">-->
<!--        <Menu :menuList="item.children"></Menu>-->
<!--      </template>-->

      <template v-if="!item.children">
        <!--    没有子路由-->
        <el-menu-item :index="item.path" v-if="item.meta.hidden == 1 ">
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <template #title>
            <span>{{ item.meta.title }}</span>
          </template>
        </el-menu-item>
      </template>

      <!--    有子路由但是只有一个-->
      <template v-else-if="item.children  && item.children.length === 1">
        <el-menu-item
            :index="item.children[0].path"
            v-if="item.children[0].meta.hidden ==1"
        >
          <el-icon>
            <component :is="item.children[0].meta.icon"></component>
          </el-icon>
          <template #title>
            <span>{{ item.children[0].meta.title }}</span>
          </template>
        </el-menu-item>
      </template>

      <!--    有子路由且大于一个-->
      <el-sub-menu
          :index="item.path"
          v-else-if="item.children && item.meta.hidden == 1  && item.children.length > 1"
      >
        <template #title>
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <!--      递归子节点渲染-->
        <Menu :menuList="item.children"></Menu>
      </el-sub-menu>
    </template>
</template>

<script setup lang="ts">
import {defineProps} from 'vue'

defineProps(['menuList'])
</script>
<script lang="ts">
export default {
  name: 'Menu',
}
</script>
<style scoped lang="scss">
.el-menu-item {
  background-color: var(--next-bg-menuBackground);
}
.el-menu-item.is-active {
  background-color: var(--next-bg-menuBackground-light-1) !important;
}
.el-menu-item:hover {
  background-color: var(--next-bg-menuBackground-light-1) !important;
}
</style>
