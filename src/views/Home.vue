<template>
  <div class="space-y-8">
    <!-- 上传区域 -->
    <n-card class="shadow-lg">
      <div class="text-center py-8">
        <n-upload
          :custom-request="handleUpload"
          :show-file-list="false"
          accept=".txt,.md,.pdf,.doc,.docx"
          multiple
        >
          <n-upload-dragger>
            <div class="py-8">
              <div class="text-6xl mb-4">📤</div>
              <p class="text-lg font-medium text-gray-700 mb-2">
                点击或拖拽文件到此处
              </p>
              <p class="text-sm text-gray-400">
                支持 PDF、Word、TXT、Markdown 格式
              </p>
            </div>
          </n-upload-dragger>
        </n-upload>
      </div>
    </n-card>

    <!-- 直接输入文本 -->
    <n-card title="或直接输入文本">
      <n-input
        v-model:value="inputText"
        type="textarea"
        placeholder="粘贴需要摘要的文本内容..."
        :rows="8"
      />
      <div class="flex justify-between items-center mt-4">
        <span class="text-sm text-gray-400">{{ inputText.length }} 字符</span>
        <n-button
          type="primary"
          :loading="loading"
          :disabled="!inputText.trim() || !hasApiKey"
          @click="handleSummarize"
        >
          生成摘要
        </n-button>
      </div>
    </n-card>

    <!-- 结果展示 -->
    <n-card v-if="result" title="摘要结果">
      <div class="space-y-4">
        <div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">{{ result.title }}</h3>
          <n-tag type="info" size="small">{{ result.style }}</n-tag>
        </div>

        <n-divider />

        <div>
          <h4 class="font-medium text-gray-700 mb-2">摘要</h4>
          <p class="text-gray-600 leading-relaxed">{{ result.summary }}</p>
        </div>

        <div>
          <h4 class="font-medium text-gray-700 mb-2">关键要点</h4>
          <ul class="space-y-2">
            <li
              v-for="(point, index) in result.keyPoints"
              :key="index"
              class="flex items-start gap-2"
            >
              <span class="text-blue-500">•</span>
              <span class="text-gray-600">{{ point }}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="font-medium text-gray-700 mb-2">关键词</h4>
          <n-space>
            <n-tag v-for="keyword in result.keywords" :key="keyword" type="primary">
              {{ keyword }}
            </n-tag>
          </n-space>
        </div>

        <n-divider />

        <div class="flex justify-end gap-2">
          <n-button @click="handleCopy">
            <template #icon>📋</template>
            复制
          </n-button>
          <n-button @click="handleExport">
            <template #icon>📥</template>
            导出Markdown
          </n-button>
          <n-button type="primary" @click="handleSave">
            <template #icon>💾</template>
            保存
          </n-button>
        </div>
      </div>
    </n-card>

    <!-- API Key提示 -->
    <n-alert v-if="!hasApiKey" type="warning" title="请先配置API Key">
      点击右上角"设置"按钮，输入您的AI服务API Key后即可使用。
    </n-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  NCard, NUpload, NUploadDragger, NInput, NButton, NTag, NSpace,
  NDivider, NAlert, useMessage
} from 'naive-ui'
import type { UploadCustomRequestOptions } from 'naive-ui'
import { initDB, saveSummary, generateSummary, exportToMarkdown } from '@/services'
import type { Summary, AppSettings } from '@/types'

const router = useRouter()
const message = useMessage()

const loading = ref(false)
const inputText = ref('')
const result = ref<Summary | null>(null)
const settings = ref<AppSettings>({
  provider: 'openai',
  apiKey: '',
  style: 'default'
})

const hasApiKey = computed(() => !!settings.value.apiKey)

async function handleUpload({ file }: UploadCustomRequestOptions) {
  const text = await readFile(file.file)
  inputText.value = text
}

async function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject

    if (file.name.endsWith('.pdf')) {
      // PDF需要特殊处理，这里简化处理
      message.warning('PDF文件暂不支持，请复制文本内容')
      resolve('')
    } else {
      reader.readAsText(file)
    }
  })
}

async function handleSummarize() {
  if (!inputText.value.trim() || !hasApiKey.value) return

  loading.value = true
  try {
    result.value = await generateSummary(
      inputText.value,
      settings.value,
      { style: settings.value.style }
    )
    result.value.filename = '直接输入'
    result.value.fileType = 'text'
    message.success('摘要生成成功')
  } catch (error: any) {
    message.error(`生成失败: ${error.message}`)
  } finally {
    loading.value = false
  }
}

async function handleCopy() {
  if (!result.value) return

  const markdown = exportToMarkdown(result.value)
  await navigator.clipboard.writeText(markdown)
  message.success('已复制到剪贴板')
}

function handleExport() {
  if (!result.value) return

  const markdown = exportToMarkdown(result.value)
  const blob = new Blob([markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${result.value.title}.md`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

async function handleSave() {
  if (!result.value) return

  await initDB()
  await saveSummary(result.value)
  message.success('已保存到历史记录')
  router.push('/history')
}

onMounted(async () => {
  await initDB()
  const saved = localStorage.getItem('docsummarizer_settings')
  if (saved) {
    settings.value = JSON.parse(saved)
  }
})
</script>