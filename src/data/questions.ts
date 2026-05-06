/**
 * 测评题库 —— 13 道题
 * A/B/C/D 选项分别对应 0/1/2/3 分（按 docx 原文录入）
 * 总分区间：0 ~ 39
 */

export type OptionLabel = 'A' | 'B' | 'C' | 'D'
export type OptionScore = 0 | 1 | 2 | 3

export interface QuestionOption {
  label: OptionLabel
  text: string
  score: OptionScore
}

export interface Question {
  id: number
  title: string
  options: QuestionOption[]
}

export const questions: Question[] = [
  {
    id: 1,
    title: '假如奶茶会说话，你觉得它会对你说的第一句话是？',
    options: [
      { label: 'A', text: '“你又胖了。”', score: 0 },
      { label: 'B', text: '“别喝了，再喝珍珠都要得糖尿病了。”', score: 1 },
      { label: 'C', text: '“你能不能别咬吸管？我疼。”', score: 2 },
      { label: 'D', text: '“加冰吗？加完冰我就是冰美式失散多年的亲弟弟。”', score: 3 },
    ],
  },
  {
    id: 2,
    title: '如果你是一只吗喽（猴子），你会怎么求偶？',
    options: [
      { label: 'A', text: '给对方摘香蕉，并说：“吃，都给你吃。”', score: 3 },
      { label: 'B', text: '倒挂树枝上，问：“你看我像不像一个问号？”', score: 1 },
      { label: 'C', text: '疯狂拍胸口，然后发朋友圈：“吗喽命苦，但吗喽想谈恋爱。”', score: 2 },
      { label: 'D', text: '直接抢走对方的奶茶，说：“想喝回来找我。”', score: 0 },
    ],
  },
  {
    id: 3,
    title: '以下哪种行为最接近你的“恋爱黑历史”？',
    options: [
      { label: 'A', text: '给对方写了千字小作文，对方回复：“你是？”', score: 1 },
      { label: 'B', text: '为了制造偶遇，在对方楼下蹲了三天，结果蹲错了单元。', score: 3 },
      { label: 'C', text: '分手后把对方备注改成“已逝的前任”，结果发错消息到家族群。', score: 2 },
      { label: 'D', text: '从来没谈过，但天天在网上教别人怎么谈恋爱。', score: 0 },
    ],
  },
  {
    id: 4,
    title: '如果你可以和任意一个虚拟角色谈恋爱，你选？',
    options: [
      { label: 'A', text: '懒羊羊（纯爱但爱吃）', score: 2 },
      { label: 'B', text: '沸羊羊（舔狗终极形态）', score: 0 },
      { label: 'C', text: '哪吒（暴躁但会给你踩风火轮送外卖）', score: 3 },
      { label: 'D', text: '奥特曼（打怪兽的时候会把你扔一边）', score: 1 },
    ],
  },
  {
    id: 5,
    title: '朋友问你：“你为什么不谈恋爱？” 你的标准答案是？',
    options: [
      { label: 'A', text: '“手机不好玩还是觉不好睡？”', score: 1 },
      { label: 'B', text: '“我的鱼塘正在施工，请稍后再拨。”', score: 2 },
      { label: 'C', text: '“我在等一个能接住我所有发疯的人。”', score: 3 },
      { label: 'D', text: '“你管我？你先谈一个给我看看。”', score: 0 },
    ],
  },
  {
    id: 6,
    title: '你觉得自己最适合演以下哪部剧的主角？',
    options: [
      { label: 'A', text: '《回家的诱惑》—— 品如', score: 0 },
      { label: 'B', text: '《甄嬛传》—— 皇上', score: 2 },
      { label: 'C', text: '《乡村爱情》—— 刘能', score: 1 },
      { label: 'D', text: '《神雕侠侣》—— 雕', score: 3 },
    ],
  },
  {
    id: 7,
    title: '如果“恋爱”是一种动物，你觉得是？',
    options: [
      { label: 'A', text: '吗喽——命苦但爱蹦跶', score: 0 },
      { label: 'B', text: '刺猬——想抱又怕扎', score: 2 },
      { label: 'C', text: '孔雀——开屏时最蠢', score: 3 },
      { label: 'D', text: '金鱼——记忆只有 7 秒，渣过就忘', score: 1 },
    ],
  },
  {
    id: 8,
    title: '对象三天没回消息，你会？',
    options: [
      { label: 'A', text: '给他编 100 种死法（车祸 / 穿越 / 被外星人绑架）', score: 3 },
      { label: 'B', text: '删了微信，等他哭着来加', score: 1 },
      { label: 'C', text: '直接打电话：“你是不是嗝屁了？没亖回一下”', score: 2 },
      { label: 'D', text: '发条朋友圈：“单身快乐”', score: 0 },
    ],
  },
  {
    id: 9,
    title: '你的恋爱座右铭更接近？',
    options: [
      { label: 'A', text: '“爱咋咋地”', score: 1 },
      { label: 'B', text: '“只要我够疯，伤心的就是别人”', score: 2 },
      { label: 'C', text: '“姐就是女王，自信放光芒”', score: 3 },
      { label: 'D', text: '“一个人也很好，但两个人也不错”', score: 0 },
    ],
  },
  {
    id: 10,
    title: '请用一句话形容你现在的恋爱状态。',
    options: [
      { label: 'A', text: '“正在从 1% 充电中……”', score: 3 },
      { label: 'B', text: '“关机，但偶尔震动”', score: 1 },
      { label: 'C', text: '“飞行模式中，但会连 WiFi”', score: 2 },
      { label: 'D', text: '“已恢复出厂设置”', score: 0 },
    ],
  },
  {
    id: 11,
    title: '朋友给你介绍对象，你第一句会问？',
    options: [
      { label: 'A', text: '“ta 磕什么 CP？”', score: 3 },
      { label: 'B', text: '“ta 看我的朋友圈会不会觉得我有病？”', score: 0 },
      { label: 'C', text: '“ta 能接受我半夜两点突然唱《求佛》吗？”', score: 1 },
      { label: 'D', text: '“ta 有钱吗？”', score: 2 },
    ],
  },
  {
    id: 12,
    title: '你喜欢一个人时，最真实状态是：',
    options: [
      { label: 'A', text: '先观察三天三夜，像在追剧', score: 2 },
      { label: 'B', text: '才刚聊两句，已经在想结婚桌数', score: 3 },
      { label: 'C', text: '找话题硬聊，尴尬也要聊', score: 1 },
      { label: 'D', text: '让 ta 慢慢注意我，我不急', score: 0 },
    ],
  },
  {
    id: 13,
    title: '如果你有一张鹿角巷“恋爱角色卡”，你希望上面写的技能是？',
    options: [
      { label: 'A', text: '“喝一口，对方自动上头”', score: 2 },
      { label: 'B', text: '“喝完这杯，所有前任都忘干净”', score: 0 },
      { label: 'C', text: '“把珍珠变成哑铃，喝完当场练出肱二头肌”', score: 3 },
      { label: 'D', text: '“奶茶喝一半，能召唤出一个替你去上班的分身”', score: 1 },
    ],
  },
]

export const TOTAL_QUESTIONS = questions.length
export const MAX_SCORE = questions.reduce(
  (sum, q) => sum + Math.max(...q.options.map((o) => o.score)),
  0,
)
