// import { useState } from "react";

// const colorScheme = useState()

export function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? 'light' : 'dark'
}