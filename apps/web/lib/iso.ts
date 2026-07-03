/**
 * Pure isometric grid → screen projection. No React, no side effects.
 *
 * Backend grid (verified in Step 0): 40×40 cells, world tileSize 16, movement
 * clamped to [2, 36]. GRID_SIZE below mirrors that grid dimension so the
 * office floor always matches the real playfield. TILE_W / TILE_H / ORIGIN_*
 * are independent SCREEN-space constants (pixels per grid step in the 2:1
 * isometric diamond) — they don't need to match the backend's world units,
 * only to place a 40×40 grid nicely inside our office frame.
 *
 * A3 will feed live Colyseus (gx, gy) straight into isoProject() — this file
 * has zero knowledge of mock vs. live data.
 */

export const GRID_SIZE = 40;

// Screen-space projection constants. Chosen so the 40×40 grid's diamond
// footprint (see isoProject(0,0) / (40,0) / (40,40) / (0,40)) lands at
// x:[40,600] y:[60,380] inside a 640×420 viewBox — the same frame A1's
// placeholder used.
export const TILE_W = 14;
export const TILE_H = 8;
export const ORIGIN_X = 320;
export const ORIGIN_Y = 60;

export type GridCoord = { gx: number; gy: number };
export type ScreenPoint = { x: number; y: number };

export type IsoProjectOptions = {
  tileW?: number;
  tileH?: number;
  originX?: number;
  originY?: number;
};

export function isoProject(gx: number, gy: number, opts: IsoProjectOptions = {}): ScreenPoint {
  const tileW = opts.tileW ?? TILE_W;
  const tileH = opts.tileH ?? TILE_H;
  const originX = opts.originX ?? ORIGIN_X;
  const originY = opts.originY ?? ORIGIN_Y;
  return {
    x: (gx - gy) * (tileW / 2) + originX,
    y: (gx + gy) * (tileH / 2) + originY,
  };
}

/** Paint-order depth: higher = further down-right = should render on top. */
export function isoZIndex(gx: number, gy: number): number {
  return gx + gy;
}

// Sanity checks (defaults, grid 40×40, spawns from Step 0) — KISS, no test
// runner wired up for apps/web yet, so these are worked examples, not code:
//
//   isoProject(10, 10)            -> { x: 320, y: 140 }   (alice)
//   isoProject(20, 15)            -> { x: 355, y: 200 }   (bob)
//   isoZIndex(10, 10) = 20 < isoZIndex(20, 15) = 35        (bob paints over alice)
//   isoProject(0, 0)/(40,0)/(40,40)/(0,40) -> the four floor-diamond corners
//     (320,60) (600,220) (320,380) (40,220)
