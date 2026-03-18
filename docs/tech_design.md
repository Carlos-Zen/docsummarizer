# DocSummarizer 技术设计

## 1. 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Vue 3)                     │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Uploader │  │ Summary  │  │ History  │              │
│  │ 上传组件 │  │ 摘要组件 │  │ 历史组件 │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│       │             │             │                      │
│  ┌────┴─────────────┴─────────────┴─────┐              │
│  │              API Service              │              │
│  │           (AI接口封装)                │              │
│  └──────────────────┬────────────────────┘              │
│                     │                                    │
│  ┌──────────────────┴────────────────────┐              │
│  │            Storage (IndexedDB)         │              │
│  │  ┌──────────┐  ┌──────────┐           │              │
│  │  │summaries │  │  files   │           │              │
│  │  └──────────┘  └──────────┘           │              │
│  └───────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   External AI API   │
              │  (OpenAI / Claude)  │
              └─────────────────────┘
```

## 2. 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | Vue 3 + TypeScript | 组合式API |
| 构建 | Vite | 快速构建 |
| UI | Naive UI | 组件库 |
| 存储 | IndexedDB | 本地存储 |
| AI | OpenAI API | 文本生成 |
| 文件解析 | pdf.js / mammoth | PDF/Word解析 |

## 3. 核心模块

### 3.1 文件处理服务

```typescript
// services/file.processor.ts
export interface ProcessedFile {
  text: string
  metadata: {
    filename: string
    size: number
    pages?: number
    type: string
  }
}

export class FileProcessor {
  async processPDF(file: File): Promise<ProcessedFile> {
    // 使用pdf.js提取文本
  }

  async processWord(file: File): Promise<ProcessedFile> {
    // 使用mammoth提取文本
  }

  async processImage(file: File): Promise<ProcessedFile> {
    // 使用OCR或直接返回描述
  }

  async processText(file: File): Promise<ProcessedFile> {
    // 直接读取文本
  }
}
```

### 3.2 AI摘要服务

```typescript
// services/summary.service.ts
export interface SummaryResult {
  title: string
  summary: string
  keyPoints: string[]
  keywords: string[]
  suggestions?: string
}

export class SummaryService {
  private apiKey: string
  private model: string = 'gpt-4o-mini'

  async summarize(text: string, options?: SummaryOptions): Promise<SummaryResult> {
    const prompt = this.buildPrompt(text, options)
    const response = await this.callAI(prompt)
    return this.parseResponse(response)
  }

  private buildPrompt(text: string, options?: SummaryOptions): string {
    return `请对以下内容进行摘要分析：

${text}

请按以下格式输出：
1. 标题（一句话概括主题）
2. 摘要（100-200字）
3. 关键要点（3-5条）
4. 关键词（5个）
`
  }
}
```

### 3.3 存储服务

```typescript
// services/storage.ts
export interface StoredSummary {
  id: string
  filename: string
  originalText: string
  summary: SummaryResult
  createdAt: string
}

export class StorageService {
  async save(summary: StoredSummary): Promise<void>
  async getAll(): Promise<StoredSummary[]>
  async getById(id: string): Promise<StoredSummary | undefined>
  async delete(id: string): Promise<void>
  async search(query: string): Promise<StoredSummary[]>
}
```

## 4. 数据模型

```typescript
// types/index.ts
export interface Summary {
  id: string
  filename: string
  fileType: string
  originalText: string
  title: string
  summary: string
  keyPoints: string[]
  keywords: string[]
  createdAt: string
  updatedAt: string
}

export interface SummaryTemplate {
  id: string
  name: string
  prompt: string
  outputFormat: 'default' | 'academic' | 'business' | 'simple'
}
```

## 5. API设计

### 内部API

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/summarize | 生成摘要 |
| GET | /api/history | 获取历史 |
| GET | /api/summary/:id | 获取详情 |
| DELETE | /api/summary/:id | 删除记录 |

### AI API调用

```typescript
const API_CONFIG = {
  openai: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    maxTokens: 2000
  },
  claude: {
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-haiku-20240307',
    maxTokens: 2000
  },
  deepseek: {
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    maxTokens: 2000
  }
}
```

## 6. 安全设计

- API Key本地加密存储
- 文件不上传到服务器（仅发送文本到AI API）
- 支持本地模型（可选）

## 7. 性能指标

| 指标 | 目标 |
|------|------|
| 文件解析 | < 3秒 |
| AI响应 | < 10秒 |
| 页面加载 | < 2秒 |
| 历史查询 | < 500ms |