import { RequestHandler } from "express"

export type Method = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'

export interface RouterHandler {
  path: string,
  method: Method,
  handler: RequestHandler
}
export interface ControllerOptions {
  path: string,
  handlers: Array<RouterHandler>
}