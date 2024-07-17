<template>
  <div style="padding: 0 15px;">
    <banner style="margin-bottom: 5px" />
    <div v-for="post in recommendPost">
      <n-divider></n-divider>
      <post-card :post="post" style=""></post-card>
    </div>
  </div>
  
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import postCard from '../../components/postCard/postCard.vue'
import banner from './banner.vue'
import { http } from '../../utils/http'
import { Ref } from 'vue'
import { NDivider } from 'naive-ui'
async function setRecommendPost(recommendPost: Ref<any>) {
  const res: any = await http.get('/api/post/recommend')
  console.log(res);
  
  recommendPost.value = res.data.recommendPost
}

export default defineComponent({
  components: {
    banner,
    postCard
  },
  setup() {
    const recommendPost = ref<any[]>([])
    
    setRecommendPost(recommendPost)
    return {
      recommendPost
    }
  }
})
</script>