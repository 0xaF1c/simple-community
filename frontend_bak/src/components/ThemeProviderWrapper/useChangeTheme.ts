import { useContext } from "react";
import { ThemeProviderWrapperContext } from "./ThemeProviderWrapper";

export function useChangeTheme() {
  return useContext(ThemeProviderWrapperContext)
}