<template>
  <n-carousel>
    <n-card style="overflow: hidden;" size="small">
      <template #cover>
        <img src="/public/background/default.jpg" style="object-fit: cover; width: 100%; height: 280px;" class="carousel-img">
        <h2 style="position: absolute; bottom: 0px; left: 15px"># 虽然但是人还是开心点好</h2>
      </template>
    </n-card>
  </n-carousel>
</template>
<script lang="ts">
undefined
import { defineComponent } from 'vue'
import { NCarousel, NCard } from 'naive-ui'

export default defineComponent({
  components: {
    NCarousel,
    NCard
  }
})
</script>