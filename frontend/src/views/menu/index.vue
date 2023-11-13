<template>
  <n-button type="primary" style="margin: 3px 7.8px; width: calc(100% - 15.6px);">发推文</n-button>
  <n-button primary style="margin: 3px 7.8px; width: calc(100% - 15.6px);">写文章</n-button>
  <n-menu style="padding: 0; width: 100%;" :options="menuOption" v-model:value="selected"></n-menu>
</template>

<script lang="ts">
import { defineComponent, h } from 'vue'
import {
  NMenu,
  MenuOption,
  NButton
} from 'naive-ui'
import {
  Home24Regular,
  Home24Filled,
  Person24Regular,
  Person24Filled
} from '@vicons/fluent'
import { RouterLink } from 'vue-router'
import { renderIcon } from '../../utils/renderIcon'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: {
    NMenu,
    NButton
  },
  setup() {
    const { t } = useI18n()
    const selected = ref<string | number>('home')

    const selectedIcon = (condition: () => boolean, icons: any) => {
      return () => (condition() ? renderIcon(icons[0])() : renderIcon(icons[1])())
    }
    const menuOption: MenuOption[] = [
      {
        label: () => h(
          RouterLink,
          {
            to: {
              name: 'home'
            }
          },
          { default: () => t('home.name') }
        ),
        key: 'home',
        icon: selectedIcon(() => selected.value == 'home', [Home24Filled, Home24Regular])
      },
      {
        label: () => h(
          RouterLink,
          {
            to: {
              name: 'space'
            }
          },
          { default: () => t('space.name') }
        ),
        key: 'space',
        icon: selectedIcon(() => selected.value == 'home', [Person24Regular, Person24Filled])
      }
    ]
    return {
      menuOption,
      selectedIcon,
      selected
    }
  }
})
</script>