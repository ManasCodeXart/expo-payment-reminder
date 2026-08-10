import type { ReactNode } from "react";
import type { EasingFunctionFactory } from "react-native-reanimated";

/** Measured pixel size of a single morph target. */
export interface MorphSize {
  w: number;
  h: number;
}

/** key -> measured size, populated by MorphMeasureLayer / onMeasure callbacks. */
export type MorphSizeMap = Record<string, MorphSize>;

/**
 * "stack"   -> the collapsed element stays visible and expanded content is
 *              added on top of it (box height = collapsedSize.h + target.h).
 *              Use this when there's a persistent header/pill/toolbar that
 *              should remain in view while the box grows.
 * "replace" -> the box becomes exactly the target content's own size.
 *              Use this when the expanded state fully replaces the
 *              collapsed one (e.g. summary card -> detail card).
 */
export type MorphMode = "stack" | "replace";

export interface MorphKeyedRenderItem {
  key: string;
  render: () => ReactNode;
}

export interface UseMorphBoxOptions {
  /** Which target to morph into. Pass null (or the collapsed sentinel) to collapse. */
  activeKey: string | null;
  /** Pre-measured sizes for every possible expanded target, keyed by activeKey. */
  sizes: MorphSizeMap;
  /** Measured size of the collapsed/base element. */
  collapsedSize: MorphSize;
  mode?: MorphMode;
  /** Absolute floor for box width, e.g. a dynamically-growing collapsed width. */
  minWidth?: number;
  duration?: number;
  easing?: EasingFunctionFactory;
}

export interface UseMorphContentOptions {
  active: boolean;
  /** -1 / 1 to bias the enter/exit slide when swapping between two expanded targets, 0 for a plain fade. */
  direction?: -1 | 0 | 1;
  duration?: number;
  easing?: EasingFunctionFactory;
  slideDistance?: number;
}