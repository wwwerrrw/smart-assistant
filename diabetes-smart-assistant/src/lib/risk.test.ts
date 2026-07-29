import { describe, expect, it } from 'vitest'
import { calculateRisk } from './risk'

describe('calculateRisk', () => {
  it('returns a low risk result for a healthy baseline', () => {
    const result = calculateRisk({
      age: 30,
      sex: 'male',
      height: 175,
      weight: 65,
      waist: 78,
      systolic: 118,
      fastingGlucose: 5.1,
      familyHistory: false,
      activityMinutes: 180,
      pregnancy: false,
    })

    expect(result.level).toBe('low')
    expect(result.score).toBe(0)
    expect(result.bmi).toBe(21.2)
  })

  it('raises the result when several validated risk factors are present', () => {
    const result = calculateRisk({
      age: 68,
      sex: 'female',
      height: 160,
      weight: 82,
      waist: 99,
      systolic: 146,
      fastingGlucose: 7.2,
      familyHistory: true,
      activityMinutes: 40,
      pregnancy: false,
    })

    expect(result.level).toBe('high')
    expect(result.score).toBeGreaterThanOrEqual(11)
    expect(result.factors).toContain('空腹血糖达到应尽快就医复查的范围')
  })
})
