import React, {useContext, useState, useRef, useEffect} from "react";
import { EtherchestAPI } from "../service/EtherchestAPI";
import {StateContext} from "../App";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { Parallax } from 'react-parallax';
import TradingFloor from "./TradingFloor";

const useStyles = makeStyles(theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    fontFamily: '"Jua", sans-serif',
  },
  background: {
    backgroundImage: 'url(https://i.imgur.com/ET4nTp7.jpg)',
    backgroundColor: "#DFB17B",
  },
  font: {
    fontFamily: '"Jua", sans-serif',
  },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'left',
      color: theme.palette.text.secondary,
      whiteSpace: 'wrap',
      marginBottom: theme.spacing(3),
      backgroundColor: "Transparent",
    },
    paperTransparent: {
      padding: theme.spacing(1),
      textAlign: 'left',
      color: theme.palette.text.secondary,
      whiteSpace: 'wrap',
      marginBottom: theme.spacing(3),
      backgroundColor: "Transparent",
    },
}));

const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#000000',
    color: '#DFB17B',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

const etherchestApi = new EtherchestAPI();

export default function GemGifting() {
  const classes = useStyles();
  const {username} = useContext(StateContext);
  const [gem, setgem] = useState();
  const [to, setTo] = useState("");
  const [validatedTo, setValidatedTo] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {steemConnectAPI} = useContext(StateContext);
  const growl = useRef(null);
  const gemBackground = "https://i.imgur.com/z2A9PtG.jpg";

  const [usergems, setUsergems] = useState([]);

  useEffect(() => {
    etherchestApi.getUserGarden(username).then(garden => {
      setUsergems(garden.availablegems);
    });
  }, [username]);

  const gifted = error => {
    if (error) {
      growl.current.show({
        severity: "error",
        summary: "Sorry, something went wrong",
        detail: "Please try again"
      });
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    etherchestApi.steemUserExists(to).then(username => {
      if (username && username === to) {
        setValidatedTo(username);
      } else {
        setValidatedTo();
      }
    });
  }, [to]);

  const handleSubmit = async () => {
    if (validatedTo && username && gem) {
      setIsSubmitting(true);

      const custom_json_id = "qwoyn_give_gem";
      const custom_JSON = JSON.stringify({
        to: validatedTo,
        gem: gem.strain,
        qual: gem.xp
      });

      steemConnectAPI.customJson(
        [],
        [username],
        custom_json_id,
        custom_JSON,
        gifted
      );
    }
  };

  let buttonLabel = "Gift";
  if (isSubmitting) buttonLabel = "Gifting";
  if (!username) buttonLabel = "Please Login to gift gems";

  return (
    <Parallax blur={1} bgImage={gemBackground} strength={1000}>
      <TradingFloor />
      {/*
    <>
      <Growl ref={growl} />
      <Grid container spacing={1}>
        <Grid item xs={3}>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paperTransparent}>
          <HtmlTooltip
          title={
            <React.Fragment>
            <em><a href="/market/gembank">{"Do you have extra gems?"}</a></em> <b>{"Click Gift gems to get started"}</b>
            </React.Fragment>
          }
          placement="top"
          TransitionComponent={Zoom}
          >
            <ExpansionPanel className={classes.background}>
              <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              >
                <Typography className={classes.heading}><font color="DFB17B">Send gems</font></Typography>
              </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <InputText
                className="form-input"
                value={to}
                onChange={e => setTo(e.target.value.trim())}
                placeholder="HIVE user to send to"
              />
            </ExpansionPanelDetails>
            <ExpansionPanelDetails>
            {validatedTo && (
              <div>
                <h2>{validatedTo}</h2>
                <img
                  alt="avatar"
                  src={`https://steemitimages.com/u/${validatedTo}/avatar/small`}
                />
              </div>
            )}
            </ExpansionPanelDetails>
            <ExpansionPanelDetails>
              <Dropdown
                className="form-input"
                disabled={isSubmitting || !username}
                optionLabel="name"
                value={gem}
                id="name"
                options={usergems.map(gem => ({
                  ...gem,
                  name: `${gemNames[gem.strain]} - ${gem.xp} XP`
                }))}
                style={{width: "100%"}}
                onChange={e => {
                  setgem(e.value);
                }}
                placeholder="Choose a gem..."
              />
            </ExpansionPanelDetails>
            <ExpansionPanelDetails>
              <Button
                disabled={isSubmitting || !username || !validatedTo | !gem}
                label={buttonLabel}
                onClick={handleSubmit}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </HtmlTooltip>
      </Paper>
      <Paper className={classes.paper}>
      <br/>
      <HtmlTooltip
      title={
        <React.Fragment>
        <em><a href="/market/gembank">{"Do you have extra Polen?"}</a></em> <b>{"Click Gift Pollen to get started"}</b>
        </React.Fragment>
      }
      placement="top"
      TransitionComponent={Zoom}
      >
      <ExpansionPanel className={classes.background}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}><font color="DFB17B">Send Pollen</font></Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        <InputText
          className="form-input"
          value={to}
          onChange={e => setTo(e.target.value.trim())}
          placeholder="HIVE user to send to"
        />
        </ExpansionPanelDetails>
        <ExpansionPanelDetails>
        {validatedTo && (
          <div>
            <h2>{validatedTo}</h2>
            <img
              alt="avatar"
              src={`https://steemitimages.com/u/${validatedTo}/avatar/small`}
            />
          </div>
        )}
        </ExpansionPanelDetails>
        <ExpansionPanelDetails>
          <Dropdown
            className="form-input"
            disabled={isSubmitting || !username}
            optionLabel="name"
            value={gem}
            id="name"
            placeholder="Choose Pollen..."
          />
        </ExpansionPanelDetails>
        <ExpansionPanelDetails>
          <Button
            label="Coming Soon"
          />
      </ExpansionPanelDetails>
    </ExpansionPanel>
    </HtmlTooltip>
  </Paper>
</Grid>
</Grid>
</>
        */}
</Parallax>
  );
}
