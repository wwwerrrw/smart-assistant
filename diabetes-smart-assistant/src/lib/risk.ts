import type { AssessmentInput, AssessmentResult } from '../types'

const round = (value: number) => Math.round(value * 10) / 10

export function calculateRisk(input: AssessmentInput): AssessmentResult {
  const heightMeters = input.height / 100
  const bmi = round(input.weight / (heightMeters * heightMeters))
  const factors: string[] = []
  let score = 0

  if (input.age >= 65) {
    score += 4
    factors.push('年龄在 65 岁及以上')
  } else if (input.age >= 45) {
    score += 2
    factors.push('年龄在 45 岁及以上')
  }

  if (bmi >= 28) {
    score += 4
    factors.push(`BMI 为 ${bmi}，处于肥胖范围`)
  } else if (bmi >= 24) {
    score += 2
    factors.push(`BMI 为 ${bmi}，处于超重范围`)
  }

  const waistThreshold = input.sex === 'male' ? 90 : 85
  if (input.waist >= waistThreshold) {
    score += 2
    factors.push('腰围高于建议筛查阈值')
  }

  if (input.systolic >= 140) {
    score += 3
    factors.push('收缩压偏高')
  } else if (input.systolic >= 130) {
    score += 1
    factors.push('收缩压接近高值范围')
  }

  if (input.fastingGlucose >= 7) {
    score += 6
    factors.push('空腹血糖达到应尽快就医复查的范围')
  } else if (input.fastingGlucose >= 6.1) {
    score += 4
    factors.push('空腹血糖高于正常参考范围')
  } else if (input.fastingGlucose >= 5.6) {
    score += 2
    factors.push('空腹血糖接近偏高范围')
  }

  if (input.familyHistory) {
    score += 3
    factors.push('存在糖尿病家族史')
  }

  if (input.activityMinutes < 150) {
    score += 2
    factors.push('每周中等强度运动少于 150 分钟')
  }

  if (input.pregnancy && input.sex === 'female') {
    score += 2
    factors.push('处于孕期，需要进行妊娠期糖尿病规范筛查')
  }

  const level = score >= 11 ? 'high' : score >= 6 ? 'moderate' : 'low'
  const suggestions = [
    level === 'high'
      ? '建议尽快到正规医疗机构进行空腹血糖、糖耐量或糖化血红蛋白检查。'
      : level === 'moderate'
        ? '建议在医生指导下完善血糖筛查，并连续记录饮食、运动和体重变化。'
        : '当前风险因素较少，继续保持规律饮食、运动和年度血糖筛查。',
    '每周累计至少 150 分钟中等强度运动，并避免连续久坐。',
    '优先选择全谷物、蔬菜、优质蛋白，控制含糖饮料和精制碳水。',
  ]

  return { score, level, bmi, factors, suggestions }
}

