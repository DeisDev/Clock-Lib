# Clock-Lib
Reusable clock widget for Wallpaper Engine web wallpapers. Includes DOM, styling, property handling, and editor drag helpers.

## Files
- `clock.js` — module exporting `createClock` and `CLOCK_PROPERTY_KEYS`.
- `clock.css` — styles for clock and widget editor.
- `clock-properties.json` — property definitions to merge into `project.json`.

## Quick integration (new wallpaper)
1. Copy the `Clock-Lib` folder into your project root.
2. In `<head>` add: `<link rel="stylesheet" href="Clock-Lib/clock.css">`.
3. In your main script:
   ```js
   import { createClock, CLOCK_PROPERTY_KEYS } from './Clock-Lib/clock.js';
   const clock = createClock();
   clock.start();
   // inside wallpaperPropertyListener.applyUserProperties
   clock.applyProperties(props);
   ```
4. Paste the contents of `Clock-Lib/clock-properties.json.properties` into `project.json.general.properties` (adjust `order` if needed).
5. Keep `wallpaperPropertyListener` defined at global scope so Wallpaper Engine can deliver property updates.

## Customization
- Initial state: pass overrides to `createClock({ initialState: { fontSize: 56, scale: 1.2 } })`.
- Storage key: `createClock({ storageKey: 'myClockPos' })` if you need a different localStorage entry.
- Parent node: `createClock({ parent: document.body })` can target another container if desired.
- Property keys: use `CLOCK_PROPERTY_KEYS` or supply your own mapping via `propertyKeys`.

## Runtime helpers
- `clock.applyProperties(props)` — call from `applyUserProperties` to sync user settings.
- `clock.setPosition(x, y)` — programmatically move (0–1 normalized viewport coords).
- `clock.getState()` — snapshot of current state.
- `clock.dispose()` — remove DOM and timers if you hot-reload.

## Wallpaper Engine notes
- Use `window.wallpaperRequestAnimationFrame` if you add custom animation loops; the clock itself uses `setInterval` for 1s ticks.
- Color properties from Wallpaper Engine are normalized `"r g b"`; the module converts them to CSS automatically.
- Ensure your `project.json` continues to expose the properties so users can configure the clock.
