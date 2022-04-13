import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  root: {
    display: "inline-block",
    width: "100%",
    height: "100%",
    borderBottom: "black solid 1px",
  },
  left: {
    display: "inline-block",
    // width: "100px",
    // backgroundColor: "blue",
    height: "100%",
    verticalAlign: "middle",
    // textAlign: "center",
  },
  middle: {
    display: "inline-block",
    // width: "calc(100% - 200px)",
    // backgroundColor: "yellow",
    height: "100%",
    verticalAlign: "middle",
    textAlign: "center",
  },
  right: {
    display: "inline-block",
    // width: "100px",
    // backgroundColor: "purple",
    height: "100%",
    verticalAlign: "middle",
    textAlign: "center",
  },
  imageContainer: {
    display: "inline-block",

    marginLeft: 40,
    marginTop: 10,
    // left: 30,
  },
  title: {
    display: "inline-block",
    // verticalAlign: "middle",
    // height: "100%",
    // textAlign: "center",
    fontSize: "24px",
    marginLeft: 20,
    position: "relative",
    bottom: 5,
    fontWeight: "600",
  },
});
const Header = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <div className={classes.imageContainer}>
          <img alt="" width="100" src="akf-logo.png" />
        </div>
        <div className={classes.title}>
          BUILDING ENERGY CARBON PROJECTION TOOL
        </div>
      </div>
      <div className={classes.middle}></div>
      <div className={classes.right}></div>
    </div>
  );
};
export { Header };