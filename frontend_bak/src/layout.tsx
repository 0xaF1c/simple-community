import { FC, ReactElement } from 'react'
import { SnackbarProvider } from 'notistack'

import store from './store/index.ts'
import { Provider } from 'react-redux'
import { AppSideBarProvider } from './pages/sideBar/AppSideBarProvider.tsx'
import { ThemeProviderWrapper } from './components/ThemeProviderWrapper/ThemeProviderWrapper.tsx'
// import React from 'react'

interface IProps {
  children?: ReactElement
}

const Layout: FC<IProps> = ({ children }) => {
  return (
    <Provider store={store}>
      {/* <React.StrictMode> */}
      <ThemeProviderWrapper>
        <AppSideBarProvider>
          <SnackbarProvider maxSnack={4}>
            {children!}
          </SnackbarProvider>
        </AppSideBarProvider>
      </ThemeProviderWrapper>
      {/* </React.StrictMode> */}
    </Provider>
  )
}

export default Layout
