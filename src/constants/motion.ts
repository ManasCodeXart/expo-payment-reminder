// constants/motion.ts
import { Easing } from 'react-native-reanimated';

// dampingRatio: 1 = critically damped — snaps to rest with zero overshoot.
// duration is your only "speed" knob now; lower = snappier.
export const ENTRANCE_SPRING = { duration: 280, dampingRatio: 1 };

export const EASE_OUT_EXPO = Easing.bezier(0.16, 1, 0.3, 1);