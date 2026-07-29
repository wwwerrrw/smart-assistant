import type { Article, Doctor, PlanItem } from '../types'

export const doctors: Doctor[] = [
  {
    id: 'zhao',
    name: '赵晓峰',
    department: '内分泌科',
    title: '主任医师',
    specialty: '擅长糖尿病分型、血糖管理与并发症筛查',
    image: '/images/doctor-zhao.jpg',
    online: true,
  },
  {
    id: 'sun',
    name: '孙雅琴',
    department: '内分泌科',
    title: '副主任医师',
    specialty: '擅长妊娠期糖尿病、营养管理与体重干预',
    image: '/images/doctor-sun.jpg',
    online: true,
  },
  {
    id: 'zhou',
    name: '周佳',
    department: '全科医学科',
    title: '主治医师',
    specialty: '擅长慢病随访、运动指导与生活方式管理',
    image: '/images/doctor-zhou.jpg',
    online: false,
  },
]

export const articles: Article[] = [
  {
    id: 'early-screening',
    title: '糖尿病的早期症状及预防措施',
    summary: '识别口渴、多尿、体重变化等信号，了解规范筛查方式。',
    category: '风险预防',
    views: 1280,
    image: '/images/article-care.jpg',
    author: '糖护健康中心',
    content: [
      '糖尿病早期可能没有明显症状，也可能出现口渴、多尿、容易疲劳、体重无明显原因下降等表现。仅凭症状不能确诊，应通过正规医疗机构的血糖检查判断。',
      '有糖尿病家族史、超重或肥胖、高血压、久坐少动等风险因素的人群，应在医生建议下定期进行空腹血糖、糖耐量或糖化血红蛋白检查。',
      '保持规律作息、均衡饮食和每周至少 150 分钟中等强度运动，有助于降低 2 型糖尿病风险。',
    ],
  },
  {
    id: 'diet-guide',
    title: '糖尿病患者的日常饮食指南',
    summary: '从主食、蛋白质、脂肪和进餐顺序入手稳定餐后血糖。',
    category: '饮食管理',
    views: 960,
    image: '/images/article-food.jpg',
    author: '糖护健康中心',
    content: [
      '主食优先选择全谷物、杂豆和薯类，搭配足量非淀粉类蔬菜。控制总量比完全不吃主食更重要。',
      '蛋白质可选择鱼、禽、蛋、奶和豆制品；减少油炸食品、加工肉制品和含糖饮料。',
      '进餐时可先吃蔬菜，再吃蛋白质食物，最后吃主食。定时定量，避免暴饮暴食。',
    ],
  },
  {
    id: 'exercise-guide',
    title: '科学运动：让控糖更稳妥',
    summary: '有氧运动与力量训练结合，建立可持续的活动节奏。',
    category: '运动管理',
    views: 842,
    image: '/images/article-walk.jpg',
    author: '糖护健康中心',
    content: [
      '一般建议每周累计至少 150 分钟中等强度有氧运动，并安排 2 至 3 次力量训练。应结合个人基础和医生建议逐步增加运动量。',
      '运动前后关注血糖和身体感受，随身携带可快速补充糖分的食物。出现心慌、手抖、出冷汗等低血糖表现时应立即停止运动并处理。',
      '存在严重并发症、近期血糖明显异常或处于妊娠期时，应先咨询专业医生再制定运动计划。',
    ],
  },
  {
    id: 'sleep-stress',
    title: '睡眠与压力也会影响血糖',
    summary: '用规律睡眠和压力管理改善长期生活状态。',
    category: '生活习惯',
    views: 631,
    image: '/images/article-care.jpg',
    author: '糖护健康中心',
    content: [
      '睡眠不足可能影响胰岛素敏感性和食欲调节。建议建立固定作息，成年人通常需要 7 至 8 小时高质量睡眠。',
      '长期压力会影响生活节律。散步、呼吸训练、与亲友交流和寻求专业支持，都可以成为可持续的减压方式。',
    ],
  },
]

export const planItems: PlanItem[] = [
  { id: 'breakfast', type: 'diet', time: '07:30', title: '均衡早餐', content: '全麦主食 + 鸡蛋 + 无糖奶 + 一份蔬菜' },
  { id: 'lunch', type: 'diet', time: '12:10', title: '控制午餐份量', content: '半盘蔬菜、四分之一优质蛋白、四分之一主食' },
  { id: 'snack', type: 'diet', time: '15:30', title: '理性加餐', content: '无糖酸奶或一小份低升糖水果' },
  { id: 'dinner', type: 'diet', time: '18:30', title: '清淡晚餐', content: '减少油盐，晚餐后不再摄入含糖饮料' },
  { id: 'walk', type: 'exercise', time: '07:00', title: '晨间快走', content: '中等强度快走 30 分钟，运动前后关注身体感受' },
  { id: 'strength', type: 'exercise', time: '19:00', title: '基础力量训练', content: '深蹲、靠墙俯卧撑与弹力带训练，共 20 分钟' },
]

export const weeklyCompletion = [
  { day: '周一', diet: 80, exercise: 60 },
  { day: '周二', diet: 100, exercise: 80 },
  { day: '周三', diet: 75, exercise: 100 },
  { day: '周四', diet: 100, exercise: 70 },
  { day: '周五', diet: 85, exercise: 90 },
  { day: '周六', diet: 90, exercise: 75 },
  { day: '今天', diet: 50, exercise: 50 },
]
