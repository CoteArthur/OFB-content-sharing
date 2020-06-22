import React, { FunctionComponent, useEffect, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import { Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, IconButton, Drawer, Toolbar, FormControlLabel, Checkbox } from '@material-ui/core';
import TuneIcon from '@material-ui/icons/Tune';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelopeOpenText, faInfoCircle, faFileAlt, faLightbulb, faHardHat, faPencilRuler, faTimesCircle, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import emptySites from './emptySites.json';
import SiteList from './SiteList';
import emptyThemes from './emptyThemes.json';

const useStyles = makeStyles(() => createStyles({
		ExpansionPanelSummary: {
			background: "linear-gradient(#FFFFFF, #FFFFFF)",
			color: "#1D51BB"
		}, 
		ExpansionPanelSummaryActive: {
			background: "linear-gradient(130deg,#0BA34D, #0D7155, #0057B2)",
			color: "#FFFFFF"
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
	menuFilters: (search: string, sites: string, year: string, auteur: string, themes: string) => void
}

export interface MenuState {
	search: string,
	sites: SiteType,
	themes: ThemeType,
	year: string,
	auteur: string,
}

export type SiteType = {
	bauges: BooleanStringInfo,
	belledonne: BooleanStringInfo,
	caroux: BooleanStringInfo,
	chambord: BooleanStringInfo,
	chateauvilain: BooleanStringInfo,
	chize: BooleanStringInfo,
	grandbirieux: BooleanStringInfo,
	lapetitepierre: BooleanStringInfo,
	orlu: BooleanStringInfo,
	troisfontaines: BooleanStringInfo
}

export type ThemeType = {
	climat: BooleanStringInfo,
	activiteshumaines: BooleanStringInfo,
	utilisationspatiale: BooleanStringInfo,
	fonctionnementdemographique: BooleanStringInfo,
	regimealimentaire: BooleanStringInfo,
	suivisanitaire: BooleanStringInfo,

	suivisbiodiversite: BooleanStringInfo,
	travauxinterventions: BooleanStringInfo,
	gestionagricolepastorale: BooleanStringInfo,
	gestionforestiere: BooleanStringInfo,
	valorisationsformations: BooleanStringInfo
}

export type BooleanStringInfo = {
	label: string,
	value: boolean
}

const Menu: FunctionComponent<MenuProps> = (props: MenuProps): JSX.Element => 
{
	const classes = useStyles();
	const [expanded, setExpanded] = React.useState<string | false>(false);

	const [state, setState] = useState<MenuState>({
		search: '',
		sites: emptySites,
		themes: emptyThemes,
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
			themes: emptyThemes,
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
					label: event.target.name,
					value: event.target.checked
				}
			}
		}));
	}
	
	const onThemeChange = (event: any): void => 
	{
		event.persist();
		setState(prevState => ({ ...prevState, 
			themes: {
				...prevState.themes,
				[event.target.id]: {
					label: event.target.name,
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
				strSites += `'${sites[i].label}'`;

				if(i+1 < sites.length && sites[i+1].value)
					strSites += ', ';
			}
		}

		let strThemes = '';
		let themes = Object.entries(state.themes).map(e => e[1]).filter(e => e.value);
		for(let i = 0; i < themes.length; i++){
			if(themes[i].value){
				strThemes += `'${themes[i].label}'`;

				if(i+1 < themes.length && themes[i+1].value)
					strThemes += ', ';
			}
		}
		props.menuFilters(state.search, strSites, state.year, state.auteur, strThemes);
	}

	return (
		<Drawer variant="permanent">
			<Toolbar/>
			<div style={{width: '271px'}}>
				<ExpansionPanel expanded={expanded === 'actualite'} onChange={handleChange('actualite')} style={{marginTop: '8px'}}>
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
							<TextField name="search" variant="outlined" 
							fullWidth label="Recherche" value={state.search}
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

							<TextField name="auteur" variant="outlined" 
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
								Valider
							</Button>
						</Grid>
					</ExpansionPanelDetails>

				</ExpansionPanel>

				<ExpansionPanel expanded={expanded === 'presentationSites'} onChange={handleChange('presentationSites')} >
					<ExpansionPanelSummary
						className={expanded === 'presentationSites' ? classes.ExpansionPanelSummaryActive : classes.ExpansionPanelSummary}
					>
						<Typography>
							<FontAwesomeIcon icon={faInfoCircle} style={{marginRight: '8px'}}/>
							Présentation des sites
						</Typography>
					</ExpansionPanelSummary>
				</ExpansionPanel>

				<ExpansionPanel expanded={expanded === 'crterrain'} onChange={handleChange('crterrain')} >
					<ExpansionPanelSummary
						className={expanded === 'crterrain' ? classes.ExpansionPanelSummaryActive : classes.ExpansionPanelSummary}
					>
							<Typography>
								<FontAwesomeIcon icon={faFileAlt} style={{marginRight: '8px'}}/>
								Comptes-rendus terrain
							</Typography>
					</ExpansionPanelSummary>

					<ExpansionPanelDetails>
						<Grid container direction="column" justify="center" alignItems="stretch">
							<TextField name="search" variant="outlined" 
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

							<TextField name="auteur" variant="outlined" 
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
								Valider
							</Button>
						</Grid>
					</ExpansionPanelDetails>

				</ExpansionPanel>

				<ExpansionPanel expanded={expanded === 'crpolice'} onChange={handleChange('crpolice')} >
					<ExpansionPanelSummary
						className={expanded === 'crpolice' ? classes.ExpansionPanelSummaryActive : classes.ExpansionPanelSummary}
					>
							<Typography>
								<FontAwesomeIcon icon={faPencilRuler} style={{marginRight: '8px'}}/>
								Comptes-rendus Police
							</Typography>
					</ExpansionPanelSummary>

					<ExpansionPanelDetails>
						<Grid container direction="column" justify="center" alignItems="stretch">
							<TextField name="search" variant="outlined" 
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

							<TextField name="auteur" variant="outlined" 
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
								Valider
							</Button>
						</Grid>
					</ExpansionPanelDetails>
				</ExpansionPanel>

				<ExpansionPanel expanded={expanded === 'connaissancesproduites'} onChange={handleChange('connaissancesproduites')} >
					<ExpansionPanelSummary
						className={expanded === 'connaissancesproduites' ? classes.ExpansionPanelSummaryActive : classes.ExpansionPanelSummary}
					>
						<Typography>
							<FontAwesomeIcon icon={faLightbulb} style={{marginRight: '8px'}}/>
							Connaissances produites
						</Typography>
					</ExpansionPanelSummary>

					<ExpansionPanelDetails>
						<Grid container direction="column" justify="center" alignItems="stretch">
							<TextField name="search" variant="outlined" 
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

							<TextField name="auteur" variant="outlined" 
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
							
							<ExpansionPanel elevation={0} variant="outlined" className={classes.formExpansionPanel}>
								<ExpansionPanelSummary expandIcon={<FontAwesomeIcon icon={faCaretDown} size="xs"/>}
								className={classes.formExpansionPanelSummary}>
									<Typography>Thèmes</Typography>
								</ExpansionPanelSummary>

								<ExpansionPanelDetails>
									<Grid container direction="column" justify="center" alignItems="flex-start">
										<FormControlLabel 
											control={<Checkbox checked={state.themes.activiteshumaines.value} onChange={onThemeChange}
											name="Activités humaines" id="activiteshumaines" color="primary" />}
											label="Activités humaines"
										/>
										<FormControlLabel 
											control={<Checkbox checked={state.themes.climat.value} onChange={onThemeChange}
											name="Climat" id="climat" color="primary" />}
											label="Climat"
										/>
										<FormControlLabel 
											control={<Checkbox checked={state.themes.fonctionnementdemographique.value} onChange={onThemeChange}
											name="Fonctionnement démographique" id="fonctionnementdemographique" color="primary" />}
											label="Fonctionnement démographique"
										/>
										<FormControlLabel 
											control={<Checkbox checked={state.themes.regimealimentaire.value} onChange={onThemeChange}
											name="Régime alimentaire" id="regimealimentaire" color="primary" />}
											label="Régime alimentaire"
										/>
										<FormControlLabel 
											control={<Checkbox checked={state.themes.suivisanitaire.value} onChange={onThemeChange}
											name="Suivi sanitaire" id="suivisanitaire" color="primary" />}
											label="Suivi sanitaire"
										/>
										<FormControlLabel 
											control={<Checkbox checked={state.themes.utilisationspatiale.value} onChange={onThemeChange}
											name="Utilisation spatiale" id="utilisationspatiale" color="primary" />}
											label="Utilisation spatiale"
										/>
									</Grid>
								</ExpansionPanelDetails>
							</ExpansionPanel>
							
							<Button fullWidth variant="contained" onClick={sendFilters}
							color="primary" style={{marginTop: 8}} endIcon={<TuneIcon/>}>
								Valider
							</Button>
						</Grid>
					</ExpansionPanelDetails>
				</ExpansionPanel>

				<ExpansionPanel expanded={expanded === 'operationsgestion'} onChange={handleChange('operationsgestion')} >
					<ExpansionPanelSummary
						className={expanded === 'operationsgestion' ? classes.ExpansionPanelSummaryActive : classes.ExpansionPanelSummary}
					>
						<Typography>
							<FontAwesomeIcon icon={faHardHat} style={{marginRight: '8px'}}/>
							Opérations de gestion
						</Typography>
					</ExpansionPanelSummary>

					<ExpansionPanelDetails>
						<Grid container direction="column" justify="center" alignItems="stretch">
							<TextField name="search" variant="outlined" 
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

							<TextField name="auteur" variant="outlined" 
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
							
							<ExpansionPanel elevation={0} variant="outlined" className={classes.formExpansionPanel}>
								<ExpansionPanelSummary expandIcon={<FontAwesomeIcon icon={faCaretDown} size="xs"/>}
								className={classes.formExpansionPanelSummary}>
									<Typography>Thèmes</Typography>
								</ExpansionPanelSummary>

								<ExpansionPanelDetails>
									<Grid container direction="column" justify="center" alignItems="flex-start">
										<FormControlLabel 
											control={<Checkbox checked={state.themes.gestionagricolepastorale.value} onChange={onThemeChange}
											name="Gestion agricole, pastorale" id="gestionagricolepastorale" color="primary" />}
											label="Gestion agricole, pastorale"
										/>
										<FormControlLabel
											control={<Checkbox checked={state.themes.gestionforestiere.value} onChange={onThemeChange}
											name="Gestion forestière" id="gestionforestiere" color="primary" />}
											label="Gestion forestière"
										/>
										<FormControlLabel 
											control={<Checkbox checked={state.themes.suivisbiodiversite.value} onChange={onThemeChange}
											name="Suivis Biodiversité" id="suivisbiodiversite" color="primary" />}
											label="Suivis Biodiversité"
										/>
										<FormControlLabel 
											control={<Checkbox checked={state.themes.travauxinterventions.value} onChange={onThemeChange}
											name="Travaux, Interventions" id="travauxinterventions" color="primary" />}
											label="Travaux, Interventions"
										/>
										<FormControlLabel 
											control={<Checkbox checked={state.themes.valorisationsformations.value} onChange={onThemeChange}
											name="Valorisations, Formations" id="valorisationsformations" color="primary" />}
											label="Valorisations, Formations"
										/>
									</Grid>
								</ExpansionPanelDetails>
							</ExpansionPanel>
							
							<Button fullWidth variant="contained" onClick={sendFilters}
							color="primary" style={{marginTop: 8}} endIcon={<TuneIcon/>}>
								Valider
							</Button>
						</Grid>
					</ExpansionPanelDetails>
				</ExpansionPanel>
			</div>
		</Drawer>
	);
}

export default Menu;