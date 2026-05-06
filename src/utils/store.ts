import { reactive, watch } from 'vue'
import { TOTAL_QUESTIONS } from '@/data/questions'

/**
 * 跨页测评状态
 * - answers[i] 表示第 i+1 题选中的得分（0/1/2/3），未答为 -1
 * - 用 uni.setStorageSync 持久化，刷新（H5）/ 重启（小程序）后能恢复
 */
const STORAGE_KEY = 'evaluation:state:v1'

export interface QuizState {
  answers: number[]
  /** 是否已完成全部题目 */
  finished: boolean
  /** 完成时的总分（用于结果页） */
  finalScore: number
}

function createInitialState(): QuizState {
  return {
    answers: new Array(TOTAL_QUESTIONS).fill(-1),
    finished: false,
    finalScore: 0,
  }
}

function loadState(): QuizState {
  try {
    const cached = uni.getStorageSync(STORAGE_KEY) as QuizState | ''
    if (
      cached &&
      typeof cached === 'object' &&
      Array.isArray((cached as QuizState).answers) &&
      (cached as QuizState).answers.length === TOTAL_QUESTIONS
    ) {
      return cached as QuizState
    }
  } catch (e) {
    // 忽略读取异常
  }
  return createInitialState()
}

export const quizStore = reactive<QuizState>(loadState())

watch(
  quizStore,
  (val) => {
    try {
      uni.setStorageSync(STORAGE_KEY, JSON.parse(JSON.stringify(val)))
    } catch (e) {
      // 忽略写入异常
    }
  },
  { deep: true },
)

export function setAnswer(index: number, score: number) {
  if (index < 0 || index >= TOTAL_QUESTIONS) return
  quizStore.answers[index] = score
}

export function resetQuiz() {
  const init = createInitialState()
  quizStore.answers = init.answers
  quizStore.finished = init.finished
  quizStore.finalScore = init.finalScore
}

/** 答完所有题：计算总分并标记完成 */
export function finishQuiz() {
  const total = quizStore.answers.reduce(
    (sum, n) => sum + (n >= 0 ? n : 0),
    0,
  )
  quizStore.finalScore = total
  quizStore.finished = true
  return total
}

export function getProgress(): number {
  const answered = quizStore.answers.filter((n) => n >= 0).length
  return Math.min(1, answered / TOTAL_QUESTIONS)
}
