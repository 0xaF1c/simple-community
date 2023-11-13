import { useAppDataSource } from "../../utils/database";
import { CreateTagParams } from "./validate";
import { TagEntity } from "../../entitys/tag/tag.entity";
import { ErrorDTO, HttpDTO } from "src/types";
import { StatusCodes } from "http-status-codes";

const { dataSource } = useAppDataSource()
const tagRepository = dataSource.getRepository(TagEntity)

export function createTag(tag: CreateTagParams, id: string): Promise<HttpDTO | ErrorDTO> {
  if (!tag.poster) tag.poster = '/public/tagPoster/default.jpg'
  if (!tag.description) tag.description = '这个话题的发起者很懒，什么都没写'
  tag.creator = id

  return new Promise((resolve, reject) => {
    tagRepository.save(tag)
      .then((saveResult) => {
        resolve({
          status: StatusCodes.OK,
          data: {
            msg: 'success',
            id: saveResult.id
          }
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