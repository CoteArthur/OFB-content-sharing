import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngry } from '@fortawesome/free-solid-svg-icons'



const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: "linear-gradient(90deg,#007734, #007734, #0057B2)",
    //background: "linear-gradient(90deg,#F45265, #FCD768)",
  },
  ExpansionPanelSummary: {
    //background: "linear-gradient(130deg,#0BA34D, #0D7155, #0057B2)",
    background: "linear-gradient(90deg,#FFFFFF, #FFFFFF)",
    color: "#1D51BB",
  }, 
  ExpansionPanelSummaryActive: {
    background: "linear-gradient(130deg,#0BA34D, #0D7155, #0057B2)",
    color: "#FFFFFF",
  }, 

  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
}));

export default function App() {
  const classes = useStyles();

  const [expanded, setExpanded] = React.useState(false);
  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar} >
        <Toolbar>
          <FontAwesomeIcon className={classes.FontAwesomeIcon} icon={faAngry} size="3x" style={{marginRight:10}} />
          <Typography variant="h5" noWrap style={{fontWeight:"bold"}}>
            OFB
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />

        <List>
          <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')} >
            
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              className={expanded === 'panel1' ? classes.ExpansionPanelSummaryActive : classes.ExpansionPanelSummary}
            >
              <FontAwesomeIcon className={classes.FontAwesomeIcon} icon={faAngry} size="lg" style={{marginRight:10}} />
              <Typography className={classes.heading}>General settings</Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                  <ListItem button key={text}>
                    <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List>
            </ExpansionPanelDetails>

        </ExpansionPanel>
        </List>

        <List>
          <ExpansionPanel expanded={expanded === 'panel2'} onChange={handleChange('panel2')} >
            
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
              className={expanded === 'panel2' ? classes.ExpansionPanelSummaryActive : classes.ExpansionPanelSummary}
            >
              <FontAwesomeIcon className={classes.FontAwesomeIcon} icon={faAngry} size="lg" style={{marginRight:10}} />
              <Typography className={classes.heading}>General settings</Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                  <ListItem button key={text}>
                    <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List>
            </ExpansionPanelDetails>

        </ExpansionPanel>
        </List>

        <List>
          <ExpansionPanel expanded={expanded === 'panel3'} onChange={handleChange('panel3')} >
            
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3bh-content"
              id="panel3bh-header"
              className={expanded === 'panel3' ? classes.ExpansionPanelSummaryActive : classes.ExpansionPanelSummary}
            >
              <FontAwesomeIcon className={classes.FontAwesomeIcon} icon={faAngry} size="lg" style={{marginRight:10}} />
              <Typography className={classes.heading}>General settings</Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                  <ListItem button key={text}>
                    <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List>
            </ExpansionPanelDetails>

        </ExpansionPanel>
        </List>

        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
          facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
          gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
          donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
          adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
          Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
          imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
          arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
          donec massa sapien faucibus et molestie ac.
        </Typography>
        <FontAwesomeIcon className={classes.FontAwesomeIcon} icon={faAngry} size="10x" />
        <Typography paragraph>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
          facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
          tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
          consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed
          vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In
          hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et
          tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin
          nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas
          accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
        </Typography>
      </main>
    </div>
  );
}