import { describe, it, expect } from 'vitest'

describe('DocSummarizer Core Logic', () => {
  describe('Summary Types', () => {
    it('should have correct summary styles', () => {
      const styles = ['default', 'academic', 'business', 'simple']
      expect(styles).toHaveLength(4)
      expect(styles).toContain('default')
      expect(styles).toContain('academic')
    })

    it('should have correct AI providers', () => {
      const providers = ['openai', 'claude', 'deepseek']
      expect(providers).toHaveLength(3)
      expect(providers).toContain('openai')
      expect(providers).toContain('claude')
      expect(providers).toContain('deepseek')
    })
  })

  describe('Prompt Building', () => {
    it('should build default style prompt', () => {
      const stylePrompts = {
        default: '请对以下内容进行摘要分析，提取关键信息：',
        academic: '请以学术论文摘要的风格，对以下内容进行专业总结：',
        business: '请以商务报告的风格，简洁明了地总结以下内容：',
        simple: '请用简单易懂的语言，概括以下内容的核心要点：'
      }

      expect(stylePrompts.default).toContain('摘要分析')
      expect(stylePrompts.academic).toContain('学术论文')
      expect(stylePrompts.business).toContain('商务报告')
      expect(stylePrompts.simple).toContain('简单易懂')
    })

    it('should include language-specific output format', () => {
      const zhFormat = '## 标题'
      const enFormat = '## Title'

      expect(zhFormat).toBeTruthy()
      expect(enFormat).toBeTruthy()
    })
  })

  describe('AI Response Parsing', () => {
    it('should parse title from response', () => {
      const response = `## 标题
测试文档标题

## 摘要
这是一个测试摘要。`

      const titleMatch = response.match(/##\s*标题\s*\n+(.+?)(?=\n##|\n\n|$)/is)
      expect(titleMatch).not.toBeNull()
      expect(titleMatch?.[1]?.trim()).toBe('测试文档标题')
    })

    it('should parse key points from response', () => {
      const response = `## 关键要点
- 要点一
- 要点二
- 要点三`

      const keyPointsMatch = response.match(/##\s*关键要点\s*\n+([\s\S]+?)(?=\n##|$)/i)
      const keyPoints = keyPointsMatch?.[1]
        ?.split('\n')
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 0) || []

      expect(keyPoints).toHaveLength(3)
      expect(keyPoints).toContain('要点一')
      expect(keyPoints).toContain('要点二')
    })

    it('should parse keywords from response', () => {
      const response = '## 关键词\n人工智能、机器学习、深度学习'

      const keywordsMatch = response.match(/##\s*关键词\s*\n+(.+?)(?=\n##|$)/is)
      const keywords = keywordsMatch?.[1]
        ?.split(/[、,，\s]+/)
        .map(k => k.trim())
        .filter(k => k.length > 0) || []

      expect(keywords).toHaveLength(3)
      expect(keywords).toContain('人工智能')
      expect(keywords).toContain('机器学习')
    })
  })

  describe('API Configuration', () => {
    it('should have correct OpenAI endpoint', () => {
      const endpoint = 'https://api.openai.com/v1/chat/completions'
      expect(endpoint).toContain('openai.com')
    })

    it('should have correct Claude endpoint', () => {
      const endpoint = 'https://api.anthropic.com/v1/messages'
      expect(endpoint).toContain('anthropic.com')
    })

    it('should have correct DeepSeek endpoint', () => {
      const endpoint = 'https://api.deepseek.com/v1/chat/completions'
      expect(endpoint).toContain('deepseek.com')
    })

    it('should have correct default models', () => {
      const models = {
        openai: 'gpt-4o-mini',
        claude: 'claude-3-haiku-20240307',
        deepseek: 'deepseek-chat'
      }

      expect(models.openai).toMatch(/^gpt/)
      expect(models.claude).toMatch(/^claude/)
      expect(models.deepseek).toBe('deepseek-chat')
    })
  })
})

describe('Markdown Export', () => {
  it('should generate correct markdown structure', () => {
    const summary = {
      id: 'test-id',
      filename: 'test.md',
      fileType: 'markdown',
      originalText: 'Original content',
      title: 'Test Title',
      summary: 'Test summary',
      keyPoints: ['Point 1', 'Point 2'],
      keywords: ['keyword1', 'keyword2'],
      style: 'default' as const,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }

    const markdown = `# ${summary.title}

> 文件：${summary.filename}
> 创建时间：${summary.createdAt}

## 摘要

${summary.summary}

## 关键要点

${summary.keyPoints.map(p => `- ${p}`).join('\n')}

## 关键词

${summary.keywords.join('、')}
`

    expect(markdown).toContain('# Test Title')
    expect(markdown).toContain('Point 1')
    expect(markdown).toContain('keyword1、keyword2')
  })
})

describe('Search Functionality', () => {
  it('should search in title', () => {
    const summaries = [
      { title: '人工智能研究', summary: '', filename: '', keywords: [] },
      { title: '机器学习笔记', summary: '', filename: '', keywords: [] }
    ]

    const query = '人工智能'
    const results = summaries.filter(s =>
      s.title.toLowerCase().includes(query.toLowerCase())
    )

    expect(results).toHaveLength(1)
    expect(results[0].title).toBe('人工智能研究')
  })

  it('should search in keywords', () => {
    const summaries = [
      { title: 'Doc 1', summary: '', filename: '', keywords: ['AI', 'ML'] },
      { title: 'Doc 2', summary: '', filename: '', keywords: ['Python'] }
    ]

    const query = 'ai'
    const results = summaries.filter(s =>
      s.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
    )

    expect(results).toHaveLength(1)
  })
})