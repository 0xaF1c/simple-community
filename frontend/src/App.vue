<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
import { RouterView } from 'vue-router'
import { NLayout, NLayoutSider, NScrollbar, NLayoutContent, NConfigProvider, zhCN } from 'naive-ui'
import myMenu from './views/menu/index.vue'
import { ref } from 'vue'

const contentWidth = ref(800)
const leftSiderWidth = ref(200)
const rightSiderWidth = ref(100)
</script>

<template>
  <n-config-provider :locale="zhCN">
    <n-layout :style="{
      width: `${contentWidth+leftSiderWidth+rightSiderWidth}px`,
      height: '100vh',
      margin: '0 auto'
    }" has-sider>
      <n-layout-sider :width="leftSiderWidth">
        <!-- <router-link to="/">{{ $t('home.name') }}</router-link><br>
        <router-link to="/space">{{ $t('space.name') }}</router-link><br> -->
        <my-menu></my-menu>
      </n-layout-sider>
      <n-layout-content :style="{width: `${contentWidth}px`}" has-sider sider-placement="right">
        <n-scrollbar style="max-height: 100vh;">
          <router-view />
        </n-scrollbar>
      </n-layout-content>
      <div :style="{width: `${rightSiderWidth}px`}">
        话题1<br>
        话题1<br>
        话题1<br>
        话题1<br>
        话题1<br>
        话题1<br>
      </div>
    </n-layout>
  </n-config-provider>
</template>