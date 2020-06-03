import React, { FunctionComponent, useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import { List, ListItem, ListItemIcon, ListItemText, Grid, Container, Select, MenuItem, /*Button,*/ TextField, Button } from '@material-ui/core';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelopeOpenText, faInfoCircle, faFileAlt, faLightbulb, faHardHat, faArchive, faPencilRuler } from '@fortawesome/free-solid-svg-icons'

const useStyles = makeStyles((theme: Theme) => createStyles({
		ExpansionPanelSummary: {
			background: "linear-gradient(#FFFFFF, #FFFFFF)",
			color: "#1D51BB",
			fontWeight:"bold",
		}, 
		ExpansionPanelSummaryActive: {
			background: "linear-gradient(130deg,#0BA34D, #0D7155, #0057B2)",
			color: "#FFFFFF",
		},
		content: {
			backgroundColor: '#fff',
			//boxShadow: '3px 0px 5px 0px rgba(0,0,0,0.3)',
			height: '100vh'
		},
		list: {
			maxWidth: '100%'
		}
	}),
);

export interface MenuProps {
	fetchContent: (childData: string, filter?: any) => void
}

const Menu: FunctionComponent<MenuProps> = (props: MenuProps): JSX.Element => 
{
	const classes = useStyles();
	const [expanded, setExpanded] = React.useState<string | false>(false);

	useEffect(() => {	
		setExpanded('actualite');
	}, [setExpanded]);

	const handleChange = (panel: string, filter?: any) => (event: React.ChangeEvent<{}>, isExpanded: boolean): void => {
		if (!isExpanded)
		{
			event.stopPropagation();
			event.preventDefault();
			return;
		}
		setExpanded(isExpanded ? panel : false);
		
		if(isExpanded)
			props.fetchContent(panel);
	};

	const [state, setState] = useState<{site?: string, search?: string}>({
		site: "none",
		search: "",
	});

	const onSiteChange = (event: any): void => 
	{
        event.persist();
		setState(prevState => ({ ...prevState, site: event.target.value as string}));
	}
	
	const onSearchChange = (event: any): void => 
	{
		event.persist();
        setState(prevState => ({ ...prevState, search: event.target.value }));
    }

	return (
		<Container fixed className={classes.content}>
			<List className={classes.list}>
				<ExpansionPanel expanded={expanded === 'actualite'} onChange={handleChange('actualite')}>
					<ExpansionPanelSummary
						aria-controls="actualitebh-content"
						id="actualitebh-header"
						className={expanded === 'actualite' ? classes.ExpansionPanelSummaryActive : classes.ExpansionPanelSummary}
					>
						<FontAwesomeIcon icon={faEnvelopeOpenText} size="lg" style={{margin:"auto 10 auto 0"}} />
						<Typography>Actualité</Typography>
					</ExpansionPanelSummary>

					<ExpansionPanelDetails>
						<Grid container direction="row" justify="center" alignItems="center">
							<TextField name="search" id="search" variant="outlined" 
							margin="normal" required fullWidth label="Search" 
							onChange={onSearchChange} />
							<Button fullWidth variant="contained" onClick={()=>props.fetchContent('actualite', {search: state.search})}
							color="primary" style={{marginTop: 8}}>
								Envoyer
							</Button>
						</Grid>
					</ExpansionPanelDetails>

				</ExpansionPanel>
			</List>

			<List className={classes.list}>
				<ExpansionPanel expanded={expanded === 'panel2'} onChange={handleChange('panel2')} >
					
					<ExpansionPanelSummary
						aria-controls="panel2bh-content"
						id="panel2bh-header"
						className={expanded === 'panel2' ? classes.ExpansionPanelSummaryActive : classes.ExpansionPanelSummary}
					>
						<FontAwesomeIcon icon={faInfoCircle} size="lg" style={{margin:"auto 10 auto 0"}} />
						<Typography>Présentation des sites</Typography>
					</ExpansionPanelSummary>

				</ExpansionPanel>
			</List>

			<List className={classes.list}>
				<ExpansionPanel expanded={expanded === 'crterrain'} onChange={handleChange('crterrain')} >
					
					<ExpansionPanelSummary
						aria-controls="crterrainbh-content"
						id="crterrainbh-header"
						className={expanded === 'crterrain' ? classes.ExpansionPanelSummaryActive : classes.ExpansionPanelSummary}
					>
							<FontAwesomeIcon icon={faFileAlt} size="lg" style={{margin:"auto 10 auto 0"}}/>
							<Typography>Comptes-rendus terrain</Typography>
					</ExpansionPanelSummary>

					<ExpansionPanelDetails>
						<Grid container direction="row" justify="center" alignItems="center">
							<Select name="site" id="site" variant="outlined" 
							required fullWidth value={state.site} onChange={onSiteChange} >
								<MenuItem value="none" disabled>Site *</MenuItem>
								<MenuItem value="">Tous</MenuItem>
								<MenuItem value="Bauges">Bauges</MenuItem>
								<MenuItem value="Vercors">Vercors</MenuItem>
								<MenuItem value="Chartreuse">Chartreuse</MenuItem>
							</Select>
							{/* <Button fullWidth variant="contained" onClick={()=>props.onFilterclick(state.site)}
							color="primary" style={{marginTop: 8}}>
								Envoyer
							</Button> */}
						</Grid>
					</ExpansionPanelDetails>

				</ExpansionPanel>
			</List>

			<List className={classes.list}>
				<ExpansionPanel expanded={expanded === 'panel4'} onChange={handleChange('panel4')} >
					
					<ExpansionPanelSummary
						aria-controls="panel4bh-content"
						id="panel4bh-header"
						className={expanded === 'panel4' ? classes.ExpansionPanelSummaryActive : classes.ExpansionPanelSummary}
					>
							<FontAwesomeIcon icon={faPencilRuler} size="lg" style={{margin:"auto 10 auto 0"}}/>
							<Typography>Comptes-rendus police</Typography>
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

			<List className={classes.list}>
				<ExpansionPanel expanded={expanded === 'connaissancesproduites'} onChange={handleChange('connaissancesproduites')} >
					
					<ExpansionPanelSummary
						aria-controls="connaissancesproduitesbh-content"
						id="connaissancesproduitesbh-header"
						className={expanded === 'connaissancesproduites' ? classes.ExpansionPanelSummaryActive : classes.ExpansionPanelSummary}
					>
						<FontAwesomeIcon icon={faLightbulb} size="lg" style={{margin:"auto 10 auto 0"}}/>
						<Typography>Connaissances produites</Typography>
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

			<List className={classes.list}>
				<ExpansionPanel expanded={expanded === 'panel6'} onChange={handleChange('panel6')} >
					
					<ExpansionPanelSummary
						aria-controls="panel6bh-content"
						id="panel6bh-header"
						className={expanded === 'panel6' ? classes.ExpansionPanelSummaryActive : classes.ExpansionPanelSummary}
					>
						<FontAwesomeIcon icon={faHardHat} size="lg" style={{margin:"auto 10 auto 0"}}/>
						<Typography>Opérations de gestion</Typography>
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

			<List className={classes.list}>
				<ExpansionPanel expanded={expanded === 'panel7'} onChange={handleChange('panel7')} >
					
					<ExpansionPanelSummary
						aria-controls="panel7bh-content"
						id="panel7bh-header"
						className={expanded === 'panel7' ? classes.ExpansionPanelSummaryActive : classes.ExpansionPanelSummary}
					>
						<FontAwesomeIcon icon={faArchive} size="lg" style={{margin:"auto 10 auto 0"}}/>
						<Typography>Archives</Typography>
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
		</Container>
	);
}

export default Menu;