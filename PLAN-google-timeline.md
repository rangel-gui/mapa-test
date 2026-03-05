# Plan: Import Google Timeline

## Context
Users accumulate years of location history in Google Takeout. Importing it into the fog-of-war map would instantly reveal everywhere they've ever been, making it a high-value feature. Currently the app only adds points via live GPS or the DEV simulator. No file import mechanism exists.

## Google Timeline Formats (both supported)

### Records.json — raw GPS pings
```json
{ "locations": [
  { "latitudeE7": 414216106, "longitudeE7": 21684775, "timestamp": "2022-01-12T..." },
  ...
]}
```
Coordinates are integers × 10^7. Can be very large (100k–1M+ entries for years of history).

### Semantic Location History — monthly files (post-2023 Takeout)
```json
{ "timelineObjects": [
  { "placeVisit": { "location": { "latitudeE7": ..., "longitudeE7": ... } } },
  { "activitySegment": { "waypointPath": { "points": [{ "latE7": ..., "lngE7": ... }] } } },
  ...
]}
```

## Files to Create / Modify

| File | Action |
|------|--------|
| `src/utils/parseGoogleTimeline.ts` | **Create** — parser + thinning |
| `src/hooks/useExploredPoints.ts` | **Modify** — add `bulkAddPoints` |
| `src/components/ImportButton.tsx` | **Create** — file picker UI |
| `src/App.tsx` | **Modify** — wire ImportButton into MapView children |

## Implementation

### 1. `src/utils/parseGoogleTimeline.ts`

```ts
export function parseGoogleTimeline(raw: unknown): Point[]
```

**Detection logic:**
- If `raw.locations` exists → Records.json format
- If `raw.timelineObjects` exists → Semantic format

**Records.json extraction:**
```ts
record.latitudeE7 / 1e7, record.longitudeE7 / 1e7
```
Sort by `record.timestamp` (ISO string, lexicographic sort works).

**Semantic extraction — two sources:**
- `placeVisit.location.latitudeE7 / 1e7`
- `activitySegment.waypointPath.points[].latE7 / 1e7` (field is `latE7`/`lngE7`)

**Thinning (critical for performance):**
After collecting all points, run a sequential distance filter:
- Keep a point only if `haversineDistance(lastKept, candidate) >= IMPORT_MIN_DISTANCE_M`
- `IMPORT_MIN_DISTANCE_M = 30` (looser than live GPS's 10m — import data is historical)
- Reuse existing `haversineDistance` from `src/utils/distance.ts`

Returns `Point[]` (deduplicated, thinned).

---

### 2. `src/hooks/useExploredPoints.ts`

Add `bulkAddPoints(incoming: Point[]): number`:
- Takes the already-thinned array from the parser
- **Merge behavior** (user preference): appends to existing explored points
- Concatenates existing + incoming, re-runs sequential 30m thin on combined array
- Returns count of newly added points (via ref to capture from inside setState)

```ts
const bulkAddPoints = useCallback((incoming: Point[]): number => {
  let added = 0;
  setPoints((prev) => {
    const combined = [...prev, ...incoming];
    const thinned = thinPoints(combined, IMPORT_MIN_DISTANCE_M);
    added = thinned.length - prev.length;
    savePoints(thinned);
    return thinned;
  });
  return added;
}, []);
```

---

### 3. `src/components/ImportButton.tsx`

State machine: `idle | parsing | done | error`

```tsx
export function ImportButton({ onImport }: { onImport: (points: Point[]) => number })
```

UI:
- Hidden `<input type="file" accept=".json" />` triggered by button click
- Button label: "Import timeline" / "Parsing..." / "X pts added" (3s, then idle) / "Invalid file"
- Position: `absolute top-4 left-4 z-[2000]` (left side, no conflict with reset/sim buttons on right)
- Same styling as Reset button

Parsing flow:
```
FileReader.readAsText → JSON.parse → parseGoogleTimeline → onImport → show count
```
try/catch on entire flow → `error` state on any failure.

---

### 4. `src/App.tsx`

```tsx
const { points, addPoint, clearPoints, bulkAddPoints } = useExploredPoints();

<MapView ...>
  <ImportButton onImport={bulkAddPoints} />
  {import.meta.env.DEV && <SimPanel ... />}
</MapView>
```

`ImportButton` always visible (production feature, not DEV-only).

---

## Verification

1. `npm run dev` — app loads without errors
2. Click "Import timeline", select a Records.json or monthly Semantic file
3. Button shows "X pts added" and fog clears over imported locations
4. Refresh — imported points persist (localStorage)
5. Test both formats
6. Test invalid JSON → shows "Invalid file"
