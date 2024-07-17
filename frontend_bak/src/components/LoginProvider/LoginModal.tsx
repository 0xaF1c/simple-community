import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  makeStyles,
  createStyles,
  Theme,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  IconButton,
} from '@material-ui/core'
import { Close } from '@mui/icons-material'
import { ChangeEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useApi } from '../../utils/request'
import { useSnackbar } from 'notistack'
import { useAuthState } from '../../utils/auth'

interface ILoginModalProps {
  open: boolean
  onClose: () => void
}
enum LoginMethod {
  EMAIL = 'LoginWithEmail',
  ACCOUNT = 'LoginWithAccount',
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
    },
    row: {
      marginBottom: theme.spacing(2),
      width: '100%',
    },
    input: {
      marginBottom: theme.spacing(2),
      width: '100%',
    },
    title: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(3),
    },
  }),
)

export function LoginModal({ open, onClose }: ILoginModalProps) {
  const { t } = useTranslation()
  const { api } = useApi()
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const { login } = useAuthState()

  const [loginMethod, setLoginMethod] = useState('LoginWithAccount')
  const [verifyCodeCountRef, setVerifyCodeCount] = useState(0)
  const [emailFormatError, setEmailFormatError] = useState(false)

  const sendDisabled = verifyCodeCountRef > 0
  const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  // form
  const [email, setEmail] = useState('')
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [verifyCode, setVerifyCode] = useState('')

  const onLoginMethodChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginMethod(e.target.value)
  }
  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setEmailFormatError(e.target.value.match(emailReg) === null)
  }
  let verifyCodeCount = 0
  const onVerifyCodeSend = () => {
    if (email.match(emailReg) !== null) {
      verifyCodeCount = 60
      setVerifyCodeCount(verifyCodeCount--)

      const timer = setInterval(() => {
        if (verifyCodeCount === 0) {
          clearInterval(timer)
        }

        setVerifyCodeCount(verifyCodeCount--)
      }, 1000)
      // request
      api
        .get('/user/login/email/send', {
          params: {
            email,
          },
        })
        .then(() => {
          enqueueSnackbar(t('VerifyCode') + t('Send') + t('Success'))
        })
        .catch(() => {
          enqueueSnackbar(t('VerifyCode') + t('Send') + t('Failed'), {
            variant: 'error',
          })
        })
    } else {
      setEmailFormatError(true)
      enqueueSnackbar(t('VerifyCode') + t('Send') + t('Failed'), {
        variant: 'error',
      })
    }
  }
  const onSubmit = () => {
    if (loginMethod === LoginMethod.EMAIL) {
      api
        .post('/user/login/email', {
          email,
          code: verifyCode,
        })
        .then((res: any) => {
          if (res.error !== undefined) {
            enqueueSnackbar(t(res.error?.name), {
              variant: 'error',
            })
          }
          if (res.data !== undefined) {
            login(res.data.token)
          }
        })
        .catch((err) => console.log(err))
    } else if (loginMethod === LoginMethod.ACCOUNT) {
      api
        .post('/user/login', {
          account,
          password,
        })
        .then((res: any) => {
          if (res.error !== undefined) {
            enqueueSnackbar(t(res.error?.name), {
              variant: 'error',
            })
          }
          if (res.data !== undefined) {
            login(res.data.token)
          }
        })
        .catch((err) => console.log(err))
    }
  }

  return (
    <>
      <Dialog open={open}>
        <DialogTitle>
          <Typography className={classes.title} variant="h6">
            {t('Login')}
          </Typography>
          <IconButton
            className={classes.closeButton}
            onClick={onClose}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.content}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid container className={classes.row}>
              <RadioGroup
                value={loginMethod}
                onChange={onLoginMethodChange}
              >
                <FormControlLabel
                  label={t(LoginMethod.ACCOUNT)}
                  value={LoginMethod.ACCOUNT}
                  control={<Radio color="primary" />}
                />
                <FormControlLabel
                  label={t(LoginMethod.EMAIL)}
                  value={LoginMethod.EMAIL}
                  control={<Radio color="primary" />}
                />
              </RadioGroup>
            </Grid>
            {(() => {
              if (loginMethod === LoginMethod.EMAIL) {
                return (
                  <Grid container className={classes.row}>
                    <TextField
                      variant="outlined"
                      className={classes.input}
                      label={t('Email')}
                      error={emailFormatError}
                      value={email}
                      onChange={onEmailChange}
                    ></TextField>
                    <Grid
                      container
                      justifyContent="space-between"
                      className={classes.row}
                    >
                      <TextField
                        variant="outlined"
                        label={t('VerifyCode')}
                        style={{ width: '76%' }}
                        value={verifyCode}
                        onChange={(e) =>
                          setVerifyCode(e.target.value)
                        }
                      ></TextField>
                      <Button
                        variant="outlined"
                        style={{ width: '20%' }}
                        onClick={onVerifyCodeSend}
                        disabled={sendDisabled}
                      >
                        {sendDisabled
                          ? verifyCodeCountRef
                          : t('Send')}
                      </Button>
                    </Grid>
                  </Grid>
                )
              } else if (loginMethod === LoginMethod.ACCOUNT) {
                return (
                  <Grid container className={classes.row}>
                    <TextField
                      variant="outlined"
                      className={classes.input}
                      label={t('Account')}
                      value={account}
                      onChange={(e) => setAccount(e.target.value)}
                    ></TextField>
                    <TextField
                      variant="outlined"
                      className={classes.input}
                      label={t('Password')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    ></TextField>
                  </Grid>
                )
              } else {
                return <h1>ERROR!!!!</h1>
              }
            })()}

            <Grid
              className={classes.row}
              container
              justifyContent="space-between"
            >
              <Button
                variant="contained"
                color="primary"
                onClick={onSubmit}
              >
                {t('Login')}
              </Button>
              <Button>{t('ForgotPassword')}</Button>
              <Button>{t('Register')}</Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}
