import { useEffect } from "react";
import {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

import { MORPH_DURATION, MORPH_EASING, MORPH_SLIDE_DISTANCE } from "../morph/constants";
import type { UseMorphContentOptions } from "../morph/types";

/**
 * Drives a single content layer's enter/exit. Deliberately separate from
 * useMorphBox: this only touches opacity + transform (compositor-only
 * properties), so it never forces a native layout pass and can run in
 * parallel with the box resize without either blocking the other.
 */
function useMorphContent({
  active,
  direction = 0,
  duration = MORPH_DURATION - 80,
  easing = MORPH_EASING,
  slideDistance = MORPH_SLIDE_DISTANCE,
}: UseMorphContentOptions) {
  const progress = useSharedValue<number>(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration, easing });
  }, [active, duration, easing, progress]);

  const style = useAnimatedStyle(() => {
    const p = progress.value;
    const travel = direction === 0 ? 0 : direction * slideDistance;
    const translateX = active ? travel * (1 - p) : -travel * (1 - p);
    return {
      opacity: p,
      transform: [{ translateX }, { scale: withSpring(0.97 + 0.03 * p) }],
    };
  }, [active, direction, slideDistance]);

  return { progress, style };
}

export { useMorphContent };

