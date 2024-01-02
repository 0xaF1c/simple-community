<template>
  <div style="padding: 0 15px;">
    <banner style="margin-bottom: 5px" />
    <!-- {{ recommendTweet }} -->
    <tweet-card v-for="tweet in recommendTweet" :tweet="tweet" style=""></tweet-card>
  </div>
  
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import TweetCard from '../../components/tweetCard/tweetCard.vue'
import banner from './banner.vue'
import { http } from '../../utils/http'
import { Ref } from 'vue'
async function setRecommendTweet(recommendTweet: Ref<any>) {
  const res: any = await http.get('/api/tweet/recommend')
  recommendTweet.value = res.data.recommendTweet
}

export default defineComponent({
  components: {
    banner,
    TweetCard
  },
  setup() {
    const recommendTweet = ref<any[]>([])
    setRecommendTweet(recommendTweet)
    return {
      recommendTweet
    }
  }
})
</script>