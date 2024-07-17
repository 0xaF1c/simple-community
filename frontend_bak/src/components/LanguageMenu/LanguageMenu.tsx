import {
  Button,
  Menu,
  MenuItem,
  Tooltip,
} from '@material-ui/core'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExpandMore, Translate } from '@material-ui/icons'
import { useChangeTheme } from '../ThemeProviderWrapper/useChangeTheme'

export function LanguageMenu() {
  const { i18n, t } = useTranslation()
  const keys = Object.keys(i18n.store.data)
  const names = i18n.store.data
  const languageLabel = (key: string) =>
    names[key].translation as Record<string, any>

  const [menuOpen, setMenuOpen] = useState(false)
  const { changeLocale } = useChangeTheme()
  const trigger = useRef(null)

  const openMenu = () => {
    setMenuOpen(!menuOpen)
  }
  const selectLanguage = (key: string) => {
    changeLocale(key)
    setMenuOpen(false)
  }
  const languageLabels = () => {
    return (
      <Menu
        keepMounted
        open={menuOpen}
        anchorEl={trigger.current}
        onClose={() => setMenuOpen(false)}
      >
        {keys.map((key) => {
          const { name } = languageLabel(key)
          return (
            <MenuItem
              onClick={() => selectLanguage(key)}
              key={key}
            >
              {name}
            </MenuItem>
          )
        })}
      </Menu>
    )
  }

  return (
    <>
      <Tooltip title={t('changeLanguage')}>
        <Button
          ref={trigger}
          onClick={openMenu}
          color="inherit"
          endIcon={<ExpandMore />}
        >
          <Translate />
        </Button>
      </Tooltip>
      {languageLabels()}
    </>
  )
}
