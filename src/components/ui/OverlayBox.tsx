import Box, { BoxProps } from './Box';

export type OverlayBoxProps = {
  hide?: boolean;
} & BoxProps;

export default function OverlayBox({
  hide,
  style,
  padding,
  ...props
}: OverlayBoxProps) {
  return (
    <Box
      style={{
        display: hide ? 'none' : 'flex',
        position: 'absolute',
        backgroundColor: 'rgba(178,178,178,0.6)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 10,
        ...style,
      }}
      padding={padding || 0}
      {...props}
    />
  );
}
