<template>
  <n-carousel>
    <n-card style="overflow: hidden;" size="small">
      <template #cover>
        <img src="../../assets/default.jpg" style="object-fit: cover; width: 100%; height: 280px;" class="carousel-img">
        <h2 style="position: absolute; bottom: 0px; left: 15px"># banner接口还没写好</h2>
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