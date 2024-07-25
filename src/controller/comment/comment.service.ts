import { ErrorDTO, HttpDTO } from "src/types";
import { CommentEntity } from "../../entitys/comment/comment.entity";
import { PostCommentEntity } from "../../entitys/post/postCommentRelation.entity";
import { useAppDataSource } from "../../utils/database";
import { PostCommentSendParams } from "../post/validate";
import { StatusCodes } from "http-status-codes";
import { UserEntity } from "../../entitys/user/user.entity";
import { CommentLikeParams } from "./validate";
import { commentLikesEntity } from "../../entitys/comment/commentLikesRelation.entity";
import { PostCommentsDTO, PostEntity } from "../../entitys/post/post.entity";
import { FgYellow, Reset } from "../../utils/color";

const { dataSource } = useAppDataSource();

const commentRepository = dataSource.getRepository(CommentEntity);
const postCommentRepository = dataSource.getRepository(PostCommentEntity);
const commentLikeRepository = dataSource.getRepository(commentLikesEntity);
const postRepository = dataSource.getRepository(PostEntity);

export function sendPostComment(
  comment: PostCommentSendParams,
  userId: string
): Promise<HttpDTO | ErrorDTO> {
  if (comment.replyTo === undefined) comment.replyTo = null;
  comment.publisher = userId;

  return new Promise((resolve, reject) => {
    commentRepository
      .save(comment)
      .then((savePostResult) => {
        postCommentRepository
          .save({
            commentId: savePostResult.id,
            postId: comment.postId,
            publisher: userId,
          })
          .then((_) => {
            resolve({
              status: StatusCodes.OK,
              data: {
                msg: "success",
                id: savePostResult.id,
              },
            });
          })
          .catch((err) => {
            reject({
              status: StatusCodes.INTERNAL_SERVER_ERROR,
              error: {
                name: err.name,
                message: err.message,
              },
            });
          });
      })
      .catch((err) => {
        reject({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: {
            name: err.name,
            message: err.message,
          },
        });
      });
  });
}

export function getPostComments(postId: string) {
  return new Promise((resolve, reject) => {
    postCommentRepository
      .createQueryBuilder()
      .leftJoinAndSelect(
        CommentEntity,
        "comment",
        "PostCommentEntity.commentId = comment.id"
      )
      .leftJoinAndSelect(UserEntity, "user", "comment.publisher = user.id")
      .leftJoinAndSelect(
        commentLikesEntity,
        "like",
        "like.commentId = comment.id"
      )
      .leftJoinAndSelect(UserEntity, "likeUser", "like.userId = likeUser.id")
      .where("PostCommentEntity.postId = :id", { id: postId })
      .getRawMany()
      .then((result) => {
        resolve({
          status: StatusCodes.OK,
          data: PostCommentsDTO.fromFindResult(result),
        });
      })
      .catch((err) => {
        reject({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: {
            name: err.name,
            message: err.message,
          },
        });
      });
  });
}

export function commentLike(
  commentLikeParams: CommentLikeParams,
  id: string
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    if (commentLikeParams.like === "true") {
      commentLikeRepository
        .findOne({
          where: {
            userId: id,
            commentId: commentLikeParams.commentId,
          },
        })
        .then((findResult) => {
          if (findResult === null) {
            commentLikeRepository
              .save({
                userId: id,
                commentId: commentLikeParams.commentId,
              })
              .then((result) => {
                resolve({
                  status: StatusCodes.OK,
                  data: {
                    msg: "success",
                    id: result.id,
                  },
                });
              })
              .catch((err) => {
                reject({
                  status: StatusCodes.INTERNAL_SERVER_ERROR,
                  error: {
                    name: err.name,
                    message: err.message,
                  },
                });
              });
          } else {
            reject({
              status: StatusCodes.OK,
              data: {
                msg: "repeat like",
              },
            });
          }
        });
    } else {
      commentLikeRepository
        .delete({
          userId: id,
          commentId: commentLikeParams.commentId,
        })
        .then((_) => {
          resolve({
            status: StatusCodes.OK,
            data: {
              msg: "success",
            },
          });
        })
        .catch((err) => {
          reject({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error: {
              name: err.name,
              message: err.message,
            },
          });
        });
    }
  });
}

export function deleteComment(
  commentId: string,
  userId: string
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    commentRepository
      .find({
        where: {
          replyTo: commentId,
        },
      })
      .then((comments) => {
        const result = comments.map((comment) =>
          deleteCommentRelation(comment.id, comment.publisher)
        );
        result.push(deleteCommentRelation(commentId, userId));

        Promise.all(result)
          .then((result) => {
            resolve({
              status: StatusCodes.OK,
              data: result,
            });
          })
          .catch((err) => {
            reject({
              status: StatusCodes.INTERNAL_SERVER_ERROR,
              error: {
                name: err.name,
                message: err.message,
              },
            });
          });
      })
      .catch((err) => {
        console.error(err);
      });
  });
}
export function deleteCommentRelation(
  commentId: string,
  userId: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    commentRepository
      .delete({
        id: commentId,
        publisher: userId,
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject({
          errorId: commentId,
          error: {
            name: err.name,
            message: err.message,
          },
        });
      });
    commentLikeRepository
      .delete({
        commentId: commentId,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.error(err);
      });
    postCommentRepository
      .delete({
        commentId: commentId,
      })
      .then((result) => {
        console.info(`[${FgYellow}delete no relation PostCmment${Reset}]`);
        console.log(result);
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

export function deletNoRelationComment(): void {
  commentRepository
    .find()
    .then((comments) => {
      const commentsId = comments.map((c) => c.id);

      const replys = comments.filter((c) => {
        return c.replyTo !== null && !commentsId.includes(c.replyTo);
      });
      console.info(`[${FgYellow}delete no relation comment${Reset}]`);
      console.log(replys);
      Promise.all(replys.map((c) => deleteCommentRelation(c.id, c.publisher)))
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.error({
            name: err.name,
            message: err.message,
          });
        });
    })
    .catch((err) => {
      console.error(err);
    });
  postRepository.find().then((posts) => {
    const postsId = posts.map((p) => p.id);
    postCommentRepository.find().then((relations) => {
      const rels = relations.filter((rel) => !postsId.includes(rel.postId));
      console.info(`[${FgYellow}delete no relation comment${Reset}]`);
      rels.forEach((rel) => {
        postCommentRepository.delete({
          id: rel.id,
          postId: rel.postId,
          commentId: rel.commentId,
        });
      });
    });
  });
}
