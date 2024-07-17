import { StatusCodes } from "http-status-codes"
import { UserEntity } from "../../../entitys/user/user.entity"
import { useAppDataSource } from "../../../utils/database"

const { dataSource } = useAppDataSource()
const userRepository = dataSource.getRepository(UserEntity)

export function listUsers(limit: number) {
  return new Promise((resolve, reject) => {
    userRepository
      .createQueryBuilder()
      .select()
      .limit(limit ?? 10)
      .getMany()
      .then((result) => {
        resolve({
          status: StatusCodes.OK,
          data: result
        })
      })
      .catch((err) => {
        reject({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: {
            name: 'INTERNAL_SERVER_ERROR',
            message: err.name
          }
        })
      })
  })
}

export function deleteUser(id: number) {
  return new Promise((resolve, reject) => {
    userRepository.delete({
      id
    })
      .then((result) => {
        resolve({
          status: StatusCodes.OK,
          data: result
        })
      })
      .catch((err) => {
        reject({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: {
            name: err.name,
            message: err.message
          }
        })
      })
  })
}