// import { useTranslation } from 'react-i18next'
import { Paper } from '@material-ui/core'
import { useStyles } from './style'
import { Post } from '../../components/Post/Post'

export function Home() {
  // const { t } = useTranslation()
  const classes = useStyles()

  return (
    <Post postId='329c9c90-30f7-4742-b990-902e6ec2eb05'></Post>
    // <Paper className={classes.root} elevation={2}>
    // </Paper>
  )
}
