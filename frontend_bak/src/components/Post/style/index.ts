import { makeStyles, Theme, createStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) => createStyles({
  card: {
    marginTop: theme.spacing(2),
    maxHeight: "1000px",
  },
  media: {
    height: '0',
    paddingTop: "56.25%", // 16:9
  },
  text: {
    fontSize: '1.2rem'
  }
}))