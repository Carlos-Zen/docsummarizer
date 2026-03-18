<template>
  <div class="max-w-4xl mx-auto">
    <n-spin :show="loading">
      <n-card v-if="summary">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold">{{ summary.title }}</h2>
            <n-space>
              <n-button @click="handleCopy">复制</n-button>
              <n-button @click="handleExport">导出</n-button>
              <n-button @click="router.back()">返回</n-button>
            </n-space>
          </div>
        </template>

        <n-descriptions :column="3" bordered class="mb-6">
          <n-descriptions-item label="文件名">{{ summary.filename }}</n-descriptions-item>
          <n-descriptions-item label="类型">{{ summary.fileType }}</n-descriptions-item>
          <n-descriptions-item label="风格">{{ summary.style }}</n-descriptions-item>
          <n-descriptions-item label="创建时间" :span="3">{{ formatDate(summary.createdAt) }}</n-descriptions-item>
        </n-descriptions>

        <n-divider>摘要内容</n-divider>

        <div class="space-y-6">
          <div>
            <h4 class="font-medium text-gray-700 mb-2 text-lg">核心摘要</h4>
            <p class="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded">{{ summary.summary }}</p>
          </div>

          <div>
            <h4 class="font-medium text-gray-700 mb-2 text-lg">关键要点</h4>
            <ul class="space-y-2 bg-gray-50 p-4 rounded">
              <li
                v-for="(point, index) in summary.keyPoints"
                :key="index"
                class="flex items-start gap-3"
              >
                <span class="text-blue-500 font-bold">{{ index + 1 }}.</span>
                <span class="text-gray-600">{{ point }}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-medium text-gray-700 mb-2 text-lg">关键词</h4>
            <n-space>
              <n-tag
                v-for="keyword in summary.keywords"
                :key="keyword"
                type="primary"
                size="large"
              >
                {{ keyword }}
              </n-tag>
            </n-space>
          </div>
        </div>

        <n-divider>原文</n-divider>

        <div class="bg-gray-50 p-4 rounded max-h-64 overflow-auto">
          <pre class="text-sm text-gray-600 whitespace-pre-wrap">{{ summary.originalText }}</pre>
        </div>
      </n-card>

      <n-empty v-else-if="!loading" description="摘要不存在" />
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NCard, NSpin, NDescriptions, NDescriptionsItem, NDivider,
  NButton, NSpace, NTag, NEmpty, useMessage
} from 'naive-ui'
import { initDB, getSummaryById, exportToMarkdown } from '@/services'
import type { Summary } from '@/types'

const route = useRoute()
const router = useRouter()
const message = useMessage()

const loading = ref(true)
const summary = ref<Summary | null>(null)

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('zh-CN')
}

async function handleCopy() {
  if (!summary.value) return

  const markdown = exportToMarkdown(summary.value)
  await navigator.clipboard.writeText(markdown)
  message.success('已复制到剪贴板')
}

function handleExport() {
  if (!summary.value) return

  const markdown = exportToMarkdown(summary.value)
  const blob = new Blob([markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${summary.value.title}.md`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

onMounted(async () => {
  const id = route.params.id as string
  await initDB()
  summary.value = await getSummaryById(id) || null
  loading.value = false
})
</script>