import { PostEntity } from "../../../entitys/post/post.entity"
import { useAppDataSource } from "../../../utils/database"
import { StatusCodes } from "http-status-codes"

const { dataSource } = useAppDataSource()

const postRepository = dataSource.getRepository(PostEntity)

export function getAllPost(limit: number) {
  return new Promise((resolve, reject) => {
    postRepository
      .createQueryBuilder()
      .select()
      .where("")
      .limit(limit)
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