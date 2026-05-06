<template>
  <view class="welcome">
    <image class="welcome__bg" :src="bgImage" mode="aspectFill" />
    <view class="welcome__overlay" />

    <view class="welcome__safe">
      <view class="welcome__actions">
        <view class="welcome__btn" @click="onStart">
          <text class="welcome__btn-text">开始测试</text>
          <text class="welcome__btn-arrow">→</text>
        </view>
        <view class="welcome__hint">
          <text>共 8 种人格 · 看看你究竟是吃瓜群众还是纯爱战神</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { resetQuiz } from "@/utils/store";
import { personalities } from "@/data/personalities";
import bgImage from "@/static/index-bg.jpg";

const previewPersonalities = personalities;

onLoad(() => {
  // 进入首页时重置上次答题状态
  resetQuiz();
});

function onStart() {
  resetQuiz();
  uni.navigateTo({ url: "/pages/quiz/quiz" });
}
</script>

<style lang="scss" scoped>
.welcome {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background: #fff3e8;

  &__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  &__safe {
    position: relative;
    z-index: 2;
    padding: 160rpx 56rpx 80rpx;
    min-height: 100vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  &__hero {
    animation: hero-in 720ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  &__badge {
    display: inline-block;
    padding: 8rpx 24rpx;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10rpx);
    font-size: 24rpx;
    color: #ff7043;
    letter-spacing: 4rpx;
    border: 2rpx solid rgba(255, 138, 101, 0.35);
    box-shadow: 0 6rpx 18rpx rgba(255, 138, 101, 0.15);
  }

  &__title {
    margin-top: 36rpx;
    display: flex;
    flex-direction: column;
  }

  &__title-line {
    font-size: 64rpx;
    font-weight: 800;
    line-height: 1.25;
    color: #3a2a23;
    letter-spacing: 2rpx;

    &--accent {
      background: linear-gradient(
        135deg,
        #ff7043 0%,
        #ff5170 60%,
        #b15dff 100%
      );
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  }

  &__sub {
    margin-top: 28rpx;
    font-size: 28rpx;
    color: rgba(60, 40, 30, 0.66);
    line-height: 1.6;
    letter-spacing: 2rpx;
  }

  &__avatars {
    margin-top: 60rpx;
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx 16rpx;
  }

  &__avatar {
    width: 76rpx;
    height: 76rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 8rpx 20rpx rgba(60, 40, 30, 0.16);
    border: 4rpx solid rgba(255, 255, 255, 0.85);
    opacity: 0;
    transform: translateY(24rpx) scale(0.8);
    animation: avatar-in 600ms cubic-bezier(0.22, 1.35, 0.36, 1) forwards;
  }

  &__avatar-text {
    font-size: 30rpx;
    font-weight: 700;
    letter-spacing: 1rpx;
  }

  &__actions {
    margin-top: 80rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: cta-in 700ms 200ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  &__btn {
    width: 100%;
    max-width: 540rpx;
    height: 108rpx;
    border-radius: 54rpx;
    background: linear-gradient(135deg, #ff8a65 0%, #ff5170 60%, #b15dff 100%);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 16rpx 36rpx rgba(255, 81, 112, 0.35);
    transition:
      transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
      box-shadow 220ms ease;
    position: relative;
    overflow: hidden;

    &:active {
      transform: scale(0.97) translateY(2rpx);
      box-shadow: 0 8rpx 18rpx rgba(255, 81, 112, 0.3);
    }

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        100deg,
        rgba(255, 255, 255, 0) 30%,
        rgba(255, 255, 255, 0.45) 50%,
        rgba(255, 255, 255, 0) 70%
      );
      transform: translateX(-100%);
      animation: btn-shine 3.4s ease-in-out infinite;
    }
  }

  &__btn-text {
    font-size: 34rpx;
    font-weight: 700;
    letter-spacing: 6rpx;
    margin-right: 12rpx;
  }

  &__btn-arrow {
    font-size: 36rpx;
    font-weight: 700;
  }

  &__hint {
    margin-top: 28rpx;
    font-size: 24rpx;
    color: rgba(60, 40, 30, 0.55);
    letter-spacing: 1rpx;
  }
}

@keyframes bg-breath {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.06);
  }
}

@keyframes hero-in {
  0% {
    opacity: 0;
    transform: translateY(40rpx);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes avatar-in {
  0% {
    opacity: 0;
    transform: translateY(24rpx) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes cta-in {
  0% {
    opacity: 0;
    transform: translateY(36rpx);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes btn-shine {
  0% {
    transform: translateX(-100%);
  }
  60% {
    transform: translateX(120%);
  }
  100% {
    transform: translateX(120%);
  }
}
</style>
