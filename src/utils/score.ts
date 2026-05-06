import { personalities, type Personality } from '@/data/personalities'

/**
 * 把一组题目得分（每题 0~3）汇总，返回总分
 */
export function calcTotalScore(answers: number[]): number {
  return answers.reduce((sum, n) => sum + (Number(n) || 0), 0)
}

/**
 * 根据总分匹配对应人格
 * 兜底：分数越界时取相邻段
 */
export function matchPersonality(score: number): Personality {
  const found = personalities.find((p) => score >= p.min && score <= p.max)
  if (found) return found
  if (score < personalities[0].min) return personalities[0]
  return personalities[personalities.length - 1]
}

/**
 * 一步到位：从答案数组拿到结果
 */
export function calcResult(answers: number[]): {
  score: number
  personality: Personality
} {
  const score = calcTotalScore(answers)
  return { score, personality: matchPersonality(score) }
}
