<template>
  <view class="result">
    <view class="result__poster-wrap">
      <image
        class="result__poster"
        :src="personality.image"
        mode="aspectFill"
        :show-menu-by-longpress="true"
        @touchstart="startPosterLongPress"
        @touchmove="handlePosterTouchMove"
        @touchend="cancelPosterLongPress"
        @touchcancel="cancelPosterLongPress"
      />
      <view
        class="result__jump-hotspot"
        :style="jumpHotspotStyle"
        @click.stop="jumpToMiniProgram"
      />
      <!-- 你好，这个部署服务器费用，你看能不能以直接走线下支付，走线下是开不了发票，但是我给你便宜100，只用300就行，因为那个中介抽50%，如果走平台我是拿不到多少钱的，你觉得怎么样，如果可以加我微信Ac92603不要在群里说哈。谢谢 -->
    </view>
  </view>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount } from "vue";
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
import { quizStore } from "@/utils/store";
import { matchPersonality } from "@/utils/score";
// #ifdef H5
import "jweixin-module";
// #endif

const score = computed(() => quizStore.finalScore);
const personality = computed(() => matchPersonality(score.value));

const MINI_PROGRAM_APP_ID = "";
const MINI_PROGRAM_PATH = "";
const MINI_PROGRAM_H5_URL = "https://wxaurl.cn/QXsP98mePAh";
const MINI_PROGRAM_TARGET_PAGE =
  "/pluginMarketing/lottery/index/index?activityId=1259090493611814912";

// 右下角跳转热区尺寸，按设计图实际按钮区域调整即可。
const JUMP_HOTSPOT_WIDTH = "220rpx";
const JUMP_HOTSPOT_HEIGHT = "80rpx";

const jumpHotspotStyle = computed(() => ({
  width: JUMP_HOTSPOT_WIDTH,
  height: JUMP_HOTSPOT_HEIGHT,
}));

let isSavingPoster = false;
let posterLongPressTimer: ReturnType<typeof setTimeout> | null = null;
let posterTouchStartX = 0;
let posterTouchStartY = 0;
const POSTER_LONG_PRESS_MOVE_LIMIT = 8;

function jumpToMiniProgram() {
  // #ifdef H5
  const wxSdk = (window as any).wx || (window as any).jWeixin;
  if (!wxSdk?.miniProgram) {
    if (MINI_PROGRAM_H5_URL) {
      window.location.href = MINI_PROGRAM_H5_URL;
      return;
    }

    uni.showToast({ title: "请在微信小程序内打开", icon: "none" });
    return;
  }

  wxSdk.miniProgram.getEnv((res: { miniprogram: boolean }) => {
    if (!res.miniprogram) {
      if (MINI_PROGRAM_H5_URL) {
        window.location.href = MINI_PROGRAM_H5_URL;
        return;
      }

      uni.showToast({ title: "请在微信小程序内打开", icon: "none" });
      return;
    }

    wxSdk.miniProgram.navigateTo({
      url: MINI_PROGRAM_TARGET_PAGE,
      fail: () => {
        uni.showToast({
          title: "跳转失败，请检查小程序页面路径",
          icon: "none",
        });
      },
    });
  });
  // window.location.href = MINI_PROGRAM_H5_URL;
  // uni.navigateToMiniProgram({
  //   appId: "wxdfb3495a3aa4207d",
  //   path: "pages/index/index?id=123",
  //   extraData: {
  //     data1: "test",
  //   },
  //   success(res) {
  //     // 打开成功
  //   },
  // });

  // uni.redirectTo({
  //   url: "pages/index/index",
  // });
  // uni.reLaunch({
  //   url: "pages/index/index",
  // });
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

async function onPosterLongPress() {
  if (isSavingPoster) return;
  cancelPosterLongPress();

  const image = personality.value.image;
  if (!image) {
    uni.showToast({ title: "图片不存在，无法保存", icon: "none" });
    return;
  }

  // #ifdef H5
  isSavingPoster = true;
  try {
    await savePosterOnH5(
      image,
      `${personality.value.key || "result"}-poster.jpg`,
    );
    uni.showToast({ title: "图片已开始保存", icon: "success" });
  } catch (err) {
    uni.showToast({ title: "保存失败，请长按图片保存", icon: "none" });
  } finally {
    isSavingPoster = false;
  }
  return;
  // #endif

  // #ifndef H5
  isSavingPoster = true;
  uni.showLoading({ title: "保存中", mask: true });

  try {
    const info = await getPosterImageInfo(image);
    await savePosterToAlbum(info.path);

    uni.hideLoading();
    uni.showToast({ title: "已保存到相册", icon: "success" });
  } catch (err: any) {
    uni.hideLoading();
    handleSavePosterError(err);
  } finally {
    isSavingPoster = false;
  }
  // #endif
}

function startPosterLongPress(event: TouchEvent) {
  cancelPosterLongPress();

  const touch = event.touches?.[0];
  posterTouchStartX = Number(touch?.clientX || 0);
  posterTouchStartY = Number(touch?.clientY || 0);

  posterLongPressTimer = setTimeout(() => {
    onPosterLongPress();
  }, 650);
}

function handlePosterTouchMove(event: TouchEvent) {
  const touch = event.touches?.[0];
  if (!touch) {
    cancelPosterLongPress();
    return;
  }

  const moveX = Math.abs(Number(touch.clientX) - posterTouchStartX);
  const moveY = Math.abs(Number(touch.clientY) - posterTouchStartY);

  if (
    moveX > POSTER_LONG_PRESS_MOVE_LIMIT ||
    moveY > POSTER_LONG_PRESS_MOVE_LIMIT
  ) {
    cancelPosterLongPress();
  }
}

function cancelPosterLongPress() {
  if (!posterLongPressTimer) return;
  clearTimeout(posterLongPressTimer);
  posterLongPressTimer = null;
}

async function savePosterOnH5(src: string, filename: string) {
  const response = await fetch(src);
  if (!response.ok) {
    throw new Error(`download poster failed: ${response.status}`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

onBeforeUnmount(() => {
  cancelPosterLongPress();
});

function getPosterImageInfo(
  src: string,
): Promise<UniApp.GetImageInfoSuccessData> {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src,
      success: resolve,
      fail: reject,
    });
  });
}

function savePosterToAlbum(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    uni.saveImageToPhotosAlbum({
      filePath,
      success: () => resolve(),
      fail: reject,
    });
  });
}

function handleSavePosterError(err: any) {
  const errMsg = String(err?.errMsg || "");
  const isAuthError =
    errMsg.includes("auth") ||
    errMsg.includes("authorize") ||
    errMsg.includes("deny") ||
    errMsg.includes("denied");

  if (!isAuthError) {
    uni.showToast({ title: "保存失败，请稍后重试", icon: "none" });
    return;
  }

  uni.showModal({
    title: "需要相册权限",
    content: "请在设置中开启保存到相册权限后重试",
    confirmText: "去设置",
    success: (res) => {
      if (res.confirm) {
        uni.openSetting({});
      }
    },
  });
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
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background: #fbd1de;

  &__poster-wrap {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  &__poster {
    display: block;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    object-position: center;
    -webkit-touch-callout: default;
  }

  &__jump-hotspot {
    position: absolute;
    right: 50rpx;
    bottom: 50rpx;
    z-index: 2;
  }
}
</style>
