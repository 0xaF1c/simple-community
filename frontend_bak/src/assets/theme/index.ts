import { ThemeOptions } from "@material-ui/core";
import light from './light.json'
import dark from './dark.json'

export const themeOption = (type: 'light' | 'dark'): ThemeOptions => {
  if (type === 'light') {
    return light as any
  } else if (type === 'dark') {
    return dark as any
  } else {
    return {}
  }
}