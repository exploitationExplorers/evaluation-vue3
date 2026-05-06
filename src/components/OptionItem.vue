<template>
  <view
    class="option"
    :class="{ 'option--active': active, 'option--press': press }"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
    @click="onClick"
  >
    <view class="option__label">
      <text class="option__label-text">{{ label }}</text>
    </view>
    <view class="option__body">
      <text class="option__text">{{ text }}</text>
    </view>
    <view v-if="active" class="option__check">
      <text class="option__check-icon">✓</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  label: string
  text: string
  active: boolean
}>()

const emit = defineEmits<{
  (e: 'select'): void
}>()

const press = ref(false)

function onTouchStart() {
  press.value = true
}
function onTouchEnd() {
  press.value = false
}
function onClick() {
  emit('select')
}
</script>

<style lang="scss" scoped>
.option {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 28rpx 32rpx;
  margin-bottom: 24rpx;
  background: rgba(255, 255, 255, 0.78);
  border-radius: 28rpx;
  box-shadow: 0 8rpx 24rpx rgba(60, 40, 30, 0.08);
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
    background 240ms ease, box-shadow 240ms ease;
  border: 2rpx solid rgba(255, 255, 255, 0.55);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 176, 136, 0.28) 0%,
      rgba(255, 81, 112, 0.18) 100%
    );
    opacity: 0;
    transition: opacity 260ms ease;
    pointer-events: none;
  }

  &--press {
    transform: scale(0.97);
  }

  &--active {
    background: rgba(255, 245, 235, 0.95);
    border-color: rgba(255, 112, 67, 0.55);
    box-shadow: 0 12rpx 32rpx rgba(255, 112, 67, 0.25),
      inset 0 0 0 2rpx rgba(255, 112, 67, 0.45);

    &::before {
      opacity: 1;
    }
  }

  &__label {
    flex-shrink: 0;
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #ffd6a5 0%, #ff8a65 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24rpx;
    box-shadow: 0 4rpx 12rpx rgba(255, 138, 101, 0.35);
  }

  &__label-text {
    color: #fff;
    font-size: 30rpx;
    font-weight: 700;
    letter-spacing: 1rpx;
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__text {
    font-size: 30rpx;
    line-height: 1.55;
    color: #3a2a23;
    word-break: break-word;
  }

  &__check {
    margin-left: 16rpx;
    flex-shrink: 0;
    width: 48rpx;
    height: 48rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff7043 0%, #ff5170 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 4rpx 12rpx rgba(255, 81, 112, 0.4);
    animation: option-check-pop 280ms cubic-bezier(0.22, 1.35, 0.36, 1);
  }

  &__check-icon {
    color: #fff;
    font-size: 28rpx;
    font-weight: 700;
  }
}

@keyframes option-check-pop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    transform: scale(1.15);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}
</style>
