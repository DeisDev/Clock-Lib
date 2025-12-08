// Minimal reusable clock module for Wallpaper Engine web wallpapers.
export const CLOCK_PROPERTY_KEYS = {
  show: 'showclock',
  timeFormat: 'clocktimeformat',
  showDate: 'clockshowdate',
  showDay: 'clockshowday',
  showSeconds: 'clockshowseconds',
  font: 'clockfont',
  fontWeight: 'clockfontweight',
  fontSize: 'clockfontsize',
  scale: 'clockscale',
  color: 'clockcolor',
  letterSpacing: 'clockletterspacing',
  opacity: 'clockopacity',
  shadow: 'clockshadow',
  shadowColor: 'clockshadowcolor',
  shadowBlur: 'clockshadowblur',
  shadowDistance: 'clockshadowdistance',
  shadowAngle: 'clockshadowangle',
  shadowOpacity: 'clockshadowopacity',
  infoFont: 'clockinfofont',
  infoFontStyle: 'clockinfofontstyle',
  infoFontWeight: 'clockinfofontweight',
  infoFontSize: 'clockinfofontsize',
  infoScale: 'clockinfoscale',
  infoTextTransform: 'clockinfotexttransform',
  infoShadow: 'clockinfoshadow',
  infoShadowColor: 'clockinfoshadowcolor',
  infoShadowBlur: 'clockinfoshadowblur',
  infoShadowDistance: 'clockinfoshadowdistance',
  infoShadowAngle: 'clockinfoshadowangle',
  infoShadowOpacity: 'clockinfoshadowopacity',
  dateFormat: 'clockdateformat',
  showWeek: 'clockshowweek',
  showDayNumber: 'clockshowdaynumber',
  showHoliday: 'clockshowholiday',
  holidayFormat: 'clockholidayformat',
  disableIcons: 'clockdisableicons',
  editorVisible: 'showwidgeteditor'
};

const CLOCK_FONTS = [
  { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', stack: "'Inter', 'Segoe UI', system-ui, sans-serif" },
  { href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap', stack: "'Space Grotesk', 'Segoe UI', system-ui, sans-serif" },
  { href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap', stack: "'DM Sans', 'Segoe UI', system-ui, sans-serif" },
  { href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600;700&display=swap', stack: "'Roboto Mono', 'SFMono-Regular', monospace" },
  { href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap', stack: "'Manrope', 'Segoe UI', system-ui, sans-serif" },
  { href: 'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap', stack: "'Sora', 'Segoe UI', system-ui, sans-serif" },
  { href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap', stack: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif" },
  { href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap', stack: "'Poppins', 'Segoe UI', system-ui, sans-serif" },
  { href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap', stack: "'Outfit', 'Segoe UI', system-ui, sans-serif" },
  { href: 'https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700&display=swap', stack: "'Urbanist', 'Segoe UI', system-ui, sans-serif" },
  { href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap', stack: "'Orbitron', 'Segoe UI', system-ui, sans-serif" },
  { href: 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap', stack: "'Raleway', 'Segoe UI', system-ui, sans-serif" },
  { stack: "Arial, Helvetica, sans-serif" },
  { stack: "Verdana, Geneva, sans-serif" },
  { stack: "Tahoma, Geneva, sans-serif" },
  { stack: "'Trebuchet MS', Helvetica, sans-serif" },
  { stack: "Georgia, 'Times New Roman', serif" },
  { stack: "'Times New Roman', Times, serif" },
  { stack: "'Courier New', Courier, monospace" },
  { stack: "Impact, Charcoal, sans-serif" },
  { stack: "'Comic Sans MS', cursive, sans-serif" }
];

const HOLIDAYS = [
  { name: 'New Year', month: 1, day: 1, emoji: '🎉', greeting: 'Happy New Year!' },
{ name: "Valentine's Day", month: 2, day: 14, emoji: '❤️', greeting: "Happy Valentine's Day!" },
{ name: "International Women's Day", month: 3, day: 8, emoji: '🌷', greeting: "Happy Women's Day!" },
{ name: "April Fools' Day", month: 4, day: 1, emoji: '🤡', greeting: "Happy April Fools'!" },
  { name: 'Earth Day', month: 4, day: 22, emoji: '🌍', greeting: 'Happy Earth Day!' },
  { name: 'Labor Day', month: 5, day: 1, emoji: '🛠️', greeting: 'Happy Labor Day!' },
{ name: "Mother's Day", calc: (year) => nthWeekdayOfMonth(year, 4, 0, 2), emoji: '💐', greeting: "Happy Mother's Day!" },
{ name: "Father's Day", calc: (year) => nthWeekdayOfMonth(year, 5, 0, 3), emoji: '👔', greeting: "Happy Father's Day!" },
  { name: 'Easter', calc: (year) => computeEaster(year), emoji: '🐣', greeting: 'Happy Easter!' },
  { name: 'Halloween', month: 10, day: 31, emoji: '🎃', greeting: 'Happy Halloween!' },
  { name: 'Singles Day', month: 11, day: 11, emoji: '🛍️', greeting: 'Happy Singles Day!' },
  { name: 'Thanksgiving (US)', calc: (year) => nthWeekdayOfMonth(year, 10, 4, 4), emoji: '🦃', greeting: 'Happy Thanksgiving!' },
  { name: 'Black Friday', calc: (year) => addDays(nthWeekdayOfMonth(year, 10, 4, 4), 1), emoji: '🛍️', greeting: 'Happy Black Friday!' },
  { name: 'Christmas', month: 12, day: 25, emoji: '🎄', greeting: 'Merry Christmas!' }
];

const DEFAULT_STATE = {
  visible: true,
  fontIndex: 0,
  color: '1 1 1',
  letterSpacing: 0,
  opacity: 1,
  shadow: true,
  shadowColor: '0 0 0',
  shadowBlur: 12,
  shadowDistance: 4,
  shadowAngle: 135,
  shadowOpacity: 0.7,
  fontSize: 48,
  fontWeight: 500,
  scale: 1,
  infoFontIndex: 0,
  infoFontStyle: 'normal',
  infoFontWeight: 500,
  infoFontSize: 16,
  infoScale: 1,
  infoTextTransform: 'none',
  infoShadow: true,
  infoShadowColor: '0 0 0',
  infoShadowBlur: 8,
  infoShadowDistance: 2,
  infoShadowAngle: 135,
  infoShadowOpacity: 0.7,
  timeFormat: 24,
  showSeconds: false,
  showDate: true,
  showDay: true,
  dateFormat: 'words',
  showWeek: false,
  showDayNumber: false,
  showHoliday: false,
  holidayFormat: 'days',
  disableIcons: false,
  posX: 0.5,
  posY: 0.5,
  dragEnabled: false
};

function colorToCss(rgbString) {
  if (typeof rgbString !== 'string') return 'rgb(255,255,255)';
  const parts = rgbString.trim().split(/\s+/).map(Number);
  const [r, g, b] = parts.length >= 3 ? parts : [1, 1, 1];
  const to255 = v => Math.round(Math.max(0, Math.min(1, Number.isFinite(v) ? v : 1)) * 255);
  return `rgb(${to255(r)}, ${to255(g)}, ${to255(b)})`;
}

function colorToCssWithAlpha(rgbString, alpha = 1) {
  if (typeof rgbString !== 'string') return `rgba(255,255,255,${alpha})`;
  const parts = rgbString.trim().split(/\s+/).map(Number);
  const [r, g, b] = parts.length >= 3 ? parts : [1, 1, 1];
  const clampAlpha = Math.max(0, Math.min(1, Number(alpha) || 0));
  const to255 = v => Math.round(Math.max(0, Math.min(1, Number.isFinite(v) ? v : 1)) * 255);
  return `rgba(${to255(r)}, ${to255(g)}, ${to255(b)}, ${clampAlpha})`;
}

function hexToRgbString(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)}`;
}

function ensureFontLoaded(index, loadedFontLinks) {
  const font = CLOCK_FONTS[index] || CLOCK_FONTS[0];
  if (!font.href) return font.stack;
  if (loadedFontLinks.has(font.href)) return font.stack;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = font.href;
  document.head.appendChild(link);
  loadedFontLinks.add(font.href);
  return font.stack;
}

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

function getIsoWeek(date) {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (tmp.getUTCDay() + 6) % 7;
  tmp.setUTCDate(tmp.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 4));
  const diff = tmp - firstThursday;
  return 1 + Math.round(diff / 604800000);
}

function nthWeekdayOfMonth(year, monthIndex, weekdayIndex, occurrence) {
  const first = new Date(year, monthIndex, 1);
  const firstDay = first.getDay();
  const delta = (weekdayIndex - firstDay + 7) % 7;
  const day = 1 + delta + (occurrence - 1) * 7;
  return new Date(year, monthIndex, day);
}

function computeEaster(year) {
  // Meeus/Jones/Butcher Gregorian algorithm
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-based
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / 86400000);
}

function daysDiff(from, to) {
  const ms = to - from;
  return Math.floor(ms / 86400000);
}

function formatDhm(ms) {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  return { days, hours, minutes };
}

function buildClockDom(parent) {
  const clockContainer = document.createElement('div');
  clockContainer.id = 'clock-container';
  clockContainer.setAttribute('aria-live', 'polite');

  const clockTimeEl = document.createElement('div');
  clockTimeEl.id = 'clock-time';

  const clockDateEl = document.createElement('div');
  clockDateEl.id = 'clock-date';

  const clockMetaEl = document.createElement('div');
  clockMetaEl.id = 'clock-meta';
  const metaWeekEl = document.createElement('div');
  metaWeekEl.className = 'clock-meta-line';
  const metaDayNumberEl = document.createElement('div');
  metaDayNumberEl.className = 'clock-meta-line';
  const metaHolidayEl = document.createElement('div');
  metaHolidayEl.className = 'clock-meta-line';

  clockMetaEl.appendChild(metaWeekEl);
  clockMetaEl.appendChild(metaDayNumberEl);
  clockMetaEl.appendChild(metaHolidayEl);

  clockContainer.appendChild(clockTimeEl);
  clockContainer.appendChild(clockDateEl);
  clockContainer.appendChild(clockMetaEl);

  const widgetEditor = document.createElement('div');
  widgetEditor.id = 'widget-editor';
  widgetEditor.innerHTML = `
    <div class="editor-header">
      <div class="editor-title">Widget Editor</div>
    </div>
    <div class="editor-tabs">
      <button class="editor-tab active" data-tab="clock">Clock</button>
    </div>
    <div class="editor-content">
      <div class="editor-section active" data-section="clock">
        <div class="setting-group">
          <label class="setting-label">Drag to Move</label>
          <div class="setting-row">
            <label style="flex: 1; display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" id="clock-drag" class="setting-checkbox">
              <span>Enable dragging to reposition clock</span>
            </label>
          </div>
        </div>
        <div class="setting-group">
          <label class="setting-label">Quick Alignment</label>
          <div class="setting-row">
            <button type="button" class="setting-button" id="btn-center-h">Center Horizontal</button>
            <button type="button" class="setting-button" id="btn-center-v">Center Vertical</button>
          </div>
        </div>
      </div>
    </div>
  `;

  parent.appendChild(clockContainer);
  parent.appendChild(widgetEditor);

  return { clockContainer, clockTimeEl, clockDateEl, clockMetaEl, metaWeekEl, metaDayNumberEl, metaHolidayEl, widgetEditor };
}

export function createClock({
  parent = document.body,
  propertyKeys = CLOCK_PROPERTY_KEYS,
  storageKey = 'clockPosition',
  tickMs = 1000,
  initialState = {}
} = {}) {
  const state = { ...DEFAULT_STATE, ...initialState };
  const loadedFontLinks = new Set();
  const { clockContainer, clockTimeEl, clockDateEl, clockMetaEl, metaWeekEl, metaDayNumberEl, metaHolidayEl, widgetEditor } = buildClockDom(parent);
  let dragState = { active: false, startX: 0, startY: 0, baseX: 0.5, baseY: 0.5 };
  let editorDragState = { active: false, startX: 0, startY: 0, offsetX: 0, offsetY: 0 };
  let editorVisible = false;
  let intervalId = null;

  function applyClockStyles() {
    clockContainer.style.display = state.visible ? 'block' : 'none';
    if (!state.visible) return;

    const fontStack = ensureFontLoaded(state.fontIndex, loadedFontLinks);
    const infoFontStack = ensureFontLoaded(state.infoFontIndex, loadedFontLinks);
    const color = colorToCss(state.color);
    const shadowColor = colorToCssWithAlpha(state.shadowColor, state.shadowOpacity);
    const infoShadowColor = colorToCssWithAlpha(state.infoShadowColor, state.infoShadowOpacity);
    clockContainer.style.left = `${(state.posX * 100).toFixed(3)}%`;
    clockContainer.style.top = `${(state.posY * 100).toFixed(3)}%`;
    clockContainer.style.transform = `translate(-50%, -50%) scale(${state.scale})`;
    clockContainer.style.color = color;
    clockContainer.style.fontFamily = fontStack;
    clockContainer.style.fontWeight = state.fontWeight;
    clockTimeEl.style.fontWeight = state.fontWeight;
    clockContainer.style.opacity = state.opacity;
    clockTimeEl.style.fontSize = `${state.fontSize}px`;
    clockTimeEl.style.letterSpacing = `${state.letterSpacing}px`;
    const infoSize = state.infoFontSize * state.infoScale;
    clockDateEl.style.fontSize = `${infoSize}px`;
    clockDateEl.style.fontFamily = infoFontStack;
    clockDateEl.style.fontWeight = state.infoFontWeight;
    clockDateEl.style.fontStyle = state.infoFontStyle;
    clockMetaEl.style.fontSize = `${infoSize}px`;
    clockMetaEl.style.fontFamily = infoFontStack;
    clockMetaEl.style.fontWeight = state.infoFontWeight;
    clockMetaEl.style.fontStyle = state.infoFontStyle;
    clockDateEl.style.textTransform = state.infoTextTransform;
    clockMetaEl.style.textTransform = state.infoTextTransform;
    clockContainer.classList.toggle('drag-enabled', !!state.dragEnabled);
    
    // Clock shadow with distance/angle
    if (state.shadow) {
      const angleRad = (state.shadowAngle * Math.PI) / 180;
      const offsetX = Math.cos(angleRad) * state.shadowDistance;
      const offsetY = Math.sin(angleRad) * state.shadowDistance;
      clockTimeEl.style.textShadow = `${offsetX}px ${offsetY}px ${state.shadowBlur}px ${shadowColor}`;
    } else {
      clockTimeEl.style.textShadow = 'none';
    }

    // Info shadow with distance/angle
    if (state.infoShadow) {
      const angleRad = (state.infoShadowAngle * Math.PI) / 180;
      const offsetX = Math.cos(angleRad) * state.infoShadowDistance;
      const offsetY = Math.sin(angleRad) * state.infoShadowDistance;
      const infoShadow = `${offsetX}px ${offsetY}px ${state.infoShadowBlur}px ${infoShadowColor}`;
      clockDateEl.style.textShadow = infoShadow;
      clockMetaEl.style.textShadow = infoShadow;
    } else {
      clockDateEl.style.textShadow = 'none';
      clockMetaEl.style.textShadow = 'none';
    }
  }

  function formatTimeParts(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = state.showSeconds ? `:${date.getSeconds().toString().padStart(2, '0')}` : '';
    if (state.timeFormat === 12) {
      const h = hours % 12 || 12;
      const suffix = hours >= 12 ? 'PM' : 'AM';
      return { main: `${h}:${minutes}${seconds}`, suffix };
    }
    const h24 = hours.toString().padStart(2, '0');
    return { main: `${h24}:${minutes}${seconds}`, suffix: '' };
  }

  function formatDateValue(date) {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    switch (state.dateFormat) {
      case 'ymd':
        return `${y}-${m}-${d}`;
      case 'mdy':
        return `${m}/${d}/${y}`;
      case 'dmy':
        return `${d}/${m}/${y}`;
      default:
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
  }

  function formatDateLine(date) {
    const parts = [];
    if (state.showDay) parts.push(date.toLocaleDateString(undefined, { weekday: 'long' }));
    if (state.showDate) parts.push(formatDateValue(date));
    return parts.join(' · ');
  }

  function updateClock() {
    const now = new Date();
    const timeParts = formatTimeParts(now);
    if (timeParts.suffix) {
      clockTimeEl.innerHTML = `<span class="clock-time-wrap">${timeParts.main}<span class="clock-ampm">${timeParts.suffix}</span></span>`;
    } else {
      clockTimeEl.textContent = timeParts.main;
    }
    const dateLine = formatDateLine(now);
    clockDateEl.textContent = dateLine;
    clockDateEl.style.display = dateLine ? 'block' : 'none';
    updateMeta(now);
  }
  function nextHoliday(now) {
    const year = now.getFullYear();
    let closest = null;
    for (const h of HOLIDAYS) {
      let target = getHolidayDate(h, year);
      if (target < now) {
        target = getHolidayDate(h, year + 1);
      }
      if (!closest || target < closest.date) closest = { ...h, date: target };
    }
    return closest;
  }

  function getHolidayDate(holiday, year) {
    if (holiday.calc) return holiday.calc(year);
    return new Date(year, holiday.month - 1, holiday.day);
  }

  function formatHolidayLine(now) {
    const holiday = nextHoliday(now);
    if (!holiday) return '';
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(holiday.date.getFullYear(), holiday.date.getMonth(), holiday.date.getDate());
    const isToday = target.getTime() === today.getTime();
    const emoji = state.disableIcons ? '' : `${holiday.emoji || ''} `;
    if (isToday) {
      return `${emoji}${holiday.greeting}`.trim();
    }
    const diffMs = holiday.date - now;
    const totalMinutes = Math.max(0, Math.floor(diffMs / 60000));
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const totalHours = Math.max(0, Math.floor(diffMs / 3600000));
    const totalWeeks = Math.max(0, Math.floor(diffMs / 604800000));
    if (state.holidayFormat === 'dhm') {
      const { days, hours, minutes } = formatDhm(diffMs);
      return `${emoji}${days}d ${hours}h ${minutes}m to ${holiday.name}`.trim();
    }
    if (state.holidayFormat === 'date') {
      const dateStr = target.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      return `${emoji}${holiday.name} · ${dateStr}`.trim();
    }
    if (state.holidayFormat === 'dh') {
      const { days, hours } = formatDhm(diffMs);
      return `${emoji}${days} d ${hours} h to ${holiday.name}`.trim();
    }
    if (state.holidayFormat === 'h') {
      return `${emoji}${totalHours} h to ${holiday.name}`.trim();
    }
    if (state.holidayFormat === 'm') {
      return `${emoji}${totalMinutes} min to ${holiday.name}`.trim();
    }
    if (state.holidayFormat === 's') {
      return `${emoji}${totalSeconds} sec to ${holiday.name}`.trim();
    }
    if (state.holidayFormat === 'w') {
      return `${emoji}${totalWeeks} weeks to ${holiday.name}`.trim();
    }
    const daysLeft = daysDiff(today, target);
    return `${emoji}${daysLeft} days to ${holiday.name}`.trim();
  }

  function updateMeta(now) {
    const dayNum = getDayOfYear(now);
    if (state.showWeek) {
      metaWeekEl.style.display = 'block';
      const week = getIsoWeek(now);
      metaWeekEl.textContent = state.showDayNumber ? `Week ${week} · Day ${dayNum}` : `Week ${week}`;
    } else {
      metaWeekEl.style.display = 'none';
    }

    if (state.showDayNumber && !state.showWeek) {
      metaDayNumberEl.style.display = 'block';
      metaDayNumberEl.textContent = `Day ${dayNum}`;
    } else {
      metaDayNumberEl.style.display = 'none';
    }

    if (state.showHoliday) {
      metaHolidayEl.style.display = 'block';
      metaHolidayEl.textContent = formatHolidayLine(now);
    } else {
      metaHolidayEl.style.display = 'none';
    }

    clockMetaEl.style.display = (state.showWeek || state.showDayNumber || state.showHoliday) ? 'block' : 'none';
  }

  function setClockPosition(px, py) {
    state.posX = clamp01(px);
    state.posY = clamp01(py);
    applyClockStyles();
  }

  function saveClockSettings() {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        posX: state.posX,
        posY: state.posY,
        dragEnabled: state.dragEnabled
      }));
    } catch (e) {
      console.warn('Failed to save clock position:', e);
    }
  }

  function loadClockSettings() {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.posX !== undefined) state.posX = parsed.posX;
        if (parsed.posY !== undefined) state.posY = parsed.posY;
        if (parsed.dragEnabled !== undefined) state.dragEnabled = parsed.dragEnabled;
      }
    } catch (e) {
      console.warn('Failed to load clock position:', e);
    }
  }

  function syncEditorToState() {
    const dragCheckbox = widgetEditor.querySelector('#clock-drag');
    if (dragCheckbox) dragCheckbox.checked = state.dragEnabled;
  }

  function handlePointerDown(e) {
    if (!state.dragEnabled) return;
    dragState = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      baseX: state.posX,
      baseY: state.posY
    };
    clockContainer.classList.add('dragging');
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  }

  function handlePointerMove(e) {
    if (!dragState.active) return;
    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    const relX = dx / window.innerWidth;
    const relY = dy / window.innerHeight;
    setClockPosition(dragState.baseX + relX, dragState.baseY + relY);
  }

  function handlePointerUp() {
    if (!dragState.active) return;
    dragState.active = false;
    clockContainer.classList.remove('dragging');
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('pointercancel', handlePointerUp);
    saveClockSettings();
  }

  function centerHorizontally() {
    setClockPosition(0.5, state.posY);
  }

  function centerVertically() {
    setClockPosition(state.posX, 0.5);
  }

  function handleEditorDragStart(e) {
    const editorHeader = widgetEditor.querySelector('.editor-header');
    if (!editorHeader || (e.target !== editorHeader && !editorHeader.contains(e.target))) return;
    editorDragState = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: widgetEditor.offsetLeft,
      offsetY: widgetEditor.offsetTop
    };
    widgetEditor.classList.add('dragging-editor');
    e.preventDefault();
  }

  function handleEditorDragMove(e) {
    if (!editorDragState.active) return;
    const dx = e.clientX - editorDragState.startX;
    const dy = e.clientY - editorDragState.startY;
    widgetEditor.style.left = `${editorDragState.offsetX + dx}px`;
    widgetEditor.style.top = `${editorDragState.offsetY + dy}px`;
    widgetEditor.style.transform = 'none';
  }

  function handleEditorDragEnd() {
    if (!editorDragState.active) return;
    editorDragState.active = false;
    widgetEditor.classList.remove('dragging-editor');
  }

  function setupEditorListeners() {
    const dragCheckbox = widgetEditor.querySelector('#clock-drag');
    const btnCenterH = widgetEditor.querySelector('#btn-center-h');
    const btnCenterV = widgetEditor.querySelector('#btn-center-v');

    if (dragCheckbox) {
      dragCheckbox.addEventListener('change', e => {
        state.dragEnabled = e.target.checked;
        applyClockStyles();
        saveClockSettings();
      });
    }

    if (btnCenterH) {
      btnCenterH.addEventListener('click', () => {
        centerHorizontally();
        saveClockSettings();
      });
    }

    if (btnCenterV) {
      btnCenterV.addEventListener('click', () => {
        centerVertically();
        saveClockSettings();
      });
    }

    widgetEditor.addEventListener('pointerdown', handleEditorDragStart);
    window.addEventListener('pointermove', handleEditorDragMove);
    window.addEventListener('pointerup', handleEditorDragEnd);
    window.addEventListener('pointercancel', handleEditorDragEnd);
  }

  function showEditor(show) {
    if (show === editorVisible) return;
    editorVisible = show;
    widgetEditor.style.display = show ? 'flex' : 'none';
    if (show) syncEditorToState();
  }

  function applyProperties(props = {}) {
    if (props[propertyKeys.show] !== undefined) state.visible = !!props[propertyKeys.show].value;
    if (props[propertyKeys.timeFormat] !== undefined) state.timeFormat = Number(props[propertyKeys.timeFormat].value);
    if (props[propertyKeys.showDate] !== undefined) state.showDate = !!props[propertyKeys.showDate].value;
    if (props[propertyKeys.showDay] !== undefined) state.showDay = !!props[propertyKeys.showDay].value;
    if (props[propertyKeys.showSeconds] !== undefined) state.showSeconds = !!props[propertyKeys.showSeconds].value;
    if (props[propertyKeys.font] !== undefined) state.fontIndex = Number(props[propertyKeys.font].value);
    if (props[propertyKeys.fontWeight] !== undefined) state.fontWeight = Number(props[propertyKeys.fontWeight].value);
    if (props[propertyKeys.fontSize] !== undefined) state.fontSize = Number(props[propertyKeys.fontSize].value);
    if (props[propertyKeys.scale] !== undefined) state.scale = Number(props[propertyKeys.scale].value);
    if (props[propertyKeys.color] !== undefined) state.color = props[propertyKeys.color].value;
    if (props[propertyKeys.letterSpacing] !== undefined) state.letterSpacing = Number(props[propertyKeys.letterSpacing].value);
    if (props[propertyKeys.opacity] !== undefined) state.opacity = Number(props[propertyKeys.opacity].value);
    if (props[propertyKeys.shadow] !== undefined) state.shadow = !!props[propertyKeys.shadow].value;
    if (props[propertyKeys.shadowColor] !== undefined) state.shadowColor = props[propertyKeys.shadowColor].value;
    if (props[propertyKeys.shadowBlur] !== undefined) state.shadowBlur = Number(props[propertyKeys.shadowBlur].value);
    if (props[propertyKeys.shadowDistance] !== undefined) state.shadowDistance = Number(props[propertyKeys.shadowDistance].value);
    if (props[propertyKeys.shadowAngle] !== undefined) state.shadowAngle = Number(props[propertyKeys.shadowAngle].value);
    if (props[propertyKeys.shadowOpacity] !== undefined) state.shadowOpacity = Number(props[propertyKeys.shadowOpacity].value);
    if (props[propertyKeys.infoFont] !== undefined) state.infoFontIndex = Number(props[propertyKeys.infoFont].value);
    if (props[propertyKeys.infoFontStyle] !== undefined) state.infoFontStyle = props[propertyKeys.infoFontStyle].value;
    if (props[propertyKeys.infoFontWeight] !== undefined) state.infoFontWeight = Number(props[propertyKeys.infoFontWeight].value);
    if (props[propertyKeys.infoFontSize] !== undefined) state.infoFontSize = Number(props[propertyKeys.infoFontSize].value);
    if (props[propertyKeys.infoScale] !== undefined) state.infoScale = Number(props[propertyKeys.infoScale].value);
    if (props[propertyKeys.infoTextTransform] !== undefined) state.infoTextTransform = props[propertyKeys.infoTextTransform].value;
    if (props[propertyKeys.infoShadow] !== undefined) state.infoShadow = !!props[propertyKeys.infoShadow].value;
    if (props[propertyKeys.infoShadowColor] !== undefined) state.infoShadowColor = props[propertyKeys.infoShadowColor].value;
    if (props[propertyKeys.infoShadowBlur] !== undefined) state.infoShadowBlur = Number(props[propertyKeys.infoShadowBlur].value);
    if (props[propertyKeys.infoShadowDistance] !== undefined) state.infoShadowDistance = Number(props[propertyKeys.infoShadowDistance].value);
    if (props[propertyKeys.infoShadowAngle] !== undefined) state.infoShadowAngle = Number(props[propertyKeys.infoShadowAngle].value);
    if (props[propertyKeys.infoShadowOpacity] !== undefined) state.infoShadowOpacity = Number(props[propertyKeys.infoShadowOpacity].value);
    if (props[propertyKeys.dateFormat] !== undefined) state.dateFormat = props[propertyKeys.dateFormat].value;
    if (props[propertyKeys.showWeek] !== undefined) state.showWeek = !!props[propertyKeys.showWeek].value;
    if (props[propertyKeys.showDayNumber] !== undefined) state.showDayNumber = !!props[propertyKeys.showDayNumber].value;
    if (props[propertyKeys.showHoliday] !== undefined) state.showHoliday = !!props[propertyKeys.showHoliday].value;
    if (props[propertyKeys.holidayFormat] !== undefined) state.holidayFormat = props[propertyKeys.holidayFormat].value;
    if (props[propertyKeys.disableIcons] !== undefined) state.disableIcons = !!props[propertyKeys.disableIcons].value;
    if (props[propertyKeys.editorVisible] !== undefined) showEditor(!!props[propertyKeys.editorVisible].value);
    applyClockStyles();
    updateClock();
  }

  function start() {
    loadClockSettings();
    applyClockStyles();
    updateClock();
    if (!intervalId) intervalId = setInterval(updateClock, tickMs);
    clockContainer.addEventListener('pointerdown', handlePointerDown);
    setupEditorListeners();
    syncEditorToState();
  }

  function dispose() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    clockContainer.remove();
    widgetEditor.remove();
  }

  // Public API
  return {
    applyProperties,
    start,
    dispose,
    setPosition: setClockPosition,
    getState: () => ({ ...state }),
    applyEditorVisibility: showEditor,
    toHexColor: rgb => rgb ? `#${rgb.trim().split(/\s+/).map(v => Math.round(Math.max(0, Math.min(1, Number(v))) * 255).toString(16).padStart(2, '0')).join('')}` : '#ffffff',
    toRgbString: hexToRgbString
  };
}
