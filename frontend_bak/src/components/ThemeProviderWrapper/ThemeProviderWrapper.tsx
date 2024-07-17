import {
  ThemeOptions,
  ThemeProvider,
  createTheme,
} from '@material-ui/core'
import {
  ReactElement,
  createContext,
  useEffect,
  useCallback,
  useState,
} from 'react'
import * as locales from '@material-ui/core/locale'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../../store'
import {
  setDarkMode as setStorageDarkMode,
  setAutoDarkMode as setStorageAutoDarkMode,
  setLanguage,
} from '../../store/modules/storagedCommon'
import { getSystemTheme } from '../../utils/getSystemTheme'
import { themeOption } from '../../assets/theme'

type ISupportedLocales = keyof typeof locales
interface IThemeProviderWrapperProps {
  children: ReactElement[] | ReactElement
}

interface ThemeProviderWrapperContext {
  changeTheme(theme: ThemeOptions): void
  changeLocale(locale: string | ISupportedLocales): void
  assignTheme(theme: ThemeOptions): void
  getCurrentLocale(): ISupportedLocales
  toggleDarkMode(bool?: boolean): void
  toggleAutoDarkMode(bool?: boolean): void
}

function injectError(): any {
  console.log('pls call this function in provider')
}

export const ThemeProviderWrapperContext =
  createContext<ThemeProviderWrapperContext>({
    changeTheme: injectError,
    assignTheme: injectError,
    changeLocale: injectError,
    getCurrentLocale: injectError,
    toggleDarkMode: injectError,
    toggleAutoDarkMode: injectError,
  })
  
const getTheme = (type: 'light' | 'dark') => {
  return createTheme(themeOption(type))
}

export function ThemeProviderWrapper({
  children,
}: IThemeProviderWrapperProps) {
  const dispatch = useAppDispatch()
  const { i18n } = useTranslation()

  const autoDarkMode = useAppSelector(
    (state) => state.storage.common.autoDarkMode,
  )
  const setAutoDarkMode = (mode: boolean) =>
    dispatch(setStorageAutoDarkMode(mode))

  const darkMode = useAppSelector(
    (state) => state.storage.common.darkMode,
  )
  const setDarkMode = (mode: boolean) =>
    dispatch(setStorageDarkMode(mode))

  const locale = useAppSelector(
    (state) => state.storage.common.language,
  ) as ISupportedLocales

  const defaultTheme = (): ThemeOptions => {
    if (autoDarkMode) {
      return getTheme(getSystemTheme())
    } else {
      return getTheme(!darkMode ? 'dark' : 'light')
    }
  }
  
  const [themeOption, setThemeOption] = useState<ThemeOptions>(defaultTheme())
  const [theme, setTheme] = useState(
    createTheme(themeOption, locales[locale]),
  )

  const changeTheme = (_theme: ThemeOptions) => {
    setThemeOption(_theme)

    document.documentElement.style.setProperty(
      'color-scheme',
      _theme.palette?.type ?? 'light',
    )
  }
  const changeLanguage = (locale: ISupportedLocales) => {
    if (!locales[locale]) return

    i18n.changeLanguage(locale)
    dispatch(setLanguage(locale))
  }

  const api: ThemeProviderWrapperContext = {
    changeTheme(theme) {
      changeTheme(theme)
    },
    changeLocale(locale) {
      if (locales[locale as ISupportedLocales] === undefined) {
        console.error('this Language is nor support')
      } else {
        changeLanguage(locale as ISupportedLocales)
      }
    },
    assignTheme(additionalTheme) {
      const theme = Object.assign({}, themeOption, additionalTheme)
      changeTheme(theme)
    },
    getCurrentLocale() {
      return locale
    },
    toggleDarkMode(bool) {
      if (bool === undefined) {
        setDarkMode(!darkMode)
      } else {
        setDarkMode(bool)
      }
      if (darkMode === true) {
        api.assignTheme(getTheme('dark'))
      } else if (darkMode === false) {
        api.assignTheme(getTheme('light'))
      }
    },
    toggleAutoDarkMode(bool) {
      if (autoDarkMode) {
        api.toggleDarkMode(darkMode)
      } else {
        api.assignTheme(getTheme(getSystemTheme()))
      }
      setAutoDarkMode(bool ?? !autoDarkMode)
    },
  }

  const setCSSThemeCallback = useCallback(() => {
    document.documentElement.style.setProperty(
      'color-scheme',
      themeOption.palette?.type ?? 'light',
    )
    i18n.changeLanguage(locale)

    setTheme(createTheme(themeOption, locales[locale]))
  }, [themeOption, locale, i18n])

  useEffect(() => {
    window.addEventListener('load', setCSSThemeCallback)
    return () =>
      window.removeEventListener('load', setCSSThemeCallback)
  })
  useEffect(() => {
    setTheme(createTheme(themeOption, locales[locale]))
  }, [themeOption, locale])

  return (
    <ThemeProviderWrapperContext.Provider value={api}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeProviderWrapperContext.Provider>
  )
}
