import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { Menu } from '@material-ui/icons'
import { useStyles } from './styles'
import { useAppSideBar } from '../sideBar/useAppSideBar'
import { AutoDarkModeButton } from '../../components/Buttons/AutoDarkModeButton'
import { DarkModeButton } from '../../components/Buttons/DarkModeButton'
import { LanguageMenu } from '../../components/LanguageMenu/LanguageMenu'

export function AppHeader({ style }: any) {
  const classes = useStyles()
  const { toggle } = useAppSideBar()

  return (
    <div>
      <AppBar className={classes.header} style={style}>
        <Toolbar>
          <IconButton
            onClick={() => toggle()}
            className={classes.menuButton}
            color="inherit"
            edge="end"
          >
            <Menu />
          </IconButton>
          <Typography variant='h6' className={classes.title}></Typography>
          <div className={classes.buttonGroup}>
            <DarkModeButton></DarkModeButton>
            <AutoDarkModeButton></AutoDarkModeButton>
            <LanguageMenu></LanguageMenu>
          </div>
          <div>
            LOGIN
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  )
}
