# Clock-Lib

Reusable clock widget for Wallpaper Engine web wallpapers.

## Files

| File | Purpose |
|------|---------|
| `clock.js` | ES module exporting `createClock()` factory and `CLOCK_PROPERTY_KEYS` map |
| `clock.css` | Styles for clock container, date/meta lines, and widget editor overlay |
| `clock-properties.json` | Wallpaper Engine property definitions (merge into your `project.json`) |

## Integration

```js
import { createClock, CLOCK_PROPERTY_KEYS } from './Clock-Lib/clock.js';

const clock = createClock({ parent: document.getElementById('root') });
clock.start();

window.wallpaperPropertyListener = {
  applyUserProperties(props) {
    clock.applyProperties(props);
  }
};
```

Link the stylesheet in `<head>`:
```html
<link rel="stylesheet" href="Clock-Lib/clock.css">
```

Merge `clock-properties.json` contents into your `project.json` under `general.properties`.

## createClock Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `parent` | Element | `document.body` | Container element for clock DOM |
| `storageKey` | string | `'clockPosition'` | localStorage key for persisting position |
| `tickMs` | number | `1000` | Update interval in milliseconds |
| `initialState` | object | `{}` | Override default state values |
| `propertyKeys` | object | `CLOCK_PROPERTY_KEYS` | Custom property key mapping |

## Public API

| Method | Description |
|--------|-------------|
| `start()` | Initialize clock, load saved position, begin ticking |
| `applyProperties(props)` | Apply Wallpaper Engine property object |
| `setPosition(x, y)` | Set position (0–1 normalized viewport coordinates) |
| `getState()` | Return shallow copy of current state |
| `dispose()` | Remove DOM elements and clear interval |
| `applyEditorVisibility(show)` | Show/hide the widget editor overlay |
| `toRgbString(hex)` | Convert `#rrggbb` to `"r g b"` (0–1 floats) |
| `toHexColor(rgb)` | Convert `"r g b"` to `#rrggbb` |

## State Properties

The clock maintains internal state for all visual options:

- **Time**: `visible`, `timeFormat` (12/24), `showSeconds`
- **Date**: `showDate`, `showDay`, `dateFormat` (words/ymd/mdy/dmy)
- **Meta**: `showWeek`, `showDayNumber`, `showHoliday`, `holidayFormat`, `disableIcons`
- **Typography (clock)**: `fontIndex`, `fontWeight`, `fontSize`, `scale`, `color`, `letterSpacing`, `opacity`
- **Typography (info)**: `infoFontIndex`, `infoFontStyle`, `infoFontWeight`, `infoFontSize`, `infoScale`, `infoTextTransform`
- **Shadow (clock)**: `shadow`, `shadowColor`, `shadowBlur`, `shadowDistance`, `shadowAngle`, `shadowOpacity`
- **Shadow (info)**: `infoShadow`, `infoShadowColor`, `infoShadowBlur`, `infoShadowDistance`, `infoShadowAngle`, `infoShadowOpacity`
- **Position**: `posX`, `posY`, `dragEnabled`

## CLOCK_PROPERTY_KEYS

Maps internal state to Wallpaper Engine property names:

```js
{
  show: 'showclock',
  timeFormat: 'clocktimeformat',
  showSeconds: 'clockshowseconds',
  showDate: 'clockshowdate',
  showDay: 'clockshowday',
  dateFormat: 'clockdateformat',
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
  showWeek: 'clockshowweek',
  showDayNumber: 'clockshowdaynumber',
  showHoliday: 'clockshowholiday',
  holidayFormat: 'clockholidayformat',
  disableIcons: 'clockdisableicons',
  editorVisible: 'showwidgeteditor'
}
```

## Preview / Debug Panel

- `preview.html` auto-loads `clock-properties.json` to generate controls, includes a Logs tab (captures `console.*`) and FPS readout, and respects persisted clock position.
- Dragging the clock itself is toggled in the widget editor (`Drag to Move`) and persists via `storageKey`. The debug panel header is always draggable in the preview.

## Holidays

Built-in holiday list includes fixed dates (Christmas, Halloween, etc.) and computed dates (Easter, Mother's Day, Thanksgiving). Holiday countdown formats: `days`, `dhm`, `dh`, `w`, `h`, `m`, `s`, `date`.

## Wallpaper Engine Notes

- Colors arrive as `"r g b"` (0–1 floats); the module converts automatically.
- The clock uses `setInterval` for updates; use `wallpaperRequestAnimationFrame` for your own animations.
- The widget editor is toggled via the `showwidgeteditor` property.
