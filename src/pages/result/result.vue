<template>
  <view class="result">
    <scroll-view scroll-y class="result__scroll" @scroll="onScroll">
      <image
        class="result__poster"
        :src="personality.image"
        mode="widthFix"
        :show-menu-by-longpress="true"
        @load="onPosterLoad"
        @click="onPosterClick"
      />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
import { quizStore } from "@/utils/store";
import { matchPersonality } from "@/utils/score";

const score = computed(() => quizStore.finalScore);
const personality = computed(() => matchPersonality(score.value));

const MINI_PROGRAM_APP_ID = "";
const MINI_PROGRAM_PATH = "";
const MINI_PROGRAM_H5_URL = "https://wxaurl.cn/QXsP98mePAh";
const POSTER_BOTTOM_CLICK_RATIO = 0.22;
const scrollTop = ref(0);
const posterHeight = ref(0);

function onScroll(event: any) {
  scrollTop.value = Number(event?.detail?.scrollTop || 0);
}

function onPosterLoad(event: any) {
  const width = Number(event?.detail?.width || 0);
  const height = Number(event?.detail?.height || 0);
  if (!width || !height) return;

  posterHeight.value = uni.getSystemInfoSync().windowWidth * (height / width);
}

function onPosterClick(event: any) {
  const touch = event?.changedTouches?.[0] || event?.touches?.[0];
  const y = scrollTop.value + Number(touch?.clientY ?? event?.detail?.y ?? 0);
  const height = posterHeight.value;

  if (!height || y < height * (1 - POSTER_BOTTOM_CLICK_RATIO)) return;

  // #ifdef H5
  if (!MINI_PROGRAM_H5_URL) {
    uni.showToast({ title: "请配置小程序 URL Link", icon: "none" });
    return;
  }

  window.location.href = MINI_PROGRAM_H5_URL;
  // #endif

  // #ifdef MP-WEIXIN
  if (!MINI_PROGRAM_APP_ID) {
    uni.showToast({ title: "请配置目标小程序 appId", icon: "none" });
    return;
  }

  uni.navigateToMiniProgram({
    appId: MINI_PROGRAM_APP_ID,
    path: MINI_PROGRAM_PATH,
    fail: () => {
      uni.showToast({ title: "跳转失败，请稍后重试", icon: "none" });
    },
  });
  // #endif
}

// 小程序端分享卡片配置
onShareAppMessage(() => {
  const p = personality.value;
  return {
    title: `我是「${p.name}」，来测测你是哪种恋爱人格？`,
    path: "/pages/index/index",
    imageUrl: p.image,
  };
});

onShareTimeline(() => {
  const p = personality.value;
  return {
    title: `恋爱人格自测：我是「${p.name}」`,
    imageUrl: p.image,
  };
});
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
