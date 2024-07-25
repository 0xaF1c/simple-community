<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
// import { storeToRefs } from 'pinia'
import { RouterView } from 'vue-router'
import {
  NLayout,
  NScrollbar,
  NLayoutContent,
  NConfigProvider,
  GlobalThemeOverrides,
  NMessageProvider,
  NLoadingBarProvider,
  NLayoutHeader
} from 'naive-ui'
import myMenu from './views/menu/index.vue'
import rightMenu from './views/menu/recommendTag.vue'
import headerView from './views/header/index.vue'
import authModal from './components/authModal/authModalProvider.vue'
import { ref } from 'vue'
import { useToggleTheme } from './utils/toggleTheme'
// import { useAppStore } from './store'
// const store = useAppStore()
// const { locale } = storeToRefs(store)

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#4a9cd6',
    primaryColorHover: '#3880af',
    primaryColorPressed: '#2b6a9e',
    primaryColorSuppl: '#4a9cd6'
  }
}
const { theme } = useToggleTheme()
const _theme = ref(theme)
const contentWidth = ref(800)
const leftSiderWidth = ref(200)
const rightSiderWidth = ref(200)
const headerHeight = ref(4.5)
</script>

<template>
  <n-config-provider
    :theme-overrides="themeOverrides"
    :theme="_theme"
  >
    <n-loading-bar-provider>
      <n-message-provider>
        <auth-modal>
          <n-layout embedded has-header>
            <n-layout-header
              :style="{
                height: `${headerHeight}vh`
              }"
            >
              <header-view
                @update:theme="t => (theme = t)"
              ></header-view>
            </n-layout-header>
            <n-layout
              :style="{
                width: `${contentWidth + leftSiderWidth + rightSiderWidth}px`,
                height: `${100 - headerHeight}vh`,
                margin: '0 auto',
                padding: '5px 0'
              }"
              has-sider
              embedded
            >
              <n-layout-content
                embedded
                :style="{ width: `${contentWidth}px` }"
                has-sider
                sider-placement="right"
              >
                <n-scrollbar style="max-height: 100vh">
                  <router-view />
                </n-scrollbar>
              </n-layout-content>
              <n-layout
                embedded
                :style="{
                  width: `${rightSiderWidth}px`,
                  height: 'auto'
                }"
              >
                <myMenu style="margin-bottom: 7px" />
                <rightMenu />
              </n-layout>
            </n-layout>
          </n-layout>
        </auth-modal>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>
