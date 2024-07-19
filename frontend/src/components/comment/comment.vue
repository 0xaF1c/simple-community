<template>
  <n-thing>
    <template #header>
      <n-space align="center">
        <avatar-link :user-data="comment.publisher"></avatar-link>
        <!-- <n-avatar :src="comment.publisher.avatarUrl" :size="50" object-fit="cover"
          style="display: flex; justify-content: center; align-items: center;" /> -->
        <n-text>{{ comment.publisher.name }}@{{ comment.publisher.account }}</n-text>
      </n-space>
    </template>
    {{ comment.content }}
    <template #footer>
      <n-space align="end">
        <n-button text @click="like">
          <n-icon :size="15" v-show="!liked" :component="Heart24Regular"></n-icon>
          <n-icon :size="15" v-show="liked" :component="Heart24Filled"></n-icon>
          {{ comment.likeCount }}
        </n-button>
        <n-button text @click="$emit('onReplyClick')">
          <n-icon :size="15" v-show="!selected" :component="Comment24Regular"></n-icon>
          <n-icon :size="15" v-show="selected" :component="Comment24Filled"></n-icon>
        </n-button>
        <n-popconfirm
          @positive-click="submit"
          @negative-click="cancel"
          :positive-text="$t('confirm.name')"
          :negative-text="$t('cancel.name')"
          v-model:show="popConfirmShow"
          v-if="isPublisher"
        >
          {{ $t('confirm_delete_comment.name') }}
          <template #trigger>
            <n-button text @click="popConfirmShow = !popConfirmShow">
              <n-icon :size="15" v-show="!popConfirmShow" :component="Delete24Regular"></n-icon>
              <n-icon :size="15" v-show="popConfirmShow" :component="Delete24Filled"></n-icon>
            </n-button>
          </template>
        </n-popconfirm>
        <my-time :date="comment.createTime"></my-time>
      </n-space>
    </template>
  </n-thing>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import {
  NThing,
  NButton,
  NIcon,
  NSpace,
  NText,
  NEl,
  NAvatar,
  NPopconfirm,
  useMessage
} from 'naive-ui'
import {
  Comment24Regular,
  Comment24Filled,
  Heart24Regular,
  Heart24Filled,
  Delete24Regular,
  Delete24Filled,
} from '@vicons/fluent'
import { http } from '../../utils/http'
import { useI18n } from 'vue-i18n'
import avatarLink from '../link/avatarLink.vue'
import MyTime from '../common/time.vue'

export default defineComponent({
  props: {
    comment: {
      required: true,
      type: Object as any
    },
    selected: {
      required: false,
      type: Boolean
    }
  },
  emit: [
    'onReplyClick',
    'needUpdate'
  ],
  components: {
    NThing,
    NButton,
    NIcon,
    NSpace,
    NText,
    NEl,
    NAvatar,
    NPopconfirm,
    avatarLink,
    MyTime
  },
  setup(props, { emit }) {
    const { t } = useI18n()
    const { warning, success, error } = useMessage()
    const popConfirmShow = ref(false)
    const commentShow = ref(false)
    const liked = ref(false)
    const isPublisher = ref<boolean>(false)
    const update = async () => {
      
      const res = await http.get('/api/user/status')
      isPublisher.value = res.data.id === props.comment.publisher.id
    }
    const like = () => {
      liked.value = !liked.value
      if (liked.value) {
        props.comment.likeCount++
      } else {
        props.comment.likeCount--
      }
      http.get('/api/comment/like', {
        params: {
          like: liked.value,
          commentId: props.comment.id
        }
      })
    }
    const deleteComment = async () => {
      if (isPublisher.value) {
        http.get('/api/comment/delete', {
          params: {
            commentId: props.comment.id
          }
        })
        .then((res) => {
          console.log(res)
          emit('needUpdate')
          success(t('delete_success.name'))
        })
        .catch((err) => {
          console.log(err)
          error(t('unknown_error.name'))
        })
      } else {
        warning(t('delete_comment_failed.name'))
      }
      
    }
    return {
      popConfirmShow,
      commentShow,
      liked,
      deleteComment,
      like,
      isPublisher,
      submit() {
        deleteComment()
      },
      cancel() {

      },
      update,
      Comment24Regular,
      Comment24Filled,
      Delete24Regular,
      Delete24Filled,
      Heart24Regular,
      Heart24Filled
    }
  },
  mounted() {
    this.update()
  }
})

</script>