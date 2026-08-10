import type { ImageSourcePropType, StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

// ─── Domain ───────────────────────────────────────────────────────────────────

/** A person a reminder can be set for. */
export interface Contact {
  readonly id: string;
  readonly avatar: ImageSourcePropType;
  readonly handle: string;
}

/**
 * The data collected when a reminder is created, before it's assigned an id
 * and added to the reminders list.
 */
export interface PillData {
  readonly contact: Contact;
  readonly amount: string;
  readonly dateLabel: string;
  readonly countdownLabel: string;
  /**
   * Whole days between today and the due date. Single source of truth for
   * both the countdown display and progress calculations — never re-derive
   * this by parsing `countdownLabel`.
   */
  readonly daysRemaining: number;
}

/** A saved reminder, as shown in the reminders list. */
export interface ReminderItem extends PillData {
  readonly id: string;
  
  /** 0–1, how much time remains until the due date. Derived from `daysRemaining`. */
  readonly progress: number;
}

// ─── ReminderSheet ────────────────────────────────────────────────────────────

export interface ReminderSheetProps {
  readonly visible: boolean;
  readonly reminders: readonly ReminderItem[];
  readonly onClose: () => void;
}

// ─── AvatarCarousel ───────────────────────────────────────────────────────────

export interface AvatarCarouselProps {
  readonly contacts: readonly Contact[];
  readonly initialIndex?: number;
  readonly onContactChange: (contact: Contact) => void;
  readonly height?: number;
}

// ─── Keypad ───────────────────────────────────────────────────────────────────

export interface KeypadProps {
  readonly onKeyPress: (key: string) => void;
  readonly decimalSeparator?: string;
  readonly hapticsEnabled?: boolean;
  readonly disabled?: boolean;
  readonly containerStyle?: StyleProp<ViewStyle>;
  readonly keyStyle?: StyleProp<ViewStyle>;
  readonly keyTextStyle?: StyleProp<TextStyle>;
}

// ─── DateScrollPicker ───────────────────────────────────────────────────────────

export interface DateScrollPickerProps {
  readonly min?: number;
  readonly max?: number;
  readonly value: number;
  /** Width of the picker's visible column. */
  readonly width?: number;
  readonly onValueChange: (value: number) => void;
}

// ─── VerticalTickSlider ─────────────────────────────────────────────────────────

export interface VerticalTickSliderProps {
  readonly value: number;
  readonly onValueChange: (value: number) => void;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly activeColor?: string;
  readonly inactiveColor?: string;
  readonly thumbColor?: string;
  /** Width of the container (the narrow dimension — the track itself renders vertically). */
  readonly width?: number;
  /** Height of the track. Defaults to a length that fits every tick comfortably. */
  readonly height?: number;
}


// ─── ReminderPill ───────────────────────────────────────────────────────────

export interface ReminderPillProps {
  readonly data: PillData;
  readonly onPress: () => void;
  /** External control of the pill's screen position (e.g. a morph sheet tracking it). */
  readonly translateX?: SharedValue<number>;
  readonly translateY?: SharedValue<number>;
  /** Disables the pan-to-drag gesture. Defaults to true. */
  readonly draggable?: boolean;
}

// ─── AmountKeypadSheet ──────────────────────────────────────────────────────

export interface AmountKeypadSheetProps {
  readonly visible: boolean;
  readonly amount: string;
  readonly onAmountChange: (amount: string) => void;
  readonly decimalSeparator?: string;
  readonly hapticsEnabled?: boolean;
}

// ─── ReminderCreateSheet ────────────────────────────────────────────────────

// ─── ReminderCreateSheet ────────────────────────────────────────────────────

export interface ReminderCreateSheetProps {
  readonly contacts: readonly Contact[];
  readonly buttonLabel?: string;
  readonly initialIndex?: number;
  readonly onPillCreate: (pill: PillData) => void;
  readonly open?: boolean;       // controlled open — omit to use built-in trigger button
  readonly onClose?: () => void; // called when sheet dismisses itself
}

export type AnimatedCounterProps = Readonly<{
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  delay?: number
  decimals?: number
  style?: StyleProp<TextStyle>
}>