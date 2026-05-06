/**
 * 测评人格定义 —— 8 段
 * 0~5  吃瓜群众
 * 6~10 孤寡艺术家
 * 11~15 绿茶杀手
 * 16~20 冷面霸总
 * 21~25 上岸海王
 * 26~30 直球选手
 * 31~35 晚期恋爱脑
 * 36~39 纯爱战神
 *
 * 注：图片用 import 方式引入，避免部署到子路径或哈希路由时
 *     绝对路径 /static/xxx.jpg 解析不到（Vercel 等场景）
 */

import imgEatMelon from "@/static/resultImg/Eat-melon.jpg";
import imgLonelyWidowed from "@/static/resultImg/lonely-widowed.jpg";
import imgKiller from "@/static/resultImg/Killer.jpg";
import imgOverbearingCEO from "@/static/resultImg/Overbearing-CEO.jpg";
import imgAquaman from "@/static/resultImg/Aquaman.jpg";
import imgFastball from "@/static/resultImg/Fastball.jpg";
import imgListenAdvice from "@/static/resultImg/Listen-advice.jpg";
import imgTrueloveWarrior from "@/static/resultImg/Truelove-warrior.jpg";

export interface Personality {
  /** 唯一标识 */
  key: string;
  /** 人格名 */
  name: string;
  /** 一句话简介，用于结果页人格名下方 */
  tagline: string;
  /** 分数下限（含） */
  min: number;
  /** 分数上限（含） */
  max: number;
  /** 长图地址（由 Vite 处理后输出带 hash 的相对路径） */
  image: string;
  /** 主题色（用于结果页装饰元素） */
  color: string;
}

export const personalities: Personality[] = [
  {
    key: "eatMelon",
    name: "吃瓜群众",
    tagline: "看戏第一名，参与最末名",
    min: 0,
    max: 5,
    image: imgEatMelon,
    color: "#7BC47F",
  },
  {
    key: "lonelyArtist",
    name: "孤寡艺术家",
    tagline: "一个人也能把日子过成诗",
    min: 6,
    max: 10,
    image: imgLonelyWidowed,
    color: "#9B8CFF",
  },
  {
    key: "greenTeaKiller",
    name: "绿茶杀手",
    tagline: "人畜无害的微笑底下，全是套路",
    min: 11,
    max: 15,
    image: imgKiller,
    color: "#5FD3B6",
  },
  {
    key: "coldCEO",
    name: "冷面霸总",
    tagline: "面冷心热，傲娇但护短",
    min: 16,
    max: 20,
    image: imgOverbearingCEO,
    color: "#3C5A7C",
  },
  {
    key: "shoreFishKing",
    name: "上岸海王",
    tagline: "鱼塘已清空，但偶尔还会回去看看",
    min: 21,
    max: 25,
    image: imgAquaman,
    color: "#39A0C5",
  },
  {
    key: "straightShooter",
    name: "直球选手",
    tagline: "喜欢就直接说，绕弯路浪费感情",
    min: 26,
    max: 30,
    image: imgFastball,
    color: "#FF8A65",
  },
  {
    key: "lateLoveBrain",
    name: "晚期恋爱脑",
    tagline: "为爱发电，永不断电",
    min: 31,
    max: 35,
    image: imgListenAdvice,
    color: "#F06292",
  },
  {
    key: "pureLoveGod",
    name: "纯爱战神",
    tagline: "世界破破烂烂，纯爱缝缝补补",
    min: 36,
    max: 39,
    image: imgTrueloveWarrior,
    color: "#E91E63",
  },
];
