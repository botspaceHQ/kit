// The design-system page loads React 18 as a global (window.React). React 18's UMD build has no
// jsx-runtime, so compiled JSX (ours and Base UI's) goes through createElement instead.
import * as React from "react"

type Props = Record<string, unknown>

export const Fragment = React.Fragment

export function jsx(type: React.ElementType, props: Props, key?: React.Key) {
  return React.createElement(type, key === undefined ? props : { ...props, key })
}

export const jsxs = jsx
export const jsxDEV = jsx
