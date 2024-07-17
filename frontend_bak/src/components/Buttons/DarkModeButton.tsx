import { DarkMode, LightMode } from '@mui/icons-material'
import { useAppSelector } from '../../store'
import { useChangeTheme } from '../ThemeProviderWrapper/useChangeTheme'
import { IconButton, Tooltip } from '@material-ui/core'
import { useTranslation } from 'react-i18next'

export function DarkModeButton() {
  const { t } = useTranslation()
  const { toggleDarkMode } = useChangeTheme()

  const darkMode = useAppSelector(
    (state) => state.storage.common.darkMode,
  )
  const autoDarkMode = useAppSelector(
    (state) => state.storage.common.autoDarkMode,
  )

  const icon = () => {
    if (darkMode) {
      return <DarkMode />
    }
    return <LightMode />
  }

  return (
    <IconButton
      disabled={autoDarkMode}
      onClick={() => toggleDarkMode()}
      color="inherit"
      style={{ pointerEvents: 'all' }}
    >
      <Tooltip title={t(darkMode ? 'DarkMode' : 'LightMode')}>
        {icon()}
      </Tooltip>
    </IconButton>
  )
}
