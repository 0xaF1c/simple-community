import express, { Application } from "express"
import path from "path"
import { ControllerOptions } from "src/types"

interface IChainedObject {
  useController: (controller: ControllerOptions) => IChainedObject
  useControllers: (controllers: Array<ControllerOptions>) => IChainedObject
  use: (...handlers: Array<express.RequestHandler>) => IChainedObject
}

function formatUrl(url: string) {
  return url.replace(/\\/g, '/')
}

function useController(controller: ControllerOptions, app: Application) {
  const root = controller.path
  controller.handlers.forEach(route => {
    const url = formatUrl(path.join(root, route.path))
    
    try {
      app[route.method](url, route.handler)
      console.info(`${url}: loaded`)
    } catch(e) {
      console.error(`${url}: ${e.msg}`)
    }
  })
}

function chainedObject(app: Application): IChainedObject {
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
    }
  }
}



export function startup() {
  const app = express()
  
  app.get('/', (_, res) => res.json({ msg: 'HelloWorld' }))
  
  
  app.listen(3000, () => {
    console.log('this server is running is http://localhost:3000')
  })

  return chainedObject(app)
}
