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
        backgroundColor: 'rgba(220,220,220,0.6)',
        borderRadius: 8,
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
