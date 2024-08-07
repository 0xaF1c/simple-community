<template>
  <n-card :bordered="false" v-if="isDelete">
    <template #default>
      <n-el
        :style="{
          paddingLeft: `${avatarSize + avatarMargin}px`
        }"
      >
        <n-image-group>
          <n-space item-style="margin: 0 -5px 0 0;">
            <n-el
              v-for="img in post.images"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <n-image
                lazy
                width="150"
                height="150"
                object-fit="cover"
                :src="img"
              ></n-image>
            </n-el>
          </n-space>
        </n-image-group>
      </n-el>
    </template>
    <template #header>
      <n-el
        :style="{
          height: `${avatarSize}px`,
          verticalAlign: 'top'
        }"
      >
        <avatar-link
          :userData="post?.publisher"
          :size="avatarSize"
        ></avatar-link>
        <n-space
          :style="{
            display: 'inline-block',
            height: `${avatarSize}px`,
            verticalAlign: 'top',
            marginLeft: `${avatarMargin}px`
          }"
        >
          <n-text
            >{{ post?.publisher.name }}@{{
              post?.publisher.account
            }}</n-text
          >
          <my-time :date="post?.updateTime"></my-time>
        </n-space>
      </n-el>
      <n-el
        :style="{
          paddingLeft: `${avatarSize + avatarMargin}px`
        }"
      >
        <h2>{{ post?.title }}</h2>
        <n-el v-html="post?.content"></n-el>
      </n-el>
    </template>
    <template #header-extra>
      <n-popconfirm
        @positive-click="deletePost"
        @negative-click="canceldeletePost"
        :positive-text="$t('confirm.name')"
        :negative-text="$t('cancel.name')"
        v-model:show="popConfirmShow"
        v-if="isPublisher"
      >
        {{ $t('confirm_delete_post.name') }}
        <template #trigger>
          <n-button
            text
            @click="popConfirmShow = !popConfirmShow"
          >
            <n-icon
              :size="15"
              v-show="!popConfirmShow"
              :component="Delete24Regular"
            ></n-icon>
            <n-icon
              :size="15"
              v-show="popConfirmShow"
              :component="Delete24Filled"
            ></n-icon>
          </n-button>
        </template>
      </n-popconfirm>
    </template>

    <template #footer>
      <n-el
        :style="{
          paddingLeft: `${avatarSize + avatarMargin}px`
        }"
      >
        <n-el
          v-for="tag in post?.tags"
          style="margin-right: 10px; display: inline-block"
        >
          <tag :tag="tag"></tag>
        </n-el>
        <n-space style="margin-top: 10px">
          <n-button secondary @click="like">
            <n-icon
              :size="20"
              v-show="!liked"
              :component="Heart24Regular"
            ></n-icon>
            <n-icon
              :size="20"
              v-show="liked"
              :component="Heart24Filled"
            ></n-icon>
            <n-el style="margin-left: 7px">{{
              post?.likeCount
            }}</n-el>
          </n-button>
          <n-button
            secondary
            @click="commentShow = !commentShow"
          >
            <n-icon
              :size="20"
              v-show="!commentShow"
              :component="Comment24Regular"
            ></n-icon>
            <n-icon
              :size="20"
              v-show="commentShow"
              :component="Comment24Filled"
            ></n-icon>
            <n-el style="margin-left: 7px">{{
              commentData?.comments.length
            }}</n-el>
          </n-button>
        </n-space>
        <n-el v-show="commentShow">
          <my-comment
            @on-select="s => (selectedReply = s)"
            v-for="c in commentData?.comments"
            :comment="c"
            :reply="reply[c.id] ?? []"
            @need-update="getCommentData()"
          ></my-comment>
          <!-- <n-el v-show="selectedReply !== null">{{ $t('reply.name') }}{{ selectedReply?.at }}</n-el> -->
          <n-mention
            :placeholder="
              selectedReply !== null
                ? `${$t('reply.name')} ${selectedReply!.at}`
                : $t('input_comment.name')
            "
            v-model:value="content"
            :options="replyList"
            type="textarea"
          >
          </n-mention>
          <n-button
            @click="sendComment"
            type="primary"
            :loading="loading"
            :disabled="loading"
          >
            {{ $t('send.name') }}
          </n-button>
        </n-el>
      </n-el>
    </template>
  </n-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import {
  NCard,
  NCarousel,
  NAvatar,
  NText,
  NSpace,
  NIcon,
  NButton,
  NThing,
  NEl,
  NImageGroup,
  NImage,
  NMention,
  MentionOption,
  useMessage,
  NTooltip,
  NTime,
  NPopconfirm
} from 'naive-ui'
import {
  ArrowRight24Filled,
  ArrowLeft24Filled,
  ChevronDoubleRight20Filled,
  Comment24Regular,
  Comment24Filled,
  Heart24Regular,
  Heart24Filled,
  Delete24Regular,
  Delete24Filled
} from '@vicons/fluent'
import tag from '../tag/tag.vue'
import myComment from '../comment/commentWarpper.vue'
import { http } from '../../utils/http'
import { useI18n } from 'vue-i18n'
import avatarLink from '../link/avatarLink.vue'
import MyTime from '../common/time.vue'

export default defineComponent({
  components: {
    NCard,
    tag,
    NCarousel,
    NAvatar,
    NText,
    NIcon,
    NSpace,
    NButton,
    NThing,
    NEl,
    myComment,
    NImageGroup,
    NImage,
    NMention,
    avatarLink,
    NTime,
    NTooltip,
    MyTime,
    NPopconfirm
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { success, error } = useMessage()
    const { t } = useI18n()
    const imgs = ref<HTMLImageElement[]>([])
    const commentData = ref<Record<string, any>>()
    const carouselHeight = ref(300)
    const carouselIndex = ref(0)
    const liked = ref(false)
    const commentShow = ref(false)
    const reply = ref<Record<string, any>>({})
    const replyList = ref<MentionOption[]>([])
    const selectedReply = ref<any>(null)
    const content = ref('')
    const loading = ref(false)
    const avatarSize = ref(50)
    const avatarMargin = ref(15)
    const popConfirmShow = ref(false)
    const isPublisher = ref(false)
    const isDelete = ref(true)

    const update = async () => {
      commentData.value = (
        await http.get('/api/post/comments', {
          params: {
            id: props.post.id
          }
        })
      ).data

      reply.value = {}
      commentData.value?.comments.forEach((c: any) => {
        if (c.replyTo !== null) {
          if (reply.value[c.replyTo] === undefined)
            reply.value[c.replyTo] = []
          reply.value[c.replyTo]?.push(c)
        }
      })

      const res = await http.get('/api/user/status')
      isPublisher.value = res.data.id === props.post.publisher.id
    }
    const like = () => {
      liked.value = !liked.value
      if (liked.value) {
        props.post.likeCount++
      } else {
        props.post.likeCount--
      }
      http.get('/api/post/like', {
        params: {
          like: liked.value,
          postId: props.post.id
        }
      })
    }
    const init = () => {
      http
        .get('/api/post/isLike', {
          params: {
            id: props.post.id
          }
        })
        .then(res => {
          liked.value = res.data
        })
        .catch(err => {
          console.log(err)
        })
    }
    const sendComment = () => {
      if (content.value.length === 0) return
      loading.value = true
      http
        .post('/api/post/comment/send', {
          content: content.value,
          postId: props.post.id,
          replyTo: selectedReply.value?.reply ?? null
        })
        .then(() => {
          content.value = ''
          success(t('publish_post_success.name'))
          update()
          setTimeout(() => {
            loading.value = false
          }, 200)
        })
        .catch(err => {
          console.log(err)
          error(t('unknown_error.name'))
          setTimeout(() => {
            loading.value = false
          }, 200)
        })
    }
    const deletePost = () => {
      http
        .get('/api/post/delete', {
          params: {
            postId: props.post.id
          }
        })
        .then(_res => {
          success(t('delete_success.name'))
          isDelete.value = false
        })
        .catch(err => {
          error(err.name)
        })
    }
    const canceldeletePost = () => {
      popConfirmShow.value = false
    }
    onMounted(() => {
      init()
      update()
    })

    return {
      imgs,
      carouselHeight,
      carouselIndex,
      liked,
      commentShow,
      commentData,
      reply,
      replyList,
      selectedReply,
      content,
      loading,
      popConfirmShow,
      isPublisher,
      avatarSize,
      avatarMargin,
      isDelete,
      deletePost,
      canceldeletePost,
      sendComment,
      getCommentData: update,
      like,
      ArrowRight24Filled,
      ArrowLeft24Filled,
      ChevronDoubleRight20Filled,
      Comment24Regular,
      Comment24Filled,
      Heart24Regular,
      Heart24Filled,
      Delete24Regular,
      Delete24Filled
    }
  },
  // methods: {
  //   onCarouselChange(currentIndex: number) {
  //     this.carouselHeight = this.imgs[currentIndex].height
  //     this.carouselIndex = currentIndex
  //   },
  //   onImgLoad(i: number) {
  //     if (i === 0) {
  //       this.carouselHeight = this.imgs[i].height
  //     }
  //   }
  // },
  // mounted() {
  //   this.getCommentData()
  // }
})
</script>
