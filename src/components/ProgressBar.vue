<template>
  <view class="progress">
    <view class="progress__head">
      <text class="progress__label">第 {{ current }} / {{ total }} 题</text>
      <text class="progress__percent">{{ percent }}%</text>
    </view>
    <view class="progress__track">
      <view
        class="progress__fill"
        :style="{ width: percent + '%' }"
      >
        <view class="progress__shine" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  current: number
  total: number
}>()

const percent = computed(() => {
  if (!props.total) return 0
  return Math.round(Math.min(1, props.current / props.total) * 100)
})
</script>

<style lang="scss" scoped>
.progress {
  width: 100%;
  user-select: none;

  &__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 16rpx;
  }

  &__label {
    font-size: 26rpx;
    color: rgba(60, 40, 30, 0.7);
    letter-spacing: 2rpx;
  }

  &__percent {
    font-size: 32rpx;
    font-weight: 700;
    color: #ff7043;
    font-feature-settings: 'tnum';
  }

  &__track {
    position: relative;
    width: 100%;
    height: 14rpx;
    border-radius: 14rpx;
    background: rgba(255, 255, 255, 0.55);
    box-shadow: inset 0 2rpx 6rpx rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }

  &__fill {
    position: relative;
    height: 100%;
    border-radius: 14rpx;
    background: linear-gradient(90deg, #ffb088 0%, #ff7043 60%, #ff5170 100%);
    transition: width 480ms cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow: 0 0 12rpx rgba(255, 112, 67, 0.45);
  }

  &__shine {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.6) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: translateX(-100%);
    animation: progress-shine 2.4s linear infinite;
  }
}

@keyframes progress-shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}
</style>
