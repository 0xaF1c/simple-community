import { useContext } from "react"
import { AppSideBarContext } from "./AppSideBarProvider"

export function useAppSideBar() {
  const api = useContext(AppSideBarContext)
  return api
}