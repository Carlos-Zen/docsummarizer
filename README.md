# DocSummarizer

<p align="center">
  <strong>AI文档摘要工具 | AI-Powered Document Summarizer</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.4-brightgreen" alt="Vue 3.4">
  <img src="https://img.shields.io/badge/TypeScript-5.4-blue" alt="TypeScript 5.4">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License">
</p>

<p align="center">
  <a href="#english">English</a> | <a href="#中文">中文</a>
</p>

---

<a name="english"></a>
## English

AI-powered document summarization tool. Summarize documents in 10 seconds, supporting PDF/Word/TXT/Markdown formats.

### ✨ Features

- 🤖 **AI-Powered** - Support for OpenAI, Claude, DeepSeek
- 📄 **Multi-Format** - PDF, Word, TXT, Markdown
- 💾 **Local Storage** - History saved locally
- 🎨 **Multiple Styles** - Academic, Business, Simple styles
- 📥 **Export** - Markdown format export

### 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| Vue 3 + TypeScript | Frontend Framework |
| Vite | Build Tool |
| Pinia | State Management |
| Naive UI | UI Components |
| IndexedDB | Local Storage |

### 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Carlos-Zen/docsummarizer.git
cd docsummarizer

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### ⚙️ Configuration

1. Click "Settings" in the top right corner
2. Select AI provider (OpenAI/Claude/DeepSeek)
3. Enter your API Key
4. Start summarizing!

### 📁 Project Structure

```
src/
├── views/          # Page components
│   ├── Home.vue       # Upload & summarize
│   ├── History.vue    # Summary history
│   └── SummaryDetail.vue
├── services/       # Business services
│   ├── ai.ts          # AI API integration
│   └── db.ts          # IndexedDB operations
├── types/          # TypeScript definitions
└── router/         # Vue Router config
```

### 📋 Features Detail

#### Document Processing
- Direct text input
- File upload support
- Batch processing (coming soon)

#### AI Summarization
- Multiple AI providers
- Style selection (Academic/Business/Simple)
- Language selection (Chinese/English)

#### Output Format
```
## Title
One-sentence summary

## Summary
100-200 word core content

## Key Points
- Point 1
- Point 2
- Point 3

## Keywords
keyword1, keyword2, keyword3...
```

### 💾 Data Storage

All summaries are stored locally in IndexedDB:
- Original text
- Generated summary
- Metadata (date, style, etc.)

### 📄 License

[MIT](LICENSE)

---

<a name="中文"></a>
## 中文

AI驱动的文档摘要工具。10秒完成文档摘要，支持PDF/Word/TXT/Markdown格式。

### ✨ 特性

- 🤖 **AI驱动** - 支持 OpenAI、Claude、DeepSeek
- 📄 **多格式支持** - PDF、Word、TXT、Markdown
- 💾 **本地存储** - 历史记录本地保存
- 🎨 **多种风格** - 学术、商务、简洁风格
- 📥 **导出功能** - Markdown格式导出

### 🛠 技术栈

| 技术 | 用途 |
|------|------|
| Vue 3 + TypeScript | 前端框架 |
| Vite | 构建工具 |
| Pinia | 状态管理 |
| Naive UI | UI组件库 |
| IndexedDB | 本地存储 |

### 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/Carlos-Zen/docsummarizer.git
cd docsummarizer

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### ⚙️ 配置

1. 点击右上角"设置"
2. 选择AI服务商（OpenAI/Claude/DeepSeek）
3. 输入您的API Key
4. 开始使用！

### 📁 项目结构

```
src/
├── views/          # 页面组件
│   ├── Home.vue       # 上传与摘要
│   ├── History.vue    # 历史记录
│   └── SummaryDetail.vue
├── services/       # 业务服务
│   ├── ai.ts          # AI API集成
│   └── db.ts          # IndexedDB操作
├── types/          # 类型定义
└── router/         # 路由配置
```

### 📋 功能详情

#### 文档处理
- 直接输入文本
- 文件上传支持
- 批量处理（即将支持）

#### AI摘要
- 多AI服务商支持
- 风格选择（学术/商务/简洁）
- 语言选择（中文/英文）

#### 输出格式
```
## 标题
一句话概括主题

## 摘要
100-200字核心内容

## 关键要点
- 要点1
- 要点2
- 要点3

## 关键词
关键词1、关键词2、关键词3...
```

### 💾 数据存储

所有摘要存储在本地IndexedDB中：
- 原始文本
- 生成的摘要
- 元数据（日期、风格等）

### 📄 许可证

[MIT](LICENSE)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Carlos-Zen">Carlos-Zen</a>
</p>