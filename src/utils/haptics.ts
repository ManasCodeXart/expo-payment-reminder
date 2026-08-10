type HapticTrigger = () => Promise<void> | void;

/**
 * Runs a haptics call and silently ignores failures. Haptics APIs can throw
 * synchronously (unsupported hardware) or reject asynchronously (simulators,
 * web) — either way, a missed buzz should never crash the app.
 */
export function fireHaptic(trigger: HapticTrigger): void {
  try {
    const result = trigger();
    if (result instanceof Promise) {
      result.catch(() => {});
    }
  } catch {
    // Haptics not supported on this device — ignore.
  }
}