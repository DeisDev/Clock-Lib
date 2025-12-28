# Clock-Lib

A fully customizable, feature-rich clock widget for Wallpaper Engine web wallpapers. Built with Vue 3 + TypeScript for modern development, with backwards-compatible vanilla JS support.

## Features

- 🕐 **Time Display**: 12/24-hour format, seconds, blinking separator, customizable separators
- 📅 **Date Display**: Multiple formats including custom patterns, day of week
- 📝 **Meta Info**: Week number, day of year, holiday countdown
- 🎨 **Styling**: Custom fonts (25+), colors, opacity, letter spacing, text gradients
- ✨ **Text Effects**: Gradient text, text outline with configurable width/color
- 🌑 **Shadows**: Configurable blur, distance, angle, opacity for both time and info text
- 🖼️ **Background**: Optional panel with blur, opacity, border radius, padding
- 🎬 **Animations**: Smooth transitions with configurable duration
- 📱 **Draggable**: Position anywhere on screen with persistence
- 🛠️ **Debug Panel**: Live property editor, console viewer, presets, export/import

## Quick Start

### Modern (Vue 3 + TypeScript)

```bash
npm install
npm run dev      # Development with hot reload
npm run build    # Production build to dist/
```

```ts
import { createClock } from './dist/clock.js';

const clock = createClock({
  parent: document.getElementById('root')!,
  debug: false
});

clock.start();

// Wallpaper Engine integration
window.wallpaperPropertyListener = {
  applyUserProperties(props) {
    clock.applyProperties(props);
  }
};
```

### Legacy (Vanilla JS)

The original `clock.js` and `clock.css` files remain available for backwards compatibility:

```html
<link rel="stylesheet" href="Clock-Lib/clock.css">
<script type="module">
  import { createClock } from './Clock-Lib/clock.js';
  const clock = createClock({ parent: document.body });
  clock.start();
</script>
```

## Project Structure

```
Clock-Lib/
├── src/
│   ├── components/          # Vue components
│   │   ├── ClockWidget.vue  # Main clock container
│   │   ├── ClockTime.vue    # Time display with gradient support
│   │   ├── ClockDate.vue    # Date display
│   │   ├── ClockMeta.vue    # Week, day number, holiday
│   │   ├── ClockApp.vue     # Production entry component
│   │   └── debug/           # Debug panel components
│   ├── composables/         # Vue composables
│   ├── stores/              # Pinia state management
│   ├── types/               # TypeScript definitions
│   ├── utils/               # Utility functions
│   ├── clock.ts             # Main library entry
│   └── main.ts              # Dev server entry
├── clock.js                 # Legacy vanilla JS (backwards compatible)
├── clock.css                # Legacy styles
├── clock-properties.json    # Wallpaper Engine properties
└── index.html               # Dev preview
```

## createClock Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `parent` | `HTMLElement` | `document.body` | Container element |
| `storageKey` | `string` | `'clockPosition'` | localStorage key for position |
| `tickMs` | `number` | `1000` | Update interval (ms) |
| `initialState` | `Partial<ClockState>` | `{}` | Override default state |
| `propertyKeys` | `ClockPropertyKeys` | `DEFAULT_KEYS` | Custom property mapping |
| `debug` | `boolean` | `false` | Enable debug panel |

## API

| Method | Description |
|--------|-------------|
| `start()` | Initialize and begin ticking |
| `applyProperties(props)` | Apply Wallpaper Engine properties |
| `setPosition(x, y)` | Set position (0–1 normalized) |
| `getState()` | Get current state snapshot |
| `dispose()` | Cleanup and remove |

## State Properties

### Time & Date
- `visible`, `timeFormat`, `showSeconds`, `separator`, `blinkSeparator`
- `showDate`, `dateFormat`, `customDateFormat`, `showDay`
- `ampmPosition` (inline/above/below for 12-hour mode)

### Meta Info
- `showWeek`, `showDayNumber`, `showHoliday`, `holidayFormat`, `disableIcons`

### Typography (Time)
- `fontIndex`, `fontWeight`, `fontSize`, `scale`, `color`, `letterSpacing`, `opacity`

### Typography (Info)
- `infoFontIndex`, `infoFontWeight`, `infoFontSize`, `infoScale`
- `infoFontStyle`, `infoTextTransform`

### Text Effects
- `textGradient`, `textGradientStart`, `textGradientEnd`, `textGradientAngle`
- `textOutline`, `textOutlineColor`, `textOutlineWidth`

### Shadows
- Clock: `shadow`, `shadowColor`, `shadowBlur`, `shadowDistance`, `shadowAngle`, `shadowOpacity`
- Info: `infoShadow`, `infoShadowColor`, `infoShadowBlur`, etc.

### Background
- `showBackground`, `backgroundColor`, `backgroundOpacity`
- `backgroundBlur`, `backgroundBorderRadius`, `backgroundPadding`

### Animation
- `animateChanges`, `animationDuration`

### Position
- `posX`, `posY`, `dragEnabled`

## Wallpaper Engine Integration

1. Merge `clock-properties.json` into your `project.json` under `general.properties`
2. Import and initialize the clock
3. Connect the property listener

Colors from Wallpaper Engine arrive as `"r g b"` (0–1 floats) and are automatically converted.

## Debug Panel

Open `index.html` in a browser for the development preview with debug panel:

- **Properties Tab**: Live editing of all clock properties with search/filter
- **Console Tab**: Captured console output with timestamps and levels
- **Presets Tab**: Save/load presets, export/import configurations
- **FPS Counter**: Performance monitoring

## Holidays

Built-in holidays include:
- Fixed dates: New Year, Valentine's, St. Patrick's, Independence Day, Halloween, Christmas
- Computed dates: Easter, Mother's Day, Father's Day, Thanksgiving

Countdown formats: `days`, `dhm`, `dh`, `w`, `h`, `m`, `s`, `date`

## Development

```bash
npm run dev       # Start dev server with hot reload
npm run build     # Build for production
npm run preview   # Preview production build
```

## License

MIT
