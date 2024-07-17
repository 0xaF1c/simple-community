import { StatusCodes } from "http-status-codes";
import { ControllerOptions } from "src/types";
import { getTestArticle } from "../../utils/trashArticle";

export const utilsController: ControllerOptions = {
  path: '/utils',
  handler: {
    '/trash_article': {
      method: 'get',
      handlers: [
        (req, res) => {
          // @ts-ignore
          const { title, content } = getTestArticle(req.query?.theme)
          res.json({
            status: StatusCodes.OK,
            data: {
              title,
              content
            }
          })
        }
      ]
    }

  }
}