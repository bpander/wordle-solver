import { css } from 'glamor';
import { CSSProperties } from 'react';

import { fromEntries } from 'lib/fromEntries';

export type StylePart = string | CSSProperties | Record<string, CSSProperties>;

export const createStyle = (...rules: Array<StylePart>) => {
  return rules.map(rule => typeof rule === 'string' ? rule : String(css(rule))).join(' ');
};

export const createStyles = <T extends Record<string, StylePart | Array<StylePart>>>(ruleMap: T) => {
  return fromEntries(Object.entries(ruleMap).map(([k, v]) => {
    return [k, Array.isArray(v) ? createStyle(...v) : createStyle(v)];
  })) as { [K in keyof T]: string };
};
