import React, { FunctionComponent, useEffect, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import { List, ListItem, ListItemIcon, ListItemText, Grid, Container, TextField, Button, FormControl, InputLabel, Select, MenuItem, IconButton } from '@material-ui/core';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import TuneIcon from '@material-ui/icons/Tune';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelopeOpenText, faInfoCircle, faFileAlt, faLightbulb, faHardHat, faArchive, faPencilRuler, faTimesCircle, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import emptySites from './emptySites.json';
import SiteList from './SiteList';

const useStyles = makeStyles(() => createStyles({
		ExpansionPanelSummary: {
			background: "linear-gradient(#FFFFFF, #FFFFFF)",
			color: "#1D51BB",
			borderRadius: 5
		}, 
		ExpansionPanelSummaryActive: {
			background: "linear-gradient(130deg,#0BA34D, #0D7155, #0057B2)",
			color: "#FFFFFF",
			borderRadius: 5
		},
		content: {
			backgroundColor: '#fff',
			height: '100vh'
		},
		list: {
			maxWidth: '100%'
		},
		formExpansionPanel: {
			marginTop: '8px',
			borderColor: '#C3C3C3',
			borderRadius: 5,
			"&:hover": {
				borderColor: '#212121',
			  },
		},
		formExpansionPanelSummary: {
			height: 0,
			color: '#777777',
			paddingLeft: "12px",
			paddingRight: "12px"
		},
	}),
);

export interface MenuProps {
	fetchContent: (childData: string, filter?: any) => void,
	menuFilters: (search: string, sites: string, year: string, auteur: string) => void
}

export interface MenuState {
	search: string,
	sites: SiteType,
	year: string,
	auteur: string,
}

export type SiteType = {
	bauges: SiteTypeInfo,
	belledonne: SiteTypeInfo,
	caroux: SiteTypeInfo,
	chambord: SiteTypeInfo,
	chateauvilain: SiteTypeInfo,
	chize: SiteTypeInfo,
	grandbirieux: SiteTypeInfo,
	lapetitepierre: SiteTypeInfo,
	orlu: SiteTypeInfo,
	troisfontaines: SiteTypeInfo
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
		sites: emptySites,
		year: '',
		auteur: ''
	});

	useEffect(() => {
		setExpanded('actualite');
	}, [setExpanded]);

	const generateYearArray = (): number[] => {
		let yearArray: number[] = []
		let currYear = (new Date().getFullYear());
		for(let i = currYear; i >= (currYear - 10); i--){
			yearArray.push(i);
		}
		return yearArray;
	}
	const yearArray = generateYearArray();

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
			sites: emptySites,
			year: '',
			auteur: ''
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

	const onYearChange = (event: any): void => 
	{
		event.persist();
		setState(prevState => ({ ...prevState, year: event.target.value}));
	}

	const onAuteurChange = (event: any): void => 
	{
		event.persist();
		setState(prevState => ({ ...prevState, auteur: event.target.value }));
	}
	
	const sendFilters = (): void => {
		let strSites = '';
		let sites = Object.entries(state.sites).map(e => e[1]).filter(e => e.value);
		for(let i = 0; i < sites.length; i++){
			if(sites[i].value){
				strSites += `'${sites[i].site}'`;

				if(i+1 < sites.length && sites[i+1].value)
					strSites += ', ';
			}
		}
		props.menuFilters(state.search, strSites, state.year, state.auteur);
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
							Actualités
						</Typography>
					</ExpansionPanelSummary>

					<ExpansionPanelDetails>
						<Grid container direction="column" justify="center" alignItems="stretch">
							<TextField name="search" id="search" variant="outlined" 
							fullWidth label="Recherche" value={state.search} helperText="Titre, Mots clés"
							onChange={onSearchChange}
							InputProps={{ 
								endAdornment:
									(state.search !== '' ? (
										<IconButton size="small" style={{marginRight: 0}} 
										onClick={() => setState(prevState => ({...prevState, search: ''}))}>
											<FontAwesomeIcon icon={faTimesCircle} size="sm"/>
										</IconButton>
									) : null)
							}}/>

							<TextField name="auteur" id="auteur" variant="outlined" 
							fullWidth label="Auteur" value={state.auteur} helperText="Nom, Prénom"
							onChange={onAuteurChange} style={{marginTop: '8px'}}
							InputProps={{ 
								endAdornment:
									(state.auteur !== '' ? (
										<IconButton size="small"
										onClick={() => setState(prevState => ({...prevState, auteur: ''}))}>
											<FontAwesomeIcon icon={faTimesCircle} size="sm"/>
										</IconButton>
									) : null)
							}}/>

							<FormControl variant="outlined" fullWidth style={{marginTop: '8px'}}>
								<InputLabel id="labelSelectYear">Année</InputLabel>
								<Select name="year" id="year" labelId="labelSelectYear" label="Année"
								value={state.year} onChange={onYearChange}>
									<MenuItem value={''}><em>Vide</em></MenuItem>
									{yearArray.map(row => (
										<MenuItem value={row} key={row}>{row}</MenuItem>
									))}
								</Select>
							</FormControl>

							<ExpansionPanel elevation={0} variant="outlined" className={classes.formExpansionPanel}>
								<ExpansionPanelSummary expandIcon={<FontAwesomeIcon icon={faCaretDown} size="xs"/>}
								className={classes.formExpansionPanelSummary}>
									<Typography>Sites</Typography>
								</ExpansionPanelSummary>

								<ExpansionPanelDetails>
									<SiteList sites={state.sites} onSiteChange={onSiteChange}/>
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
										{/* <FormControlLabel 
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
										/> */}
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