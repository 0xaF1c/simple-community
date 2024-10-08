import { RequestHandler } from "express"

export type RequestMethod = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'

export interface RouterHandler {
  method: RequestMethod,
  middleware?: RequestHandler
  handlers: Array<RequestHandler>
}
export interface ControllerOptions {
  path: string,
  handler: Record<string, RouterHandler>
}

export interface HttpDTO {
  status: number
  data: any
}
interface IError {
  name: string
  message: string
  [other: string]: any
}
export interface ErrorDTO {
  status: number
  error: IError
}