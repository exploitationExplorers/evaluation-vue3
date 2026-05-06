<template>
  <view class="result" :style="{ '--accent': personality.color }">
    <image class="result__bg" src="/static/bg.jpg" mode="aspectFill" />
    <view class="result__overlay" />

    <scroll-view scroll-y class="result__scroll">
      <view class="result__safe">
        <!-- 顶部标题 -->
        <view class="result__hero">
          <view class="result__badge">
            <text>测评结果</text>
          </view>
          <view class="result__score">
            <text class="result__score-num">{{ animatedScore }}</text>
            <text class="result__score-unit">分</text>
          </view>
          <view class="result__name">
            <text class="result__name-text">{{ typedName }}</text>
            <text v-if="showCaret" class="result__caret">|</text>
          </view>
          <view class="result__tagline">
            <text>{{ personality.tagline }}</text>
          </view>
        </view>

        <!-- 长图海报 -->
        <view class="result__poster" v-if="showPoster">
          <ResultPoster :image="personality.image" :accent="personality.color" />
        </view>

        <!-- 操作区 -->
        <view class="result__actions" v-if="showPoster">
          <view class="result__btn result__btn--primary" @click="onSave">
            <text>保存到相册</text>
          </view>
          <view class="result__btn-row">
            <view class="result__btn result__btn--ghost" @click="onShare">
              <text>分享给朋友</text>
            </view>
            <view class="result__btn result__btn--ghost" @click="onRestart">
              <text>重新测试</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import ResultPoster from '@/components/ResultPoster.vue'
import { quizStore, resetQuiz } from '@/utils/store'
import { matchPersonality } from '@/utils/score'
import { saveImageToAlbum, shareResult } from '@/utils/share'

const score = computed(() => quizStore.finalScore)
const personality = computed(() => matchPersonality(score.value))

const animatedScore = ref(0)
const typedName = ref('')
const showCaret = ref(true)
const showPoster = ref(false)

let scoreTimer: number | null = null
let typeTimer: number | null = null
let posterTimer: number | null = null
let caretTimer: number | null = null

onLoad(() => {
  startAnimations()
})

onUnmounted(() => {
  if (scoreTimer !== null) clearInterval(scoreTimer)
  if (typeTimer !== null) clearInterval(typeTimer)
  if (posterTimer !== null) clearTimeout(posterTimer)
  if (caretTimer !== null) clearInterval(caretTimer)
})

function startAnimations() {
  // 1) 数字 0 → 总分（约 900ms）
  animatedScore.value = 0
  const target = score.value
  const duration = 900
  const start = Date.now()
  if (scoreTimer !== null) clearInterval(scoreTimer)
  scoreTimer = setInterval(() => {
    const elapsed = Date.now() - start
    const t = Math.min(1, elapsed / duration)
    // ease-out cubic
    const eased = 1 - Math.pow(1 - t, 3)
    animatedScore.value = Math.round(eased * target)
    if (t >= 1) {
      animatedScore.value = target
      if (scoreTimer !== null) {
        clearInterval(scoreTimer)
        scoreTimer = null
      }
      startTypeName()
    }
  }, 30) as unknown as number
}

function startTypeName() {
  const name = personality.value.name
  let i = 0
  typedName.value = ''
  if (typeTimer !== null) clearInterval(typeTimer)
  typeTimer = setInterval(() => {
    typedName.value = name.slice(0, ++i)
    if (i >= name.length) {
      if (typeTimer !== null) {
        clearInterval(typeTimer)
        typeTimer = null
      }
      // 光标闪 3 次后隐藏
      let blinkCount = 0
      caretTimer = setInterval(() => {
        showCaret.value = !showCaret.value
        blinkCount++
        if (blinkCount >= 6) {
          showCaret.value = false
          if (caretTimer !== null) {
            clearInterval(caretTimer)
            caretTimer = null
          }
        }
      }, 240) as unknown as number
      // 海报浮入
      posterTimer = setTimeout(() => {
        showPoster.value = true
      }, 220) as unknown as number
    }
  }, 120) as unknown as number
}

async function onSave() {
  await saveImageToAlbum(personality.value.image)
}

async function onShare() {
  await shareResult({
    title: `我是「${personality.value.name}」`,
    text: `恋爱人格自测：我是「${personality.value.name}」，你呢？`,
  })
}

function onRestart() {
  resetQuiz()
  uni.reLaunch({ url: '/pages/index/index' })
}

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
    transform: scale(1.08);
    filter: blur(10rpx);
  }

  &__overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
      180deg,
      rgba(255, 244, 230, 0.78) 0%,
      rgba(255, 244, 230, 0.96) 100%
    );
  }

  &__scroll {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100vh;
    box-sizing: border-box;
  }

  &__safe {
    box-sizing: border-box;
    padding: calc(env(safe-area-inset-top) + 80rpx) 40rpx
      calc(env(safe-area-inset-bottom) + 80rpx);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__hero {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 56rpx;
  }

  &__badge {
    display: inline-block;
    padding: 6rpx 24rpx;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10rpx);
    font-size: 24rpx;
    color: var(--accent, #ff7043);
    letter-spacing: 6rpx;
    border: 2rpx solid var(--accent, rgba(255, 138, 101, 0.4));
  }

  &__score {
    display: flex;
    align-items: baseline;
    margin-top: 32rpx;
    color: var(--accent, #ff7043);
    font-feature-settings: 'tnum';
  }

  &__score-num {
    font-size: 140rpx;
    font-weight: 900;
    line-height: 1;
    letter-spacing: -2rpx;
    background: linear-gradient(135deg, var(--accent, #ff7043) 0%, #ff5170 80%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  &__score-unit {
    font-size: 40rpx;
    font-weight: 700;
    margin-left: 12rpx;
    color: var(--accent, #ff7043);
  }

  &__name {
    margin-top: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__name-text {
    font-size: 60rpx;
    font-weight: 800;
    color: #3a2a23;
    letter-spacing: 6rpx;
  }

  &__caret {
    font-size: 56rpx;
    font-weight: 400;
    color: var(--accent, #ff7043);
    margin-left: 8rpx;
  }

  &__tagline {
    margin-top: 18rpx;
    font-size: 28rpx;
    color: rgba(60, 40, 30, 0.6);
    letter-spacing: 1rpx;
  }

  &__poster {
    width: 100%;
    max-width: 640rpx;
  }

  &__actions {
    width: 100%;
    max-width: 640rpx;
    margin-top: 56rpx;
    display: flex;
    flex-direction: column;
    animation: actions-in 600ms 200ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  &__btn-row {
    margin-top: 20rpx;
    display: flex;
    gap: 20rpx;
  }

  &__btn {
    flex: 1;
    height: 96rpx;
    border-radius: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
    font-weight: 700;
    letter-spacing: 4rpx;
    transition: transform 220ms ease, box-shadow 220ms ease;

    &:active {
      transform: scale(0.97);
    }

    &--primary {
      background: linear-gradient(135deg, #ff8a65 0%, #ff5170 60%, #b15dff 100%);
      color: #fff;
      box-shadow: 0 16rpx 32rpx rgba(255, 81, 112, 0.3);
    }

    &--ghost {
      background: rgba(255, 255, 255, 0.78);
      color: #3a2a23;
      box-shadow: 0 8rpx 20rpx rgba(60, 40, 30, 0.08);
    }
  }
}

@keyframes actions-in {
  0% {
    opacity: 0;
    transform: translateY(36rpx);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
