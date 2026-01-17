// design-system/utils/alpha.ts

/**
 * Apply alpha transparency to a hex color
 * @param color - Hex color string (e.g., '#3B82F6')
 * @param opacity - Opacity value between 0 and 1
 * @returns RGBA color string
 */
export function alpha(color: string, opacity: number): string {
  // Remove # if present
  const hex = color.replace('#', '');

  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Clamp opacity between 0 and 1
  const clampedOpacity = Math.max(0, Math.min(1, opacity));

  return `rgba(${r}, ${g}, ${b}, ${clampedOpacity})`;
}
