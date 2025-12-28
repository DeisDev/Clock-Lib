<template>
  <div class="console-viewer">
    <div class="console-header">
      <div class="console-filters">
        <button
          v-for="level in levels"
          :key="level"
          class="filter-btn"
          :class="{ active: filterLevel === level }"
          @click="filterLevel = level"
        >
          {{ level === 'all' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1) }}
        </button>
      </div>
      <button class="clear-btn" @click="clearLogs">Clear</button>
    </div>
    <div ref="logsContainer" class="console-logs">
      <div
        v-for="(log, index) in filteredLogs"
        :key="index"
        class="log-entry"
        :class="log.level"
      >
        <div class="log-meta">
          <span class="log-level">{{ log.level.toUpperCase() }}</span>
          <span class="log-time">{{ formatTime(log.timestamp) }}</span>
        </div>
        <pre class="log-text">{{ log.text }}</pre>
      </div>
      <div v-if="filteredLogs.length === 0" class="log-empty">
        No logs to display
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useConsole } from '@/composables/useConsole'

const { logs, clearLogs: clear } = useConsole()

const logsContainer = ref<HTMLElement | null>(null)
const filterLevel = ref('all')

const levels = ['all', 'log', 'info', 'warn', 'error', 'debug']

const filteredLogs = computed(() => {
  if (filterLevel.value === 'all') return logs.value
  return logs.value.filter(log => log.level === filterLevel.value)
})

function clearLogs() {
  clear()
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString()
}

watch(logs, () => {
  nextTick(() => {
    if (logsContainer.value) {
      logsContainer.value.scrollTop = logsContainer.value.scrollHeight
    }
  })
}, { deep: true })
</script>

<style scoped>
.console-viewer {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid var(--panel-border, rgba(255, 255, 255, 0.08));
  gap: 10px;
  flex-shrink: 0;
}

.console-filters {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 4px 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms ease;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
}

.filter-btn.active {
  background: rgba(95, 211, 232, 0.15);
  border-color: rgba(95, 211, 232, 0.3);
  color: var(--accent, #5fd3e8);
}

.clear-btn {
  padding: 6px 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms ease;
}

.clear-btn:hover {
  background: rgba(255, 80, 80, 0.15);
  border-color: rgba(255, 80, 80, 0.3);
  color: #ff6b6b;
}

.console-logs {
  flex: 1;
  overflow-y: auto;
  padding: 10px 14px;
  display: grid;
  gap: 6px;
  align-content: start;
}

.log-entry {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.02);
}

.log-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 10px;
}

.log-level {
  font-weight: 600;
  letter-spacing: 0.05em;
}

.log-time {
  color: rgba(255, 255, 255, 0.4);
}

.log-text {
  margin: 0;
  font-size: 12px;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  white-space: pre-wrap;
  word-break: break-word;
  color: rgba(255, 255, 255, 0.85);
}

.log-entry.log .log-level { color: #b5d9ff; }
.log-entry.info .log-level { color: #90ffb0; }
.log-entry.warn .log-level { color: #ffd88a; }
.log-entry.error .log-level { color: #ff9fa3; }
.log-entry.debug .log-level { color: #a1a1ff; }

.log-entry.error {
  border-color: rgba(255, 100, 100, 0.2);
  background: rgba(255, 100, 100, 0.05);
}

.log-entry.warn {
  border-color: rgba(255, 200, 100, 0.2);
  background: rgba(255, 200, 100, 0.05);
}

.log-empty {
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
}
</style>
