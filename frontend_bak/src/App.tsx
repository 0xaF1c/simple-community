import {
  Container,
  Paper,
  Theme,
  createStyles,
  makeStyles,
} from '@material-ui/core'

import { useRef, useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useResize } from './utils/useResize'
import { AppHeader } from './pages/header/AppHeader'
import { AppFooter } from './pages/footer/AppFooter'
import { useAppSideBar } from './pages/sideBar/useAppSideBar'
import { LoginModal } from './components/LoginProvider/LoginModal'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    animation: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      width: `100%`,
      marginLeft: '0px',
    },
  }),
)

function App() {
  const { height } = useResize()
  const classes = useStyles()
  const header = useRef(null)
  const footer = useRef(null)
  const content = useRef(null)
  const { sideBarWidth, isOpen } = useAppSideBar()

  const shiftStyle = () => {
    if (isOpen) {
      return {
        width: `calc(100% - ${sideBarWidth}px)`,
        marginLeft: sideBarWidth,
      }
    } else {
      return {}
    }
  }

  useEffect(() => {
    const headerEl = header.current! as HTMLElement
    const footerEl = footer.current! as HTMLElement
    const contentEl = content.current! as HTMLElement

    const headerHeight = headerEl.getBoundingClientRect().height
    const footerHeight = footerEl.getBoundingClientRect().height

    contentEl.style.height = `${
      height - headerHeight - footerHeight
    }px`
  })

  const [LoginModalOpen, setLoginModalOpen] = useState(true)

  return (
    <>
      <LoginModal
        open={LoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
      <Paper className={classes.animation} style={shiftStyle()}>
        <div ref={header}>
          <AppHeader style={shiftStyle()}></AppHeader>
        </div>

        <Container ref={content} style={{ overflow: 'auto' }}>
          <RouterProvider router={router}></RouterProvider>
        </Container>

        <div ref={footer}>
          <AppFooter></AppFooter>
        </div>
      </Paper>
    </>
  )
}

export default App
