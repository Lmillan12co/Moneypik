// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation
  "house.fill": "home",
  "person.fill": "person",
  "bell.fill": "notifications",
  "gearshape.fill": "settings",
  "magnifyingglass": "search",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "xmark": "close",
  "xmark.circle.fill": "cancel",
  // Monetization
  "heart.fill": "favorite",
  "heart": "favorite-border",
  "dollarsign.circle.fill": "monetization-on",
  "wallet.pass.fill": "account-balance-wallet",
  "arrow.up.right.circle": "arrow-upward",
  "arrow.down.circle": "arrow-downward",
  "creditcard.fill": "credit-card",
  "banknote.fill": "payments",
  // Content
  "plus.circle.fill": "add-circle",
  "photo.fill": "photo",
  "video.fill": "videocam",
  "camera.fill": "camera-alt",
  "square.grid.2x2.fill": "grid-view",
  "list.bullet": "list",
  // User
  "star.fill": "star",
  "checkmark.circle.fill": "check-circle",
  "exclamationmark.circle.fill": "error",
  "info.circle.fill": "info",
  "lock.fill": "lock",
  "eye.fill": "visibility",
  "eye.slash.fill": "visibility-off",
  "trash.fill": "delete",
  "pencil": "edit",
  "square.and.arrow.up": "share",
  "arrow.right.circle.fill": "arrow-forward",
  "checkmark.seal.fill": "verified",
  "clock.fill": "history",
  "trophy.fill": "emoji-events",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
