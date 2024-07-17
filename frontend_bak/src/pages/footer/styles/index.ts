import { Theme, createStyles, makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) => createStyles({
  footer: {
    bottom: 0,
  },
  header: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  content: {
    overflow: 'auto',
  },
  drawer: {}
}))