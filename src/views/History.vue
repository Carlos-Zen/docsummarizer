<template>
  <div class="space-y-6">
    <!-- 搜索和筛选 -->
    <div class="flex justify-between items-center">
      <n-input
        v-model:value="searchQuery"
        placeholder="搜索摘要..."
        class="w-64"
        clearable
      >
        <template #prefix>🔍</template>
      </n-input>
      <n-button type="error" @click="handleClearAll">
        清空历史
      </n-button>
    </div>

    <!-- 摘要列表 -->
    <n-card>
      <n-empty v-if="filteredSummaries.length === 0" description="暂无历史记录" />
      <n-list v-else bordered>
        <n-list-item v-for="summary in filteredSummaries" :key="summary.id">
          <div class="flex justify-between items-start w-full">
            <div class="flex-1 cursor-pointer" @click="router.push(`/summary/${summary.id}`)">
              <h4 class="font-medium text-gray-800 mb-1">{{ summary.title }}</h4>
              <p class="text-sm text-gray-500 line-clamp-2">{{ summary.summary }}</p>
              <div class="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span>{{ summary.filename }}</span>
                <span>{{ formatDate(summary.createdAt) }}</span>
                <n-tag size="small">{{ summary.style }}</n-tag>
              </div>
            </div>
            <n-button text type="error" @click.stop="handleDelete(summary.id)">
              删除
            </n-button>
          </div>
        </n-list-item>
      </n-list>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NCard, NInput, NButton, NList, NListItem, NEmpty, NTag, useMessage, useDialog } from 'naive-ui'
import { initDB, getAllSummaries, deleteSummary } from '@/services'
import type { Summary } from '@/types'

const router = useRouter()
const message = useMessage()
const dialog = useDialog()

const summaries = ref<Summary[]>([])
const searchQuery = ref('')

const filteredSummaries = computed(() => {
  if (!searchQuery.value) return summaries.value

  const query = searchQuery.value.toLowerCase()
  return summaries.value.filter(s =>
    s.title.toLowerCase().includes(query) ||
    s.summary.toLowerCase().includes(query) ||
    s.filename.toLowerCase().includes(query)
  )
})

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function handleDelete(id: string) {
  dialog.warning({
    title: '确认删除',
    content: '确定要删除这条摘要吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      await deleteSummary(id)
      summaries.value = summaries.value.filter(s => s.id !== id)
      message.success('删除成功')
    }
  })
}

async function handleClearAll() {
  dialog.warning({
    title: '确认清空',
    content: '确定要清空所有历史记录吗？此操作不可恢复。',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const db = await initDB()
      await db.clear('summaries')
      summaries.value = []
      message.success('已清空所有历史记录')
    }
  })
}

onMounted(async () => {
  await initDB()
  summaries.value = await getAllSummaries()
})
</script>