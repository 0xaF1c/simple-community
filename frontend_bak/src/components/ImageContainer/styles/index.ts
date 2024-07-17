import { createStyles, makeStyles, Theme } from '@material-ui/core'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      boxShadow: theme.shadows[1],
    },
    text: {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
    },
    texttop: {
      flexDirection: 'column',
      // alignItems: 'flex-start',
    },
    textbottom: {
      flexDirection: 'column-reverse',
      // alignItems: 'flex-end',
    },
    textProtectShader: {
      width: '100%',
      padding: theme.spacing(2),
      display: 'flex',
    },
    textProtectShadertop: {
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0) 100%)',
    },
    textProtectShaderbottom: {
      background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.7) 100%)',
    },
    title: {
      width: '100%',
      fontSize: '1.4rem',
      color: theme.palette.text.primary
    },
    subTitle: {
      width: '100%',
      color: theme.palette.text.secondary
    }
  }),
)
