# expo-payment-reminder

A floating, draggable payment reminder pill that morphs directly into a full reminders list — no modals, no popovers, just the pill growing into the sheet it already is. Built for fintech apps.

<!-- TODO: hero gif -->
<img width="1280" height="720" alt="payment-reminder" src="PASTE_HERO_GIF_URL_HERE" />

---

## ✨ Features

- 💊 **Morph, not modal** — tapping the pill grows it directly into the reminders list using a headless `morph-box` primitive, instead of popping a `Modal` over the screen
- 🎯 **Position-synced morph box** — the pill and the expanded sheet share the same `translateX`/`translateY` shared values, so the sheet always grows out of exactly where the pill is sitting — even after you've dragged it somewhere else
- 🕹️ **Draggable pill** — pan anywhere on screen, disabled automatically while the sheet is open so the drag gesture never fights the morph
- 🔢 **Dual-speed `AnimatedCounter` reveals** — the pill's amount counts up in 300ms; each row's amount counts up in 600ms, landing in sync with that row's progress-bar fill
- 📅 **Looping day picker + worklet tick slider** — `DateScrollPicker` wraps at both ends, `VerticalTickSlider` snaps to nearest step with a spring settle, both driven entirely on the UI thread
- ⌨️ **Decoupled keypad sheet** — slide-in/out animation and mount state are handled as two independent effects, so a fast open → close → open never leaves the sheet in a half-animated state
- 🔒 **Race-safe confirm** — a ref-backed guard on "Remind me" blocks a double-tap from creating two reminders off a single confirm
- 🎛️ **Controlled or uncontrolled** — use `ReminderCreateSheet` with its own built-in trigger button, or drive it with your own `open` / `onClose`
- 🧠 **TypeScript-first** — `PillData`, `ReminderItem`, `Contact` typed consistently across every component boundary

---

## ⚙️ Installation

This isn't published as an npm package yet — copy the source directly into your project.

```bash
git clone https://github.com/ManasCodeXart/expo-payment-reminder
```

Copy `src/components/`, `src/constants/`, `src/hooks/`, `src/morph/`, and `src/utils/` into your project, then install the peer dependencies:

> `PaymentReminder`'s default `contacts` load demo avatars from `assets/images/` at module load — copy that folder too, or those `require()` paths will throw. Swap in your own `contacts` and drop the demo assets before shipping (see ⚠️ Demo Data).

```bash
npx expo install react-native-reanimated react-native-worklets react-native-gesture-handler react-native-svg expo-haptics
```

> Reanimated 4.x ships its worklets runtime as the separate `react-native-worklets` package — it's required alongside `react-native-reanimated`, not optional.

> Requires `react-native-reanimated`'s Babel plugin. `PaymentReminder` wraps itself in its own `GestureHandlerRootView`, so none is needed at your app root for this component. Used standalone, `ReminderPill`, `VerticalTickSlider`, and `DateScrollPicker` each need their own `GestureHandlerRootView` — `ReminderCreateSheet` already wraps itself in one (inside its `Modal`).

---

## 🚀 Usage

```tsx
import { useCallback, useState } from 'react';
import PaymentReminder from './components/PaymentReminder';
import type { Contact, ReminderItem } from './constants/types';

const CONTACTS: Contact[] = [
  { id: '1', avatar: require('./assets/images/avatar.png'), handle: 'ProyaX' },
  { id: '2', avatar: require('./assets/images/boy.png'), handle: 'RahultDev' },
  { id: '3', avatar: require('./assets/images/manas.png'), handle: 'ManasCodeX' },
];

export function ReminderScreen() {
  const [reminders, setReminders] = useState<ReminderItem[]>([]);

  // Called with the fully-built ReminderItem (id + progress included) — persist it here.
  const handleCreate = useCallback((reminder: ReminderItem) => {
    saveReminder(reminder);                      // e.g. POST /reminders
    setReminders((prev) => [reminder, ...prev]); // keep local state in sync
  }, []);

  return (
    <PaymentReminder
      contacts={CONTACTS}
      initialIndex={1}
      initialReminders={reminders}   // seed with reminders already saved
      onReminderCreate={handleCreate}
    />
  );
}
```

### Using the pieces individually

`PaymentReminder` is a thin orchestrator over `ReminderMorphSheet` + `ReminderCreateSheet` — you can own the state yourself if you need more control:

```tsx
import { useCallback, useState } from 'react';
import ReminderCreateSheet from './components/ReminderCreateSheet';
import ReminderMorphSheet from './components/ReminderMorphSheet';
import type { PillData, ReminderItem } from './constants/types';

export function CustomReminderFlow() {
  const [open, setOpen] = useState(false);
  const [pill, setPill] = useState<PillData | null>(null);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);

  const handlePillCreate = useCallback((pillData: PillData) => {
    setPill(pillData);
    setReminders((prev) => [{ ...pillData, id: Date.now().toString(), progress: 1 }, ...prev]);
  }, []);

  return (
    <>
      <ReminderMorphSheet pill={pill} reminders={reminders} />
      <ReminderCreateSheet
        contacts={CONTACTS}
        open={open}
        onClose={() => setOpen(false)}
        onPillCreate={handlePillCreate}
      />
    </>
  );
}
```

## Preview

<!-- TODO: preview video -->
PASTE_PREVIEW_VIDEO_URL_HERE

---

## 🧱 Component Anatomy

```
<PaymentReminder>
  ├─ ReminderMorphSheet        (owns the pill's live position, drives the morph)
  │    ├─ ReminderPill         (draggable pill — avatar, amount, circular countdown)
  │    │    └─ CircularProgress
  │    └─ morph-box primitive  (MorphContentLayer / MorphMeasureLayer)
  └─ ReminderCreateSheet       (modal — contact, date, amount, month)
       ├─ AvatarCarousel       (contact selection)
       ├─ DateScrollPicker     (looping day picker)
       ├─ VerticalTickSlider   (month picker)
       └─ AmountKeypadSheet
            └─ Keypad
```

`AnimatedCounter` is used internally wherever an amount is displayed (the pill, each reminder row, and the amount input) and is also exported individually. `CircularProgress`, `Keypad`, `AvatarCarousel`, `DateScrollPicker`, and `VerticalTickSlider` are all self-contained and usable outside this component — see the API tables below.

---

## 🧩 API

### `<PaymentReminder>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `contacts` | `readonly Contact[]` | 9 built-in demo contacts | Contacts available in the create sheet's avatar carousel. The built-in list uses placeholder demo images — replace with your own before shipping. |
| `initialIndex` | `number` | `3` | Index centered in the avatar carousel on open. |
| `initialReminders` | `readonly ReminderItem[]` | `[]` | Reminders already saved, rendered in the morph sheet. Copied into the component's local state (never mutated in place). Seeds state **once on mount** — it isn't re-read on later prop changes. If you load reminders asynchronously, wait for that data before mounting `PaymentReminder`, or force a remount with a `key` (e.g. `key={userId}`) once it arrives. |
| `onReminderCreate` | `(reminder: ReminderItem) => void` | — | Called with the fully-built `ReminderItem` (id + progress already computed) right after a new reminder is created — persist it here. |

### `<ReminderCreateSheet>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `contacts` | `readonly Contact[]` | — | Contacts shown in the avatar carousel. |
| `buttonLabel` | `string` | `'Set Reminder'` | Label for the built-in trigger button. Hidden entirely when `open` is provided. |
| `initialIndex` | `number` | `0` | Index centered in the avatar carousel when the sheet opens. |
| `onPillCreate` | `(pill: PillData) => void` | — | Called once "Remind me" is confirmed, right as the exit animation completes. |
| `open` | `boolean` | — | Optional. Switches the sheet to controlled mode. |
| `onClose` | `() => void` | — | Called on backdrop tap, hardware back, or after a successful confirm — in both controlled and uncontrolled modes. |

### `<ReminderMorphSheet>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `pill` | `PillData \| null` | — | The active pill. Pass `null` before the first reminder is created — the sheet renders nothing. |
| `reminders` | `readonly ReminderItem[]` | — | Full list rendered inside the sheet once the pill is tapped open. |

### `<ReminderPill>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `PillData` | — | — |
| `onPress` | `() => void` | — | — |
| `translateX` | `SharedValue<number>` | internal fallback | Share this with `ReminderMorphSheet` so the morph box tracks the pill's live position, drag included. |
| `translateY` | `SharedValue<number>` | internal fallback | Same as `translateX`. |
| `draggable` | `boolean` | `true` | Set `false` while morphed open so the pan gesture doesn't fight the expanded sheet. |

### `<AmountKeypadSheet>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `visible` | `boolean` | — | — |
| `amount` | `string` | — | Current amount string, e.g. `'42.50'`. |
| `onAmountChange` | `(amount: string) => void` | — | — |
| `decimalSeparator` | `string` | `'.'` | — |
| `hapticsEnabled` | `boolean` | `true` | — |

### `<Keypad>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `onKeyPress` | `(key: string) => void` | — | Receives `'0'`–`'9'`, the decimal separator, or `'delete'`. |
| `decimalSeparator` | `string` | `'.'` | — |
| `hapticsEnabled` | `boolean` | `true` | — |
| `disabled` | `boolean` | `false` | — |
| `containerStyle` / `keyStyle` / `keyTextStyle` | `StyleProp<...>` | — | — |

### `<AvatarCarousel>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `contacts` | `readonly Contact[]` | — | — |
| `initialIndex` | `number` | `3` | Clamped internally if `contacts.length` is smaller. |
| `onContactChange` | `(contact: Contact) => void` | — | Fires on scroll snap (momentum end). |
| `height` | `number` | `120` | — |

### `<DateScrollPicker>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `min` | `number` | `1` | — |
| `max` | `number` | `31` | — |
| `value` | `number` | — | — |
| `width` | `number` | `48` | — |
| `onValueChange` | `(value: number) => void` | — | Loops at both ends — reaching past `max` wraps to `min`, and vice versa. |

### `<VerticalTickSlider>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — | — |
| `onValueChange` | `(value: number) => void` | — | — |
| `min` | `number` | `1` | — |
| `max` | `number` | `31` | — |
| `step` | `number` | `1` | — |
| `activeColor` | `string` | `'rgba(255,255,255,0.85)'` | — |
| `inactiveColor` | `string` | `'rgba(255,255,255,0.2)'` | — |
| `thumbColor` | `string` | `'#ffffff75'` | — |
| `width` | `number` | `32` | — |
| `height` | `number` | auto (fits tick count) | — |

> `AvatarCarousel`'s `height` and `DateScrollPicker`/`VerticalTickSlider`'s `width` defaults are `verticalScale()`-scaled from a 375×812 design — the table lists the 812pt values.

### `<CircularProgress>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number` | — | — |
| `width` | `number` | — | Stroke width. |
| `fill` | `number` | — | `0`–`100`, clamped internally. |
| `tintColor` | `string` | `'#FFFFFF'` | — |
| `backgroundColor` | `string` | — | Optional track ring behind the fill. |
| `rotation` | `number` | `0` | Extra rotation on top of the built-in `-90°` offset (so `fill: 0` starts at 12 o'clock). |
| `lineCap` | `'butt' \| 'round' \| 'square'` | `'round'` | — |
| `duration` | `number` | `500` | — |
| `style` | `StyleProp<ViewStyle>` | — | Applied to the ring's outer container. |
| `children` | `ReactNode` | — | Rendered centered inside the ring. |

### `<AnimatedCounter>`

| Prop | Type | Description |
|---|---|---|
| `value` | `number` | — |
| `prefix` | `string` | — |
| `suffix` | `string` | — |
| `duration` | `number` | — |
| `delay` | `number` | — |
| `decimals` | `number` | — |
| `style` | `StyleProp<TextStyle>` | — |

### Types

```ts
interface Contact {
  readonly id: string;
  readonly avatar: ImageSourcePropType;
  readonly handle: string;
}

interface PillData {
  readonly contact: Contact;
  readonly amount: string;
  readonly dateLabel: string;
  readonly countdownLabel: string;
  readonly daysRemaining: number;
}

interface ReminderItem extends PillData {
  readonly id: string;
  readonly progress: number;
}
```

---

## ⚠️ Demo Data

`PaymentReminder` is fully presentational — it never talks to a backend. The default `contacts` list is a demo fallback (`avatar.png`, `boy.png`, `manas.png`, etc.) that exists purely to make the component runnable out of the box; `initialReminders` defaults to an empty list. Before shipping:

- Pass your own `contacts` (loaded from your users / backend).
- Seed `initialReminders` with reminders already saved for that user.
- Persist new reminders via `onReminderCreate` — the callback fires with the fully-built `ReminderItem`, so id/progress computation stays in the component and you only write it to your data store.

---

## 🔤 Fonts

Text elements use the **Space Grotesk** family (`SpaceGroteskMedium`, `SpaceGroteskSemiBold`, `SpaceGroteskBold`) by name. If you don't load these yourself via `expo-font` / `useFonts`, React Native falls back to the system font silently — everything still works, you'll just get system-font weights instead of Space Grotesk. Load the family under those exact names if you want the intended look.

---

## 📄 License

MIT — see [LICENSE](./LICENSE).

---

## 🧱 Stack

[Expo SDK 57](https://expo.dev/changelog) · [React Native 0.86.2](https://reactnative.dev/) · [Reanimated 4.5.1](https://docs.swmansion.com/react-native-reanimated/) · [React Native Worklets 0.10.1](https://docs.swmansion.com/react-native-reanimated/) · [Gesture Handler 2.32.0](https://docs.swmansion.com/react-native-gesture-handler/) · [React Native SVG 15.15.4](https://github.com/software-mansion/react-native-svg) · Expo Haptics