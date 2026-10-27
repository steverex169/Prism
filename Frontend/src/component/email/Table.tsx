import * as React from 'react';

/** Email-safe presentation table. Children must be <tr> rows. */
export function Table({
  children,
  width = '100%',
  style,
  bgcolor,
  className,
}: {
  children: React.ReactNode;
  width?: string | number;
  style?: React.CSSProperties;
  bgcolor?: string;
  className?: string;
}) {
  const extra: Record<string, string> = bgcolor ? { bgcolor } : {};
  return (
    <table
      role="presentation"
      width={width}
      cellPadding={0}
      cellSpacing={0}
      border={0}
      className={className}
      style={{ borderCollapse: 'collapse', ...(bgcolor ? { backgroundColor: bgcolor } : {}), ...style }}
      {...extra}
    >
      <tbody>{children}</tbody>
    </table>
  );
}

/** A single full-width row with one cell — the building block of every section. */
export function Row({
  children,
  style,
  className,
  align,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  align?: 'left' | 'center' | 'right';
}) {
  return (
    <tr>
      <td className={className} align={align} style={style}>
        {children}
      </td>
    </tr>
  );
}

export const NBSP = ' ';

/** Fixed-height vertical gap. */
export function Spacer({ height = 36 }: { height?: number }) {
  return (
    <tr>
      <td style={{ height, lineHeight: `${height}px`, fontSize: 0 }}>{NBSP}</td>
    </tr>
  );
}
