import { View } from 'react-native';
import { spacing, SpacingKey } from '../tokens/spacing';

interface SpacerProps {
  size?: SpacingKey | number;
  horizontal?: boolean;
}

export function Spacer({ size = 'md', horizontal = false }: SpacerProps) {
  const spaceValue = typeof size === 'number' ? size : spacing[size];

  return (
    <View
      style={{
        width: horizontal ? spaceValue : undefined,
        height: !horizontal ? spaceValue : undefined,
      }}
    />
  );
}
