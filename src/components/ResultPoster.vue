<template>
  <view class="poster" :style="{ '--accent': accent }">
    <view class="poster__halo" />
    <view class="poster__inner">
      <image
        class="poster__img"
        :src="image"
        mode="widthFix"
        :show-menu-by-longpress="true"
      />
    </view>
    <view class="poster__hint">
      <text>长按图片可保存到相册</text>
    </view>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    image: string
    accent?: string
  }>(),
  {
    accent: '#ff7043',
  },
)
</script>

<style lang="scss" scoped>
.poster {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: poster-rise 720ms cubic-bezier(0.22, 1, 0.36, 1) both;

  &__halo {
    position: absolute;
    top: -40rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 92%;
    height: 100%;
    border-radius: 36rpx;
    background: radial-gradient(
      closest-side,
      var(--accent, #ff7043) 0%,
      rgba(255, 112, 67, 0) 70%
    );
    opacity: 0.35;
    filter: blur(40rpx);
    pointer-events: none;
    animation: poster-halo 6s ease-in-out infinite alternate;
  }

  &__inner {
    position: relative;
    width: 100%;
    border-radius: 32rpx;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0 30rpx 60rpx rgba(60, 40, 30, 0.18),
      0 0 0 2rpx rgba(255, 255, 255, 0.7) inset;
  }

  &__img {
    display: block;
    width: 100%;
  }

  &__hint {
    margin-top: 24rpx;
    padding: 10rpx 24rpx;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(10rpx);
    color: rgba(60, 40, 30, 0.65);
    font-size: 24rpx;
    letter-spacing: 1rpx;
  }
}

@keyframes poster-rise {
  0% {
    opacity: 0;
    transform: translateY(40rpx) scale(0.96);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes poster-halo {
  0% {
    opacity: 0.25;
    transform: translateX(-50%) scale(0.95);
  }
  100% {
    opacity: 0.5;
    transform: translateX(-50%) scale(1.05);
  }
}
</style>
