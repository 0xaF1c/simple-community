<template>
  <n-card :bordered="false">
    <n-button
      type="primary"
      style="margin: 3px 7.8px; width: calc(100% - 15.6px);"
      @click="pubTweetModalShow = !pubTweetModalShow"
    >
      {{ $t('tweet_pub.name')}}
    </n-button>
    <n-button
      style="margin: 3px 7.8px; width: calc(100% - 15.6px);"
      @click="info('尚在开发')"
      primary
    >
      {{ $t('article_write.name') }}
    </n-button>
    <n-menu
      style="padding: 0; width: 100%;"
      :options="menuOption"
      v-model:value="selected"
    ></n-menu>
    <pubTweetModal v-model:show="pubTweetModalShow" />
  </n-card>
</template>

<script lang="ts">
import { defineComponent, h } from 'vue'
import {
  NMenu,
  MenuOption,
  NButton,
  NCard,
  darkTheme,
  useMessage
} from 'naive-ui'
import {
  Home24Regular,
  Home24Filled,
  Person24Regular,
  Person24Filled
} from '@vicons/fluent'
import pubTweetModal from '../../components/tweetCard/pubTweetModal.vue'
import { RouterLink } from 'vue-router'
import { renderIcon } from '../../utils/renderIcon'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'


export default defineComponent({
  components: {
    NMenu,
    NButton,
    NCard,
    pubTweetModal
  },
  setup() {
    const { t } = useI18n()
    const selected = ref<string | number>('home')
    const pubTweetModalShow = ref(false)

    const selectedIcon = (condition: () => boolean, icons: any) => {
      return () => (condition() ? renderIcon(icons[0])() : renderIcon(icons[1])())
    }
    const { info } = useMessage()

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
      selected,
      darkTheme,
      info,
      pubTweetModalShow
    }
  }
})
</script>