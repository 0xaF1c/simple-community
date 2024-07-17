import { Brightness6, BrightnessAuto } from "@material-ui/icons"
import { IconButton, Tooltip } from "@mui/material"
import { useAppSelector } from "../../store"
import { useTranslation } from "react-i18next"
import { useChangeTheme } from "../ThemeProviderWrapper/useChangeTheme"

export function AutoDarkModeButton() {
  const { toggleAutoDarkMode } = useChangeTheme()
  const { t } = useTranslation()

  const autoDarkMode = useAppSelector(state => state.storage.common.autoDarkMode)

  const icon = () => {
    if (autoDarkMode) {
      return <BrightnessAuto />
    }
    return <Brightness6 />
  }

  return (
    <Tooltip title={t('FollowingSystem')}>
      <IconButton onClick={() => toggleAutoDarkMode()} color="inherit">
        {icon()}
      </IconButton>
    </Tooltip>
  )
}