import { plainToClass } from 'class-transformer'
import { validate } from "class-validator";
import { RequestHandler } from "express";
import { StatusCodes } from 'http-status-codes';
import { ErrorDTO } from '../types';



export function useValidateInterceptor(validatorClass: any, type: 'get' | 'post'): RequestHandler {
  return (req, res, next) => {
    let obj = {}
    if (type === 'get') {
      obj = req.query
    } else if (type === 'post') {
      obj = req.body
    }

    console.log(plainToClass(validatorClass, obj))
    
    validate(plainToClass(validatorClass, obj))
      .then((result) => {
        let verifyList: any = []
        result.forEach((item) => {
          verifyList.push({
            error: item.constraints,
            property: item.property,
            value: item.value
          })
        })
        if (result.length === 0) {
          next()
        } else {
          const error: ErrorDTO = {
            status: StatusCodes.BAD_REQUEST,
            error: {
              name: 'PARAMS_ERROR',
              message: 'Params Error',
              verifyList
            }
          }        
          res.json(error)
        }
      })
      .catch((err) => {
        const errorRes: ErrorDTO = {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: {
            name: 'INTERNAL_SERVER_ERROR',
            message: err.msg,
          }
        }
        res.json(errorRes)
      })
  }
}