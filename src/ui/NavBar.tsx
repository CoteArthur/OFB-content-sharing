import React, { FunctionComponent } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { AppBar, Toolbar, Fab } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser } from '@fortawesome/free-solid-svg-icons';

import { useSelector } from 'react-redux';
import { AppState } from '../';

const useStyles = makeStyles((theme: Theme) => createStyles({
	appBar: {
		background: "linear-gradient(110deg,#007734, #007734, #0057B2)",
		zIndex: theme.zIndex.drawer + 1
	},
  }),
);

export interface NavBarProps {
	openDialog: (type: string) => void
}

const NavBar: FunctionComponent<NavBarProps> = (props: NavBarProps): JSX.Element =>
{
	const userID = useSelector((state: AppState) => state.app.userID);

	const classes = useStyles();

	return (
		<AppBar position="fixed" className={classes.appBar}>
			<Toolbar>
				<img src="https://i.imgur.com/qyVxEq8.png" alt="LOGO" width="32" height="32" style={{marginRight:10}}/>
				<Typography variant="h5" noWrap style={{fontWeight:"bold", color:"#FFFFFF"}}>
					OFB
				</Typography>

				<Typography variant="h5" noWrap style={{margin:"0 auto 0 auto", fontWeight:"bold"}}>
					Réserves et territoires en gestion
				</Typography>

				<Fab disabled={!userID} size='small' color="primary" onClick={() => props.openDialog("ajout")} style={{marginRight: "10px"}}>
					<FontAwesomeIcon icon={faPlus}/>
				</Fab>

				<Fab size='small' color="primary" onClick={() => props.openDialog("user")}>
					<FontAwesomeIcon icon={faUser}/>
				</Fab>

			</Toolbar>
		</AppBar>
	);
}

export default NavBar;