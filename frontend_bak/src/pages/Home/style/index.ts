import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useStyles = makeStyles(
  (theme: Theme) => createStyles({
    root: {
      padding: theme.spacing(3),
      marginTop: theme.spacing(3)
    }
  })
)