import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../store";
import { setProfile, setToken } from "../store/modules/auth";
import { userDto } from "../types";
import { useApi } from "./request";
import { StatusCodes } from 'http-status-codes'
import { useSnackbar } from "notistack";

export enum LoginStatus {
  LOGINED = 'Logined',
  NO_LOGIN_INFO = 'NoLoginInfo',
  LOGIN_TIMEOUT = 'LoginTimeout',
  LOGIN_FAILED = 'LoginFailed',
}


export function useAuthState() {
  const { api } = useApi()
  const dispatch = useAppDispatch()
  const token = useAppSelector(state => state.storage.auth.token)
  const profile = useAppSelector(state => state.storage.auth.profile)
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()

  const getProfile = (): Promise<userDto | any> => {
    return new Promise((resolve, reject) => {
      api.get('/user/status')
        .then((res: any) => {
          if (res.status === StatusCodes.UNAUTHORIZED) {
            if (res!.error.name === 'TokenExpiredError') {
              resolve(t(LoginStatus.LOGIN_TIMEOUT))
              enqueueSnackbar(t(LoginStatus.LOGIN_TIMEOUT), { variant: 'error' })
            } else {
              resolve(t(LoginStatus.LOGIN_FAILED))
              enqueueSnackbar(t(LoginStatus.LOGIN_FAILED), { variant: 'error' })
            }
          } else if (res.status === StatusCodes.OK) {
            resolve(t(LoginStatus.LOGINED))
            dispatch(setProfile(res.data))
            enqueueSnackbar(t(LoginStatus.LOGINED), { variant: 'success' })
          }
        })
        .catch(err => {

          reject(err)
        })
    })
  }
  const isLogin = (): boolean => {
    if (token !== null) {
      return true
    }
    if (JSON.stringify(profile) !== '{}') {
      return true
    }
    return false
  }

  const login = (token: string) => {
    dispatch(setToken(token))
    getProfile()
      .then()
      .catch(err => console.log(err))
  }

  const logout = () => {
    dispatch(setProfile({}))
    dispatch(setToken(''))
  }

  return {
    isLogin,
    login,
    logout
  }
}