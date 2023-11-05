import express, { Application, ErrorRequestHandler, RequestHandler } from "express"
import path from "path"
import { ControllerOptions } from "src/types"
import { FgGreen, Reset } from "./color"

type ICallback = (app: Application) => void
interface IChainedObject {
  useController: (controller: ControllerOptions) => IChainedObject
  useControllers: (controllers: Array<ControllerOptions>) => IChainedObject
  use: (...handlers: Array<RequestHandler | ErrorRequestHandler>) => IChainedObject
  onReady: (fn: ICallback) => IChainedObject
}

const api_path = process.env.API_ROOT ?? '/api'

let state = false
let timer : NodeJS.Timeout | undefined = undefined
let cb = (() => {}) as any

function formatUrl(url: string) {
  return url.replace(/\\/g, '/')
}

function useController(controller: ControllerOptions, app: Application) {
  const modulePath = controller.path
  
  Object.keys(controller.handler).forEach((key) => {
    const route = controller.handler[key]
    const url = formatUrl(path.join(api_path, modulePath, key))
    
    try {
      app[route.method](url, route.handlers)
      console.info(`[${FgGreen}Loaded${Reset}] ${url}`)
    } catch(e) {
      console.error(`${url}: ${e.msg}`)
    }
    
  })
}

function chainedObject(app: Application): IChainedObject {
  if (timer != undefined) {
    clearTimeout(timer!)
  }
  timer = setTimeout(() => {
    state = true
    if (state) {
      hooks(app)
      cb(app)
    }
  }, 500)
  return {
    useController(controller) {
      useController(controller, app)
      return chainedObject(app)
    },
    useControllers(controllers) {
      controllers.forEach(c => useController(c, app))
      return chainedObject(app)
    },
    use: (...handlers) => {
      app.use(...handlers)
      
      return chainedObject(app)
    },
    onReady: (fn) => {
      cb = fn
      return chainedObject(app)
    }
  }
}

function hooks(app: Application) {
  const filePath = process.env.DESCRIPTION_FILE ?? '../public/index.html'
  // const frontendPath = process.env.WEB_CLIENT_PATH ?? '/frontend/dist'

  // app.get('/', (_, res) => {
  //   res.sendFile(path.join(__dirname, '../../', frontendPath)+'/index.html')
  // })
  app.get(api_path, (_, res) => {
    res.sendFile(path.join(__dirname, filePath))
  })
}

export function startup() {
  const api_port = process.env.API_PORT ?? 3000
  const app = express()

  const str = `this server is running is http://localhost:${api_port}`
  
  app.listen(api_port, () => {
    const topBorder = str.replace(/./g, '█')
    const space = str.replace(/./g, ' ')

    console.log('')
    console.log(`  ${topBorder}████`)
    console.log(`███ ${space} ███`)
    console.log(`███ ${str} ███`)
    console.log(`███ ${space} ███`)
    console.log(`  ${topBorder}████`)
    console.log(``)
  })
  return chainedObject(app)
}
