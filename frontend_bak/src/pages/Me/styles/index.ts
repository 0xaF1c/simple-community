import { createStyles, makeStyles, Theme } from "@material-ui/core";

const avatarSize = 100
const backgroundHeight = 300

export const useStyles = makeStyles((theme: Theme) => createStyles({
  paper: {
    // padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    boxShadow: theme.shadows[1],
    overflow: 'hidden',
  },
  avatar: {
    width: `${avatarSize}px`,
    height: `${avatarSize}px`,
  },
  background: {
    width: '100%',
    height: `${backgroundHeight}px`,
    position: 'relative',
    objectFit: 'cover',
  }
}))