<template>
  <view class="quiz">
    <image class="quiz__bg" :src="bgImage" mode="aspectFill" />
    <view class="quiz__overlay" />

    <view class="quiz__safe">
      <!-- 顶栏 -->
      <view class="quiz__topbar">
        <view class="quiz__back" @click="onBack">
          <text class="quiz__back-icon">‹</text>
        </view>
        <text class="quiz__title-text">恋爱人格测评</text>
        <view class="quiz__back quiz__back--ghost" />
      </view>

      <!-- 进度条 -->
      <view class="quiz__progress">
        <ProgressBar :current="index + 1" :total="total" />
      </view>

      <!-- 题目卡片 -->
      <view class="quiz__stage">
        <transition :name="transitionName" mode="out-in">
          <view class="quiz__card" :key="currentQuestion.id">
            <view class="quiz__qno">
              <text>Q{{ currentQuestion.id }}</text>
              <text class="quiz__qno-bar" />
            </view>
            <view class="quiz__qtitle">
              <text>{{ currentQuestion.title }}</text>
            </view>

            <view class="quiz__options">
              <OptionItem
                v-for="opt in currentQuestion.options"
                :key="opt.label"
                :label="opt.label"
                :text="opt.text"
                :active="selectedScore === opt.score"
                @select="onSelect(opt.score)"
              />
            </view>
          </view>
        </transition>
      </view>

      <!-- 底部导航 -->
      <view class="quiz__footer">
        <view
          class="quiz__nav-btn"
          :class="{ 'quiz__nav-btn--disabled': index === 0 }"
          @click="onPrev"
        >
          <text>上一题</text>
        </view>
        <text class="quiz__pagination"> {{ index + 1 }} / {{ total }} </text>
        <view
          class="quiz__nav-btn quiz__nav-btn--primary"
          :class="{ 'quiz__nav-btn--disabled': selectedScore < 0 }"
          @click="onNext"
        >
          <text>{{ index === total - 1 ? "查看结果" : "下一题" }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import ProgressBar from "@/components/ProgressBar.vue";
import OptionItem from "@/components/OptionItem.vue";
import bgImage from "@/static/bg.jpg";
import { questions, TOTAL_QUESTIONS } from "@/data/questions";
import { finishQuiz, quizStore, resetQuiz, setAnswer } from "@/utils/store";

const total = TOTAL_QUESTIONS;
const index = ref(0);
const transitionName = ref<"slide-x" | "slide-x-back">("slide-x");
const autoAdvanceTimer = ref<number | null>(null);

const currentQuestion = computed(() => questions[index.value]);
const selectedScore = computed(() => quizStore.answers[index.value] ?? -1);

onLoad(() => {
  // 进入答题页：从首题开始（避免 storage 残留导致跳到中间）
  resetQuiz();
  index.value = 0;
});

function clearAutoAdvance() {
  if (autoAdvanceTimer.value !== null) {
    clearTimeout(autoAdvanceTimer.value);
    autoAdvanceTimer.value = null;
  }
}

function onSelect(score: number) {
  setAnswer(index.value, score);
  // 选中后短暂延迟自动进入下一题，提高节奏感
  clearAutoAdvance();
  autoAdvanceTimer.value = setTimeout(() => {
    if (index.value < total - 1) {
      goNext();
    } else {
      goFinish();
    }
  }, 320) as unknown as number;
}

function goNext() {
  transitionName.value = "slide-x";
  index.value = Math.min(total - 1, index.value + 1);
}

function goPrev() {
  transitionName.value = "slide-x-back";
  index.value = Math.max(0, index.value - 1);
}

function goFinish() {
  finishQuiz();
  uni.redirectTo({ url: "/pages/result/result" });
}

function onPrev() {
  if (index.value === 0) return;
  clearAutoAdvance();
  goPrev();
}

function onNext() {
  if (selectedScore.value < 0) {
    uni.showToast({ title: "请先选择一个答案", icon: "none" });
    return;
  }
  clearAutoAdvance();
  if (index.value === total - 1) {
    goFinish();
  } else {
    goNext();
  }
}

function onBack() {
  uni.showModal({
    title: "确定退出？",
    content: "当前进度不会保留",
    success: (res) => {
      if (res.confirm) {
        resetQuiz();
        uni.navigateBack({ delta: 1 });
      }
    },
  });
}
</script>

<style lang="scss" scoped>
.quiz {
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
    min-height: 100vh;
    box-sizing: border-box;
    padding: calc(env(safe-area-inset-top) + 24rpx) 40rpx
      calc(env(safe-area-inset-bottom) + 32rpx);
    display: flex;
    flex-direction: column;
  }

  &__topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 64rpx;
  }

  &__back {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6rpx 16rpx rgba(60, 40, 30, 0.1);
    backdrop-filter: blur(10rpx);

    &--ghost {
      background: transparent;
      box-shadow: none;
    }

    &-icon {
      font-size: 44rpx;
      color: #3a2a23;
      line-height: 1;
      margin-top: -4rpx;
    }
  }

  &__title-text {
    font-size: 30rpx;
    font-weight: 700;
    color: #3a2a23;
    letter-spacing: 4rpx;
  }

  &__progress {
    margin-top: 36rpx;
  }

  &__stage {
    flex: 1;
    margin-top: 40rpx;
    position: relative;
    min-height: 600rpx;
  }

  &__card {
    width: 100%;
    padding: 44rpx 40rpx 32rpx;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20rpx);
    border-radius: 36rpx;
    box-shadow:
      0 20rpx 40rpx rgba(60, 40, 30, 0.1),
      inset 0 0 0 2rpx rgba(255, 255, 255, 0.7);
    box-sizing: border-box;
  }

  &__qno {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;

    text:first-child {
      font-size: 32rpx;
      font-weight: 800;
      color: #ff7043;
      letter-spacing: 2rpx;
      margin-right: 16rpx;
    }
  }

  &__qno-bar {
    flex: 1;
    height: 4rpx;
    background: linear-gradient(
      90deg,
      rgba(255, 138, 101, 0.6) 0%,
      rgba(255, 138, 101, 0) 100%
    );
    border-radius: 4rpx;
  }

  &__qtitle {
    font-size: 36rpx;
    font-weight: 700;
    color: #3a2a23;
    line-height: 1.5;
    margin-bottom: 36rpx;
    letter-spacing: 1rpx;
  }

  &__options {
    display: flex;
    flex-direction: column;
  }

  &__footer {
    margin-top: 40rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__nav-btn {
    min-width: 200rpx;
    height: 84rpx;
    padding: 0 36rpx;
    border-radius: 999rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.85);
    color: #3a2a23;
    font-size: 28rpx;
    font-weight: 600;
    box-shadow: 0 8rpx 20rpx rgba(60, 40, 30, 0.1);
    transition:
      transform 220ms ease,
      opacity 220ms ease;

    &:active {
      transform: scale(0.97);
    }

    &--primary {
      background: linear-gradient(135deg, #d03077 0%, #f30000 100%);
      color: #fff;
      box-shadow: 0 12rpx 24rpx rgba(255, 81, 112, 0.3);
    }

    &--disabled {
      opacity: 0.4;
      pointer-events: none;
    }
  }

  &__pagination {
    font-size: 28rpx;
    color: rgba(60, 40, 30, 0.55);
    letter-spacing: 2rpx;
  }
}

/* 题目切换：横向滑入滑出 */
.slide-x-enter-active,
.slide-x-leave-active,
.slide-x-back-enter-active,
.slide-x-back-leave-active {
  transition:
    transform 360ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 320ms ease;
}

.slide-x-enter-from {
  opacity: 0;
  transform: translateX(60rpx);
}
.slide-x-leave-to {
  opacity: 0;
  transform: translateX(-60rpx);
}

.slide-x-back-enter-from {
  opacity: 0;
  transform: translateX(-60rpx);
}
.slide-x-back-leave-to {
  opacity: 0;
  transform: translateX(60rpx);
}
</style>
