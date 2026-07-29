export type RiskLevel = 'low' | 'moderate' | 'high'

export interface UserProfile {
  name: string
  phone: string
  avatar: string
}

export interface AssistantStatus {
  configured: boolean
  provider: 'dify' | 'unconfigured'
}

export interface AssessmentInput {
  age: number
  sex: 'female' | 'male'
  height: number
  weight: number
  waist: number
  systolic: number
  fastingGlucose: number
  familyHistory: boolean
  activityMinutes: number
  pregnancy: boolean
}

export interface AssessmentResult {
  score: number
  level: RiskLevel
  bmi: number
  factors: string[]
  suggestions: string[]
}

export interface Doctor {
  id: string
  name: string
  department: string
  title: string
  specialty: string
  image: string
  online: boolean
}

export interface Article {
  id: string
  title: string
  summary: string
  category: string
  views: number
  image: string
  content: string[]
  author: string
}

export interface PlanItem {
  id: string
  type: 'diet' | 'exercise'
  time: string
  title: string
  content: string
}

export interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  content: string
  sources?: string[]
}
