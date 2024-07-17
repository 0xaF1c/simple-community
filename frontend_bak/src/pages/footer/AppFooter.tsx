import {
  BottomNavigation,
  BottomNavigationAction,
} from '@material-ui/core'
import {
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useStyles } from './styles'
import {
  HomeOutlined,
  AccessTime,
  WatchLater,
  PersonOutline,
  Person,
  Home,
} from '@material-ui/icons'
import { router } from '../../router'
import { useHistory } from '../../utils/history'
import { useTranslation } from 'react-i18next'

export function AppFooter() {
  const [value, setValue] = useState('/')
  const history = useHistory()
  const classes = useStyles()
  const { t } = useTranslation()

  type IUseNavigationActionProps = {
    value: string
    label: string
    icon: ReactNode
    activeIcon: ReactNode
  }
  const createNavigationAction = ({
    value: _value,
    label,
    icon,
    activeIcon,
  }: IUseNavigationActionProps): ReactNode => {
    return (
      <BottomNavigationAction
        value={_value}
        label={label}
        key={label}
        icon={(() => {
          if (_value === value) {
            return activeIcon
          } else {
            return icon
          }
        })()}
      />
    )
  }

  const actions = [
    {
      value: '/',
      label: t('Home'),
      icon: <HomeOutlined />,
      activeIcon: <Home />,
    },
    {
      value: '/activity',
      label: t('Activity'),
      icon: <AccessTime />,
      activeIcon: <WatchLater />,
    },
    {
      value: '/me',
      label: t('Me'),
      icon: <PersonOutline />,
      activeIcon: <Person />,
    },
  ]

  const cb = useCallback(() => {
    const newHistory = history.new()
    if (newHistory.location.hash === '') {
      
      setValue(newHistory.location.pathname)
    } else {
      const pathname = newHistory.location.hash.replace(
        '#',
        '',
      )
      setValue(pathname)
    }
  }, [history])
  useEffect(() => {
    window.addEventListener('load', cb)
    return () => window.removeEventListener('load', cb)
  })

  return (
    <>
      <BottomNavigation
        showLabels
        value={value}
        className={classes.footer}
        onChange={(_e, v) => {
          router.navigate(v)
          setValue(v)
        }}
      >
        {actions.map((action) =>
          createNavigationAction(action),
        )}
        {/* {useNavigationAction({
          value: '/',
          label: 'Home',
          icon: <HomeOutlined />,
          activeIcon: <Home />,
        })}
        {useNavigationAction({
          value: '/activity',
          label: 'Activity',
          icon: <AccessTime />,
          activeIcon: <WatchLater />,
        })}
        {useNavigationAction({
          value: '/me',
          label: 'Me',
          icon: <PersonOutline />, 
          activeIcon: <Person />,
        })} */}
      </BottomNavigation>
    </>
  )
}
