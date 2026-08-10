import { Easing, type EasingFunctionFactory } from "react-native-reanimated";

/**
 * Every piece of the morph (box resize, content fade/slide, any open-state
 * indicator) should share this duration + easing. That shared clock is most
 * of why the effect reads as one coherent motion instead of several
 * animations that happen to overlap.
 */
export const MORPH_DURATION: number = 600;

/** Decelerate-only curve, no bounce/overshoot. Fast start, soft settle. */
export const MORPH_EASING: EasingFunctionFactory = Easing.bezier(
  0.22,
  1,
  0.36,
  1,
);

/** Default horizontal travel (px) for the content enter/exit slide. */
export const MORPH_SLIDE_DISTANCE: number = 65;

/** Pass this (or null) as activeKey to collapse the box. */
export const MORPH_COLLAPSED: string = "collapsed";