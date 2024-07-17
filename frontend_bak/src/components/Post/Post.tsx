import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
} from '@material-ui/core'
import { useAppSelector } from '../../store'
import { MoreVert } from '@material-ui/icons'
import { TestArticle } from '../../utils/useTestArticle'
import { useStyles } from './style'
import { useEffect, useRef } from 'react'
import { useElementResize } from '../../utils/useResize'

interface IPostProps {
  postId: string
}

export function Post({ postId }: IPostProps) {
  const classes = useStyles()
  const profile = useAppSelector(
    (state) => state.storage.auth.profile,
  )
  const textRef= useRef(null)

  useEffect(() => {
    console.log(textRef.current!);
    // const { width, height } = useElementResize(textRef.current!)
    // console.log(width, height);
    

  }, [])
  
  return (
    <>
      <Card className={classes.card}>
        <CardHeader
          avatar={<Avatar src={profile.avatarUrl} />}
          action={
            <IconButton>
              <MoreVert></MoreVert>
            </IconButton>
          }
          title={profile.name}
          subheader="September 14, 2016"
        ></CardHeader>
        <CardMedia
          className={classes.media}
          image={profile.backgroundUrl}
          
        ></CardMedia>
        <CardContent className={classes.text}>
          <div ref={textRef}>
            <TestArticle></TestArticle>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
