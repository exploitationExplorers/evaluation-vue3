<template>
  <view class="result">
    <scroll-view scroll-y class="result__scroll">
      <image
        class="result__poster"
        :src="personality.image"
        mode="widthFix"
        :show-menu-by-longpress="true"
      />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { quizStore } from '@/utils/store'
import { matchPersonality } from '@/utils/score'

const score = computed(() => quizStore.finalScore)
const personality = computed(() => matchPersonality(score.value))

// 小程序端分享卡片配置
onShareAppMessage(() => {
  const p = personality.value
  return {
    title: `我是「${p.name}」，来测测你是哪种恋爱人格？`,
    path: '/pages/index/index',
    imageUrl: p.image,
  }
})

onShareTimeline(() => {
  const p = personality.value
  return {
    title: `恋爱人格自测：我是「${p.name}」`,
    imageUrl: p.image,
  }
})
</script>

<style lang="scss" scoped>
.result {
  width: 100%;
  min-height: 100vh;
  background: #000;

  &__scroll {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: #000;
  }

  &__poster {
    display: block;
    width: 100%;
  }
}
</style>
