import type { Summary, AIProvider, SummaryOptions, AppSettings } from '@/types'

// API配置
const API_CONFIGS: Record<AIProvider, {
  endpoint: string
  model: string
  headers: (apiKey: string) => Record<string, string>
  buildBody: (prompt: string, model: string) => object
  parseResponse: (data: any) => string
}> = {
  openai: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    headers: (apiKey) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }),
    buildBody: (prompt, model) => ({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7
    }),
    parseResponse: (data) => data.choices[0].message.content
  },
  claude: {
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-haiku-20240307',
    headers: (apiKey) => ({
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    }),
    buildBody: (prompt, model) => ({
      model,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    }),
    parseResponse: (data) => data.content[0].text
  },
  deepseek: {
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    headers: (apiKey) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }),
    buildBody: (prompt, model) => ({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7
    }),
    parseResponse: (data) => data.choices[0].message.content
  }
}

// 构建提示词
function buildPrompt(text: string, options?: SummaryOptions): string {
  const stylePrompts: Record<string, string> = {
    default: '请对以下内容进行摘要分析，提取关键信息：',
    academic: '请以学术论文摘要的风格，对以下内容进行专业总结：',
    business: '请以商务报告的风格，简洁明了地总结以下内容：',
    simple: '请用简单易懂的语言，概括以下内容的核心要点：'
  }

  const style = options?.style || 'default'
  const language = options?.language || 'zh'

  const outputFormat = language === 'zh' ? `
请按以下格式输出：

## 标题
（一句话概括主题）

## 摘要
（100-200字的核心内容总结）

## 关键要点
- 要点1
- 要点2
- 要点3

## 关键词
关键词1、关键词2、关键词3、关键词4、关键词5
` : `
Please output in the following format:

## Title
(One sentence summary)

## Summary
(100-200 words core content summary)

## Key Points
- Point 1
- Point 2
- Point 3

## Keywords
keyword1, keyword2, keyword3, keyword4, keyword5
`

  return `${stylePrompts[style]}

${text}
${outputFormat}`
}

// 解析AI响应
function parseAIResponse(response: string): Omit<Summary, 'id' | 'filename' | 'fileType' | 'originalText' | 'style' | 'createdAt' | 'updatedAt'> {
  const titleMatch = response.match(/##\s*标题\s*\n+(.+?)(?=\n##|\n\n|$)/is)
  const summaryMatch = response.match(/##\s*摘要\s*\n+(.+?)(?=\n##|\n\n|$)/is)
  const keyPointsMatch = response.match(/##\s*关键要点\s*\n+([\s\S]+?)(?=\n##|$)/i)
  const keywordsMatch = response.match(/##\s*关键词\s*\n+(.+?)(?=\n##|$)/is)

  const title = titleMatch?.[1]?.trim() || '未命名文档'
  const summary = summaryMatch?.[1]?.trim() || ''

  const keyPoints = keyPointsMatch?.[1]
    ?.split('\n')
    .map(line => line.replace(/^[-•*]\s*/, '').trim())
    .filter(line => line.length > 0) || []

  const keywords = keywordsMatch?.[1]
    ?.split(/[、,，\s]+/)
    .map(k => k.trim())
    .filter(k => k.length > 0) || []

  return { title, summary, keyPoints, keywords }
}

// 调用AI API
export async function generateSummary(
  text: string,
  settings: AppSettings,
  options?: SummaryOptions
): Promise<Summary> {
  const config = API_CONFIGS[settings.provider]
  const prompt = buildPrompt(text, options)

  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: config.headers(settings.apiKey),
    body: JSON.stringify(config.buildBody(prompt, config.model))
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`AI API Error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  const content = config.parseResponse(data)
  const parsed = parseAIResponse(content)

  return {
    id: crypto.randomUUID(),
    filename: '',
    fileType: 'text',
    originalText: text,
    ...parsed,
    style: options?.style || settings.style,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

// 导出为Markdown
export function exportToMarkdown(summary: Summary): string {
  return `# ${summary.title}

> 文件：${summary.filename}
> 创建时间：${summary.createdAt}

## 摘要

${summary.summary}

## 关键要点

${summary.keyPoints.map(p => `- ${p}`).join('\n')}

## 关键词

${summary.keywords.join('、')}

---

*由 DocSummarizer 生成*
`
}