import { RequestHandler } from "express"

export type RequestMethod = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'

export interface RouterHandler {
  path: string,
  method: RequestMethod,
  handler: RequestHandler
}
export interface ControllerOptions {
  path: string,
  handlers: Array<RouterHandler>
}