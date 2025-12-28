import { ref, onUnmounted } from 'vue'

export interface ConsoleLog {
  level: 'log' | 'info' | 'warn' | 'error' | 'debug'
  text: string
  timestamp: Date
}

const LOG_LIMIT = 500

export function useConsole() {
  const logs = ref<ConsoleLog[]>([])
  const filterLevel = ref<string>('all')
  
  const originalConsole = {
    log: console.log.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    debug: console.debug?.bind(console) ?? console.log.bind(console)
  }
  
  function stringifyArg(arg: unknown): string {
    if (typeof arg === 'string') return arg
    try {
      return JSON.stringify(arg, null, 2)
    } catch {
      return String(arg)
    }
  }
  
  function addLog(level: ConsoleLog['level'], args: unknown[]) {
    logs.value.push({
      level,
      text: args.map(stringifyArg).join(' '),
      timestamp: new Date()
    })
    
    if (logs.value.length > LOG_LIMIT) {
      logs.value.shift()
    }
  }
  
  function interceptConsole() {
    const levels: Array<ConsoleLog['level']> = ['log', 'info', 'warn', 'error', 'debug']
    
    for (const level of levels) {
      (console as any)[level] = (...args: unknown[]) => {
        addLog(level, args)
        originalConsole[level](...args)
      }
    }
  }
  
  function restoreConsole() {
    console.log = originalConsole.log
    console.info = originalConsole.info
    console.warn = originalConsole.warn
    console.error = originalConsole.error
    console.debug = originalConsole.debug
  }
  
  function clearLogs() {
    logs.value = []
  }
  
  function getFilteredLogs() {
    if (filterLevel.value === 'all') return logs.value
    return logs.value.filter(log => log.level === filterLevel.value)
  }
  
  interceptConsole()
  
  onUnmounted(() => {
    restoreConsole()
  })
  
  return {
    logs,
    filterLevel,
    clearLogs,
    getFilteredLogs
  }
}
