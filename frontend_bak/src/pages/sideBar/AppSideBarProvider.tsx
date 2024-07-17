import { ReactElement, createContext, useState } from 'react'
import { AppSideBar } from './AppSideBar'

interface IAppSideBarProviderProps {
  children: ReactElement[] | ReactElement 
}
type IAnchor = 'left' | 'top' | 'right' | 'bottom' | undefined
interface IAppSideBarContextApi {
  open: () => void
  close: () => void
  setAnchor: (anchor: IAnchor) => void
  toggle: (isOpen?: boolean) => void
  setSideBarWidth: (width: number) => void
  onToggle: (cb: (isOpen?: boolean) => void) => void
  sideBarWidth: number
  isOpen: boolean
}

function injectError() {
  console.log('pls call this function in provider')
}

export const AppSideBarContext = createContext<IAppSideBarContextApi>({
  open: injectError,
  close: injectError,
  toggle: injectError,
  setAnchor: injectError,
  setSideBarWidth: injectError,
  onToggle: injectError,
  sideBarWidth: 0,
  isOpen: false,
})

export function AppSideBarProvider({ children }: IAppSideBarProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [anchor, setAnchor] = useState<IAnchor>('left')
  const [width, setWidth] = useState(150)
  const onToggleCallbacks = new Map()
  const runCallback = (...args: any) => {
    for (const key of onToggleCallbacks.keys()) {
      const cb = onToggleCallbacks.get(key)
      cb(...args)
    }
  }

  const api: IAppSideBarContextApi = {
    open() {
      setIsOpen(true)
      runCallback(isOpen)
    },
    close() {
      setIsOpen(false)
      runCallback(isOpen)
    },
    toggle(_isOpen?: boolean) {
      runCallback(isOpen)
      if (_isOpen) {
        setIsOpen(isOpen)
      } else {
        setIsOpen(!isOpen)
      }
      
    },
    setAnchor(ahchor) {
      setAnchor(ahchor)
    },
    onToggle(callback) {
      onToggleCallbacks.set(callback.toString(), callback)
    },
    sideBarWidth: width,
    setSideBarWidth: setWidth,
    isOpen: isOpen
  }

  return (
    <>
      <AppSideBarContext.Provider value={api}>
        <AppSideBar open={isOpen} setOpen={api.close!} anchor={anchor} width={width} />
        {children}
      </AppSideBarContext.Provider>
    </>
  )
}
