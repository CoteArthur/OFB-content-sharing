import React, { FunctionComponent, useEffect, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import { List, ListItem, ListItemIcon, ListItemText, Grid, Container, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import TuneIcon from '@material-ui/icons/Tune';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelopeOpenText, faInfoCircle, faFileAlt, faLightbulb, faHardHat, faArchive, faPencilRuler } from '@fortawesome/free-solid-svg-icons'

const useStyles = makeStyles(() => createStyles({
		ExpansionPanelSummary: {
			background: "linear-gradient(#FFFFFF, #FFFFFF)",
			color: "#1D51BB",
		}, 
		ExpansionPanelSummaryActive: {
			background: "linear-gradient(130deg,#0BA34D, #0D7155, #0057B2)",
			color: "#FFFFFF",
		},
		content: {
			backgroundColor: '#fff',
			height: '100vh'
		},
		list: {
			maxWidth: '100%'
		}
	}),
);

export interface MenuProps {
	fetchContent: (childData: string, filter?: any) => void,
	menuFilters: (search: string, sites: string) => void
}

export interface MenuState {
	search: string,
	sites: SiteType
}

export type SiteType = {
	bauges: SiteTypeInfo,
	vercors: SiteTypeInfo,
	chartreuse: SiteTypeInfo
}

export type SiteTypeInfo = {
	site: string,
	value: boolean
}

const Menu: FunctionComponent<MenuProps> = (props: MenuProps): JSX.Element => 
{
	const classes = useStyles();
	const [expanded, setExpanded] = React.useState<string | false>(false);

	const [state, setState] = useState<MenuState>({
		search: '',
		sites: {
			bauges: {site: "Bauges", value: false},
			vercors: {site: "Vercors", value: false},
			chartreuse: {site: "Chartreuse", value: false}
		}
	});

	useEffect(() => {	
		setExpanded('actualite');
	}, [setExpanded]);

	const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean): void => {
		if (!isExpanded)
		{
			event.stopPropagation();
			event.preventDefault();
			return;
		}
		setExpanded(isExpanded ? panel : false);

		setState({
			search: '',
			sites: {
				bauges: {site: "Bauges", value: false},
				vercors: {site: "Vercors", value: false},
				chartreuse: {site: "Chartreuse", value: false}
			}
		});
		
		if(isExpanded)
			props.fetchContent(panel);
	};

	const onSearchChange = (event: any): void => 
	{
		event.persist();
		setState(prevState => ({ ...prevState, search: event.target.value }));
	}

	const onSiteChange = (event: any): void => 
	{
		event.persist();
		setState(prevState => ({ ...prevState, 
			sites: {
				...prevState.sites,
				[event.target.id]: {
					site: event.target.name,
					value: event.target.checked
				}
			}
		}));
	}
	
	const sendFilters = (): void => {
		let str = '';
		let sites = Object.entries(state.sites).map(e => e[1]).filter(e => e.value);
		for(let i = 0; i < sites.length; i++){
			if(sites[i].value){
				str += `'${sites[i].site}'`;

				if(i+1 < sites.length && sites[i+1].value)
					str += ', ';
			}
		}
		props.menuFilters(state.search, str);
	}

	return (
		<Container fixed className={classes.content}>
			<List className={classes.list}>
				<ExpansionPanel expanded={expanded === 'actualite'} onChange={handleChange('actualite')}>
					<ExpansionPanelSummary
						className={expanded === 'actualite' ? classes.ExpansionPanelSummaryActive : classes.ExpansionPanelSummary}
					>
						<Typography>
							<FontAwesomeIcon icon={faEnvelopeOpenText} style={{marginRight: '8px'}}/>
							Actualité
						</Typography>
					</ExpansionPanelSummary>

					<ExpansionPanelDetails>
						<Grid container direction="column" justify="center" alignItems="stretch">
							<TextField name="search" id="search" variant="outlined" 
							margin="normal" fullWidth label="Recherche" value={state.search}
							onChange={onSearchChange} helperText='Titre/Auteur/Année'/>

							<ExpansionPanel>
								<ExpansionPanelSummary style={{marginTop: '8px', backgroundColor: '#05836d', color: "#FFFFFF", borderRadius: 5}}>
									<Typography>Sites</Typography>
								</ExpansionPanelSummary>

								<ExpansionPanelDetails>
									<Grid container direction="column" justify="center" alignItems="flex-start">
										<FormControlLabel 
											control={<Checkbox checked={state.sites.bauges.value} onChange={onSiteChange}
											name="Bauges" id="bauges" color="primary" />}
											label="Bauges"
										/>
										<FormControlLabel 
											control={<Checkbox checked={state.sites.chartreuse.value} onChange={onSiteChange}
											name="Chartreuse" id="chartreuse" color="primary"/>}
											label="Chartreuse"
										/>
										<FormControlLabel 
											control={<Checkbox checked={state.sites.vercors.value} onChange={onSiteChange}
											name="Vercors" id="vercors" color="primary"/>}
											label="Vercors"
										/>
									</Grid>
								</ExpansionPanelDetails>
							</ExpansionPanel>
							
							<Button fullWidth variant="contained" onClick={sendFilters}
							color="primary" style={{marginTop: 8}} endIcon={<TuneIcon/>}>
								Filtrer
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
						<Grid container direction="column" justify="center" alignItems="stretch">
							<TextField name="search" variant="outlined" 
							margin="normal" fullWidth label="Recherche" value={state.search}
							onChange={onSearchChange} />

							<ExpansionPanel>
								<ExpansionPanelSummary style={{backgroundColor: "#ebdfd3", marginTop: '8px'}}>
									<Typography>Sites</Typography>
								</ExpansionPanelSummary>

								<ExpansionPanelDetails>
									<Grid container direction="column" justify="center" alignItems="flex-start">
										<FormControlLabel 
											control={<Checkbox checked={state.sites.bauges.value} onChange={onSiteChange}
											name="Bauges" id="bauges" color="primary" />}
											label="Bauges"
										/>
										<FormControlLabel 
											control={<Checkbox checked={state.sites.vercors.value} onChange={onSiteChange}
											name="Vercors" id="vercors" color="primary"/>}
											label="Vercors"
										/>
										<FormControlLabel 
											control={<Checkbox checked={state.sites.chartreuse.value} onChange={onSiteChange}
											name="Chartreuse" id="chartreuse" color="primary"/>}
											label="Chartreuse"
										/>
									</Grid>
								</ExpansionPanelDetails>
							</ExpansionPanel>

							<Button fullWidth variant="contained" onClick={sendFilters}
							color="primary" style={{marginTop: 8}}>
								Envoyer
							</Button>
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