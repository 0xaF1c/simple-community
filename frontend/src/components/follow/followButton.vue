<template>
  <n-button
    :type="followState ? 'tertiary' : 'primary'"
    :disabled="disabled"
    @click="follow"
  >
    {{ followState ? $t('cancel_follow') : $t('follow') }}
  </n-button>
</template>

<script lang="ts">
import { NButton, useMessage } from 'naive-ui'
import { http } from '../../utils/http.ts'
import { onMounted, onUpdated, ref } from 'vue'
import { StatusCodes } from 'http-status-codes';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '../../store';
export default {
  components: {
    NButton
  },
  props: {
    id: [String, Number]
  },
  setup(props) {
    const followState = ref(false)
    const disabled = ref(false)
    const { success, error } = useMessage()
    const { t } = useI18n()
    const { followTextUpdate } = useAppStore()

    const follow = () => {
      followState.value = !followState.value

      http.get('/api/user/follow', {
        params: {
          userId: props.id,
          follow: followState.value
        }
      })
        .then((res) => {
          if (res.status == StatusCodes.OK) {
            success(t(res.data.msg))
          } else {
            error(t(res.data.msg))
          }
          update()
        })
        .catch((err) => {
          error(err.name)
        })
    }
    const update = async () => {
      const following = (await http.get('/api/user/follower/list')).data

      followState.value = following.filter((u: any) => {
        return u.id + '' === props.id + ''
      }).length > 0
      const res = await http.get('/api/user/status')

      disabled.value = res.data.id === props.id
      followTextUpdate()
    }

    onUpdated(() => {
      update()
    })
    onMounted(() => {
      update()
    })
    return {
      follow,
      followState,
      disabled
    }
  }
}
</script>