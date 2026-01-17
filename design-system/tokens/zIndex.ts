// design-system/tokens/zIndex.ts

/**
 * Z-index scale for layering
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500,
} as const;

export type ZIndexKey = keyof typeof zIndex;
