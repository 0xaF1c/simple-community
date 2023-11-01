import express, { Application, RequestHandler } from "express"
import path from "path"
import { ControllerOptions } from "src/types"

type ICallback = (app: Application) => void
interface IChainedObject {
  useController: (controller: ControllerOptions) => IChainedObject
  useControllers: (controllers: Array<ControllerOptions>) => IChainedObject
  use: (...handlers: Array<RequestHandler>) => IChainedObject
  onReady: (fn: ICallback) => IChainedObject
}

function formatUrl(url: string) {
  return url.replace(/\\/g, '/')
}

function useController(controller: ControllerOptions, app: Application) {
  const modulePath = controller.path
  controller.handlers.forEach(route => {
    const url = formatUrl(path.join(modulePath, route.path))

    try {
      app[route.method](url, route.handler)
      console.info(`${url}: loaded`)
    } catch(e) {
      console.error(`${url}: ${e.msg}`)
    }
  })
}

let state = false
let timer : NodeJS.Timeout | undefined = undefined
let cb = (() => {}) as any
function chainedObject(app: Application): IChainedObject {
  if (timer != undefined) {
    clearTimeout(timer!)
  }
  timer = setTimeout(() => {
    state = true
    if (state) {
      console.log('wdnmd');
      
      hooks(app)
      cb(app)
    }
  }, 5000)
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
  const api_path = process.env.API_ROOT ?? '/api'
  const filePath = process.env.DESCRIPTION_FILE ?? '../public/index.html'
  app.get(api_path, (_, res) => {
    res.sendFile(path.join(__dirname, filePath))
  })
}

export function startup() {
  const api_port = process.env.API_PORT ?? 3000
  const app = express()

  
  app.listen(api_port, () => {
    console.log(`this server is running is http://localhost:${api_port}`)
  })
  return chainedObject(app)
}
