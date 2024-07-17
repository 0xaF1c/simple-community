
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@material-ui/core'
import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  Mail,
} from '@material-ui/icons'
import { ReactElement } from 'react'

type IAppMenuProps = {
  onCloseClick: () => void
  width: number | undefined
}
interface MenuOption {
  label: string
  icon: ReactElement
  onClick: () => void
}

function useMenuOption(options: MenuOption[]) {
  return options.map(({ label, icon }: MenuOption, index) => (
    <ListItem button key={index}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  ))
}

const options = [
  {
    label: 'Inbox',
    icon: <Inbox />,
    onClick: () => {},
  },
  {
    label: 'Starred',
    icon: <Mail />,
    onClick: () => {},
  },
  {
    label: 'Send email',
    icon: <Inbox />,
    onClick: () => {},
  },
  {
    label: 'Drafts',
    icon: <Mail />,
    onClick: () => {},
  },
]

export function AppMenu({
  onCloseClick,
  width,
}: IAppMenuProps) {
  const theme = useTheme()
  return (
    <>
      <div style={{ width: `${width ?? 150}px` }}>
        <IconButton onClick={onCloseClick}>
          {theme.direction === 'ltr' ? (
            <ChevronLeft />
          ) : (
            <ChevronRight />
          )}
        </IconButton>
      </div>
      <Divider />
      <List>{useMenuOption(options)}</List>
    </>
  )
}
