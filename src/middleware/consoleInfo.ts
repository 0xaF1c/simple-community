import { ErrorRequestHandler } from "express"
import { RequestHandler } from "express-serve-static-core"
import { FgGreen, FgRed, Reset } from "../utils/color"

export const successHander: RequestHandler = (req, _res, next) => {
  // if (req.statusCode === null) {
  //   console.log(`[${FgRed}NotFound${Reset}] ${req.method} ${req.path}`)
  // } else {
  console.log(`[${FgGreen}OK${Reset}] ${req.method} ${req.url}`)
  // }
  
  next()
}

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const responseJson = {
    status: err.status,
    error: err.inner
  }

  if (err) {
    console.log(`[${FgRed}Err${Reset}] ${req.path}`)
    console.log(JSON.stringify(responseJson, null, '  '))
    res.json(responseJson)
  }
}