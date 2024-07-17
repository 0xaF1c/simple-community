import { Drawer } from '@material-ui/core'
import { useStyles } from './styles'
import { AppMenu } from '../Menu/AppMenu'

interface AppSideBarProps {
  open: boolean
  setOpen: (open: boolean) => void
  anchor?: 'left' | 'top' | 'right' | 'bottom'
  variant?: 'permanent' | 'persistent' | 'temporary'
  width?: number
}

export function AppSideBar({
  open,
  setOpen,
  anchor,
  variant,
  width,
}: AppSideBarProps) {
  const classes = useStyles()

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <Drawer
      open={open}
      anchor={anchor ?? 'left'}
      variant={variant ?? 'persistent'}
      className={classes.drawer}
    >
      <AppMenu
        onCloseClick={handleDrawerClose}
        width={width}
      ></AppMenu>
    </Drawer>
  )
}
