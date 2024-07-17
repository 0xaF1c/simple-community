import { useEffect, useState } from 'react'
import { useAuthState } from '../../utils/auth'
import { useAppSelector } from '../../store'
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  List,
  ListItem,
  Paper,
} from '@material-ui/core'
import { userDto } from '../../types'
import { useStyles } from './styles'
import { ImageContainer } from '../../components/ImageContainer/ImageContainer'
// import { TestArticle } from '../../utils/useTestArticle'

export function MeProfile() {
  const [isLogin, setIsLogin] = useState(false)
  // const [loading, setLoading] = useState(true)
  const { isLogin: getLoginState } = useAuthState()
  const profile = useAppSelector(
    (state) => state.storage.auth.profile,
  ) as userDto
  const classes = useStyles()

  useEffect(() => {
    setIsLogin(getLoginState())
  }, [setIsLogin, getLoginState])

  return (
    <>
      <Paper className={classes.paper}>
        <ImageContainer
          textProtect
          variant='top'
          src={profile.backgroundUrl}
        >
          <div>
            <Avatar className={classes.avatar} src={profile.avatarUrl} />
            <div>{profile.name}</div>
            <div>{profile.account}</div>
            <div>{profile.email}</div>
          </div>
        </ImageContainer>
        {/* <img className={classes.background} src={profile.backgroundUrl} /> */}
        {/* <Avatar
          className={classes.avatar}
          src={profile.avatarUrl}
        ></Avatar> */}
      </Paper>
      <List>
        <ListItem>asdasd</ListItem>
        <ListItem>asdasd</ListItem>
        <ListItem>asdasd</ListItem>
        <ListItem>asdasd</ListItem>
      </List>
      {/* <Card className={classes.card}>
        <CardMedia image={profile.backgroundUrl}></CardMedia>
        <CardHeader
          title={profile.name}
          subheader={profile.email}
          avatar={<Avatar src={profile.avatarUrl} />}
        ></CardHeader>
        <CardContent>
          <TestArticle></TestArticle>
        </CardContent>
      </Card> */}
    </>
  )
}
