<template>
  <n-config-provider>
    <n-message-provider>
      <n-dialog-provider>
        <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <!-- 导航栏 -->
          <header class="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
              <div class="flex items-center gap-3">
                <span class="text-2xl">📄</span>
                <h1 class="text-xl font-bold text-gray-800">DocSummarizer</h1>
              </div>
              <nav class="flex gap-6">
                <router-link
                  v-for="item in navItems"
                  :key="item.path"
                  :to="item.path"
                  class="text-gray-600 hover:text-blue-600 transition-colors"
                  :class="{ 'text-blue-600 font-medium': $route.path === item.path }"
                >
                  {{ item.label }}
                </router-link>
              </nav>
              <n-button @click="showSettings = true">
                <template #icon>⚙️</template>
                设置
              </n-button>
            </div>
          </header>

          <!-- 主内容 -->
          <main class="max-w-6xl mx-auto px-6 py-8">
            <router-view />
          </main>
        </div>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>

  <!-- 设置弹窗 -->
  <n-modal v-model:show="showSettings" preset="card" title="设置" style="width: 500px">
    <n-form label-placement="left" label-width="100">
      <n-form-item label="AI服务商">
        <n-select v-model:value="settings.provider" :options="providerOptions" />
      </n-form-item>
      <n-form-item label="API Key">
        <n-input
          v-model:value="settings.apiKey"
          type="password"
          placeholder="输入您的API Key"
          show-password-on="click"
        />
      </n-form-item>
      <n-form-item label="摘要风格">
        <n-select v-model:value="settings.style" :options="styleOptions" />
      </n-form-item>
    </n-form>
    <template #footer>
      <n-button type="primary" @click="saveSettings">保存设置</n-button>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  NConfigProvider, NMessageProvider, NDialogProvider, NModal,
  NForm, NFormItem, NInput, NSelect, NButton
} from 'naive-ui'

const showSettings = ref(false)

const settings = reactive({
  provider: 'openai',
  apiKey: '',
  style: 'default'
})

const navItems = [
  { path: '/', label: '首页' },
  { path: '/history', label: '历史记录' }
]

const providerOptions = [
  { label: 'OpenAI', value: 'openai' },
  { label: 'Claude', value: 'claude' },
  { label: 'DeepSeek', value: 'deepseek' }
]

const styleOptions = [
  { label: '标准摘要', value: 'default' },
  { label: '学术风格', value: 'academic' },
  { label: '商务风格', value: 'business' },
  { label: '简洁风格', value: 'simple' }
]

function saveSettings() {
  localStorage.setItem('docsummarizer_settings', JSON.stringify(settings))
  showSettings.value = false
}

onMounted(() => {
  const saved = localStorage.getItem('docsummarizer_settings')
  if (saved) {
    Object.assign(settings, JSON.parse(saved))
  }
})
</script>