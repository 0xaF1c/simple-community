<template>
  <n-card hoverable bordered>
    <template #default>
      <n-carousel v-show="tweet.images.length > 0" show-arrow :show-dots="true" :loop="false" :centered-slides="true"
        @update:current-index="onCarouselChange" dot-type="line" dot-placement="top" :style="{
          height: `${carouselHeight}px`,
          Transition: 'height .3s'
        }">
        <img class="carousel-img" v-for="(img, i) in tweet.images" ref="imgs" :src="img" :style="{
          width: '100%',
          objectFit: 'contain',
        }" @load="onImgLoad(i)" />
        <template #arrow="{ prev, next }">
          <div class="n-carousel__arrow-group" v-if="tweet.images.length > 1">
            <n-button secondary size="large" @click="prev" style=" background-color: #eeea;">
              <n-icon :component="ArrowLeft24Filled"></n-icon>
            </n-button>
            <n-button secondary size="large" @click="next" style=" background-color: #eeea;">
              <n-icon :component="ArrowRight24Filled"></n-icon>
            </n-button>
          </div>
        </template>
        <template #dots="{ total, currentIndex, to }">
          <ul class="n-carousel__dots n-carousel__dots--line" v-if="tweet.images.length > 1">
            <li v-for="index of total" :key="index" class="n-carousel__dot" :class="{ ['n-carousel__dot--active']: currentIndex === index - 1 }"
              @click="to(index - 1)" style="list-style: none; box-shadow: #444 1px 1px 15px 0.1px;" />
          </ul>
        </template>
      </n-carousel>
    </template>
    <template #header>
      <n-space align="center">
        <n-avatar :src="tweet.publisher.avatarUrl" :size="50"
          style="display: flex; justify-content: center; align-items: center;" />
        <n-text>{{ tweet.publisher.name }}@{{ tweet.publisher.account }}</n-text>
      </n-space>
      {{ tweet.content }}
    </template>
    <template #header-extra>
      <n-button text size="large">
        详情
        <n-icon :size="20" :component="ChevronDoubleRight20Filled"></n-icon>
      </n-button>
    </template>

    <template #footer>
      <tag v-for="tag in tweet.tags" :tag="tag"></tag>
    </template>
  </n-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import {
  NCard,
  NCarousel,
  NAvatar,
  NText,
  NSpace,
  NIcon,
  NButton,
} from 'naive-ui'
import {
  ArrowRight24Filled,
  ArrowLeft24Filled,
  ChevronDoubleRight20Filled
} from '@vicons/fluent'
import tag from '../tag/tag.vue'
export default defineComponent({
  components: {
    NCard,
    tag,
    NCarousel,
    NAvatar,
    NText,
    NIcon,
    NSpace,
    NButton
  },
  props: {
    tweet: {
      type: Object,
      required: true
    }
  },
  setup() {
    const imgs = ref<HTMLImageElement[]>([])
    const carouselHeight = ref(300)
    const carouselIndex = ref(0)


    return {
      imgs,
      carouselHeight,
      carouselIndex,
      ArrowRight24Filled,
      ArrowLeft24Filled,
      ChevronDoubleRight20Filled
    }
  },
  methods: {
    onCarouselChange(currentIndex: number) {
      this.carouselHeight = this.imgs[currentIndex].height
      this.carouselIndex = currentIndex
    },
    onImgLoad(i: number) {
      if (i === 0) {
        this.carouselHeight = this.imgs[i].height
      }
    }
  }
})
</script>