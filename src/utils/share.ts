/**
 * 双端保存 / 分享适配
 * - H5：长按图片保存（移动浏览器原生支持）+ a.download 兜底
 * - 小程序：uni.getImageInfo + uni.saveImageToPhotosAlbum
 */

declare const window: any
declare const document: any

function toast(title: string, icon: 'none' | 'success' | 'error' = 'none') {
  uni.showToast({ title, icon, duration: 1800 })
}

/**
 * 保存指定图片到相册（小程序）/ 触发下载或长按提示（H5）
 */
export async function saveImageToAlbum(src: string): Promise<void> {
  // #ifdef H5
  try {
    const a = document.createElement('a')
    a.href = src
    a.download = (src.split('/').pop() || 'result') as string
    a.target = '_blank'
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    toast('请长按图片保存到相册')
  } catch (e) {
    toast('请长按图片保存到相册')
  }
  return
  // #endif

  // #ifndef H5
  uni.showLoading({ title: '保存中…', mask: true })
  try {
    const info = await new Promise<UniApp.GetImageInfoSuccessData>(
      (resolve, reject) => {
        uni.getImageInfo({
          src,
          success: (res) => resolve(res),
          fail: (err) => reject(err),
        })
      },
    )

    await new Promise<void>((resolve, reject) => {
      uni.saveImageToPhotosAlbum({
        filePath: info.path,
        success: () => resolve(),
        fail: (err) => reject(err),
      })
    })
    uni.hideLoading()
    toast('已保存到相册', 'success')
  } catch (err: any) {
    uni.hideLoading()
    const msg: string = err?.errMsg || ''
    if (msg.indexOf('auth') >= 0 || msg.indexOf('deny') >= 0) {
      uni.showModal({
        title: '需要相册权限',
        content: '请在设置中开启相册保存权限后再试',
        confirmText: '去设置',
        success: (res) => {
          if (res.confirm) {
            uni.openSetting({})
          }
        },
      })
    } else {
      toast('保存失败，请稍后再试')
    }
  }
  // #endif
}

/**
 * 分享当前结果（仅 H5 用，小程序请在页面里实现 onShareAppMessage / onShareTimeline）
 */
export async function shareResult(payload: {
  title: string
  text: string
  url?: string
}): Promise<void> {
  // #ifdef H5
  try {
    const url = payload.url || (window?.location?.href ?? '')
    if (window?.navigator?.share) {
      await window.navigator.share({
        title: payload.title,
        text: payload.text,
        url,
      })
      return
    }
    if (window?.navigator?.clipboard?.writeText) {
      await window.navigator.clipboard.writeText(`${payload.text} ${url}`)
      toast('链接已复制，去粘贴给朋友吧')
      return
    }
    toast('请手动复制链接分享')
  } catch (e) {
    // 用户取消或不支持
  }
  // #endif

  // #ifndef H5
  toast('点击右上角“…”分享')
  // #endif
}
