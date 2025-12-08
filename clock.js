// Minimal reusable clock module for Wallpaper Engine web wallpapers.
export const CLOCK_PROPERTY_KEYS = {
  show: 'showclock',
  timeFormat: 'clocktimeformat',
  showDate: 'clockshowdate',
  showDay: 'clockshowday',
  font: 'clockfont',
  fontSize: 'clockfontsize',
  scale: 'clockscale',
  color: 'clockcolor',
  shadow: 'clockshadow',
  shadowColor: 'clockshadowcolor',
  shadowBlur: 'clockshadowblur',
  editorVisible: 'showwidgeteditor'
};

const CLOCK_FONTS = [
  { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap', stack: "'Inter', 'Segoe UI', system-ui, sans-serif" },
  { href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600&display=swap', stack: "'Space Grotesk', 'Segoe UI', system-ui, sans-serif" },
  { href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600&display=swap', stack: "'DM Sans', 'Segoe UI', system-ui, sans-serif" },
  { href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;600&display=swap', stack: "'Roboto Mono', 'SFMono-Regular', monospace" }
];

const DEFAULT_STATE = {
  visible: true,
  fontIndex: 0,
  color: '1 1 1',
  shadow: true,
  shadowColor: '0 0 0',
  shadowBlur: 12,
  fontSize: 48,
  scale: 1,
  timeFormat: 24,
  showDate: true,
  showDay: true,
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

function hexToRgbString(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)}`;
}

function ensureFontLoaded(index, loadedFontLinks) {
  const font = CLOCK_FONTS[index] || CLOCK_FONTS[0];
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

function buildClockDom(parent) {
  const clockContainer = document.createElement('div');
  clockContainer.id = 'clock-container';
  clockContainer.setAttribute('aria-live', 'polite');

  const clockTimeEl = document.createElement('div');
  clockTimeEl.id = 'clock-time';

  const clockDateEl = document.createElement('div');
  clockDateEl.id = 'clock-date';

  clockContainer.appendChild(clockTimeEl);
  clockContainer.appendChild(clockDateEl);

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

  return { clockContainer, clockTimeEl, clockDateEl, widgetEditor };
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
  const { clockContainer, clockTimeEl, clockDateEl, widgetEditor } = buildClockDom(parent);
  let dragState = { active: false, startX: 0, startY: 0, baseX: 0.5, baseY: 0.5 };
  let editorDragState = { active: false, startX: 0, startY: 0, offsetX: 0, offsetY: 0 };
  let editorVisible = false;
  let intervalId = null;

  function applyClockStyles() {
    clockContainer.style.display = state.visible ? 'block' : 'none';
    if (!state.visible) return;

    const fontStack = ensureFontLoaded(state.fontIndex, loadedFontLinks);
    const color = colorToCss(state.color);
    const shadowColor = colorToCss(state.shadowColor);
    clockContainer.style.left = `${(state.posX * 100).toFixed(3)}%`;
    clockContainer.style.top = `${(state.posY * 100).toFixed(3)}%`;
    clockContainer.style.transform = `translate(-50%, -50%) scale(${state.scale})`;
    clockContainer.style.color = color;
    clockContainer.style.fontFamily = fontStack;
    clockTimeEl.style.fontSize = `${state.fontSize}px`;
    clockDateEl.style.fontSize = `${Math.max(12, Math.round(state.fontSize * 0.38))}px`;
    clockContainer.classList.toggle('drag-enabled', !!state.dragEnabled);
    const shadowOffset = state.shadowBlur === 0 ? 2 : 4;
    const shadow = state.shadow ? `0 ${shadowOffset}px ${state.shadowBlur}px ${shadowColor}` : 'none';
    clockContainer.style.textShadow = shadow;
  }

  function formatTime(date) {
    const hours = date.getHours();
    if (state.timeFormat === 12) {
      const h = hours % 12 || 12;
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const suffix = hours >= 12 ? 'PM' : 'AM';
      return `${h}:${minutes} ${suffix}`;
    }
    const h24 = hours.toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${h24}:${minutes}`;
  }

  function formatDateLine(date) {
    const parts = [];
    if (state.showDay) parts.push(date.toLocaleDateString(undefined, { weekday: 'long' }));
    if (state.showDate) parts.push(date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }));
    return parts.join(' · ');
  }

  function updateClock() {
    const now = new Date();
    clockTimeEl.textContent = formatTime(now);
    const dateLine = formatDateLine(now);
    clockDateEl.textContent = dateLine;
    clockDateEl.style.display = dateLine ? 'block' : 'none';
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
    if (props[propertyKeys.font] !== undefined) state.fontIndex = Number(props[propertyKeys.font].value);
    if (props[propertyKeys.fontSize] !== undefined) state.fontSize = Number(props[propertyKeys.fontSize].value);
    if (props[propertyKeys.scale] !== undefined) state.scale = Number(props[propertyKeys.scale].value);
    if (props[propertyKeys.color] !== undefined) state.color = props[propertyKeys.color].value;
    if (props[propertyKeys.shadow] !== undefined) state.shadow = !!props[propertyKeys.shadow].value;
    if (props[propertyKeys.shadowColor] !== undefined) state.shadowColor = props[propertyKeys.shadowColor].value;
    if (props[propertyKeys.shadowBlur] !== undefined) state.shadowBlur = Number(props[propertyKeys.shadowBlur].value);
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
