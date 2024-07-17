import { useCallback, useEffect, useState } from "react"

export const useResize = useElementResize.bind(null, document.documentElement)

export function useElementResize(element: HTMLElement) {  
  
  const [size, setSize] = useState({
    width: element.clientWidth,
    height: element.clientHeight,
  })

  const onResize = useCallback(() => {
    setSize({
      width: element.clientWidth,
      height: element.clientHeight,
    })
  }, [element])

  useEffect(() => {
    window.addEventListener("resize", onResize)
    return (() => {
      window.removeEventListener("resize", onResize)
    })
  }, [onResize])

  return size
}