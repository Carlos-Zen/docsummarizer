// 摘要结果
export interface Summary {
  id: string
  filename: string
  fileType: string
  originalText: string
  title: string
  summary: string
  keyPoints: string[]
  keywords: string[]
  style: SummaryStyle
  createdAt: string
  updatedAt: string
}

// 摘要风格
export type SummaryStyle = 'default' | 'academic' | 'business' | 'simple'

// AI提供商
export type AIProvider = 'openai' | 'claude' | 'deepseek'

// 应用设置
export interface AppSettings {
  provider: AIProvider
  apiKey: string
  style: SummaryStyle
  maxTokens?: number
}

// 处理后的文件
export interface ProcessedFile {
  text: string
  metadata: {
    filename: string
    size: number
    type: string
    pages?: number
  }
}

// 摘要选项
export interface SummaryOptions {
  style?: SummaryStyle
  maxLength?: number
  language?: 'zh' | 'en'
}