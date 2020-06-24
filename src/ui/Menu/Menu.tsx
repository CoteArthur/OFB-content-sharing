import React, { FunctionComponent, useEffect, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import { Grid, Button, Drawer, Toolbar, FormControlLabel, Checkbox } from '@material-ui/core';
import TuneIcon from '@material-ui/icons/Tune';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelopeOpenText, faInfoCircle, faFileAlt, faLightbulb, faHardHat, faPencilRuler, faCaretDown } from '@fortawesome/free-solid-svg-icons'

import emptySites from './Jsons/emptySites.json';
import emptyThemes from './Jsons/emptyThemes.json';
import {ThemeType, SiteType} from './CustomTypes';
import MenuForm from './MenuForm';

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
		}
	}),
);

export interface MenuProps {
	fetchContent: (table: string, filter?: any) => void,
	menuFilters: (search: string, sites: string, year: string, auteur: string, themes: string) => void
}

export interface MenuState {
	search: string,
	sites: SiteType,
	sitesExpanded: boolean,
	themes: ThemeType,
	themesExpanded: boolean,
	year: string,
	auteur: string,
}

const Menu: FunctionComponent<MenuProps> = (props: MenuProps): JSX.Element =>
{
	const classes = useStyles();
	const [expanded, setExpanded] = React.useState<string | false>(false);

	const [state, setState] = useState<MenuState>({
		search: '',
		sites: emptySites,
		sitesExpanded: false,
		themes: emptyThemes,
		themesExpanded: false,
		year: '',
		auteur: ''
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
			sites: emptySites,
			sitesExpanded: false,
			themes: emptyThemes,
			themesExpanded: false,
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

	const emptySearch = (): void =>
	{
		setState(prevState => ({...prevState, search: ''}));
	}

	const onAuteurChange = (event: any): void =>
	{
		event.persist();
		setState(prevState => ({ ...prevState, auteur: event.target.value }));
	}

	const emptyAuteur = (): void =>
	{
		setState(prevState => ({...prevState, auteur: ''}));
	}

	const onYearChange = (event: any): void =>
	{
		event.persist();
		setState(prevState => ({ ...prevState, year: event.target.value}));
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

	const onSitesExpandedChange = (): void =>
	{
		setState(prevState => ({ ...prevState, sitesExpanded: !state.sitesExpanded}));
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
		<Drawer variant='permanent'>
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
							<MenuForm search={state.search} onSearchChange={onSearchChange} emptySearch={emptySearch}
								auteur={state.auteur} onAuteurChange={onAuteurChange} emptyAuteur={emptyAuteur}
								year={state.year} onYearChange={onYearChange}
								sites={state.sites} onSiteChange={onSiteChange}
								sitesExpanded={state.sitesExpanded} onSitesExpandedChange={onSitesExpandedChange}
							/>
							<Button fullWidth variant="contained" onClick={sendFilters}
							color="primary" style={{marginTop: 8}} endIcon={<TuneIcon/>}>
								Valider
							</Button>
						</Grid>
					</ExpansionPanelDetails>

				</ExpansionPanel>

				<ExpansionPanel expanded={expanded === 'presentationsites'} onChange={handleChange('presentationsites')} >
					<ExpansionPanelSummary
						className={expanded === 'presentationsites' ? classes.ExpansionPanelSummaryActive : classes.ExpansionPanelSummary}
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
							<MenuForm search={state.search} onSearchChange={onSearchChange} emptySearch={emptySearch}
								auteur={state.auteur} onAuteurChange={onAuteurChange} emptyAuteur={emptyAuteur}
								year={state.year} onYearChange={onYearChange}
								sites={state.sites} onSiteChange={onSiteChange}
								sitesExpanded={state.sitesExpanded} onSitesExpandedChange={onSitesExpandedChange}
							/>
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
							<MenuForm search={state.search} onSearchChange={onSearchChange} emptySearch={emptySearch}
								auteur={state.auteur} onAuteurChange={onAuteurChange} emptyAuteur={emptyAuteur}
								year={state.year} onYearChange={onYearChange}
								sites={state.sites} onSiteChange={onSiteChange}
								sitesExpanded={state.sitesExpanded} onSitesExpandedChange={onSitesExpandedChange}
							/>
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
							<MenuForm search={state.search} onSearchChange={onSearchChange} emptySearch={emptySearch}
								auteur={state.auteur} onAuteurChange={onAuteurChange} emptyAuteur={emptyAuteur}
								year={state.year} onYearChange={onYearChange}
								sites={state.sites} onSiteChange={onSiteChange}
								sitesExpanded={state.sitesExpanded} onSitesExpandedChange={onSitesExpandedChange}
							/>
							
							<ExpansionPanel expanded={state.themesExpanded} onChange={()=>setState(prevState => ({ ...prevState, themesExpanded: !state.themesExpanded}))}
							elevation={0} variant="outlined" className={classes.formExpansionPanel}>
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
							<MenuForm search={state.search} onSearchChange={onSearchChange} emptySearch={emptySearch}
								auteur={state.auteur} onAuteurChange={onAuteurChange} emptyAuteur={emptyAuteur}
								year={state.year} onYearChange={onYearChange}
								sites={state.sites} onSiteChange={onSiteChange}
								sitesExpanded={state.sitesExpanded} onSitesExpandedChange={onSitesExpandedChange}
							/>
							
							<ExpansionPanel expanded={state.themesExpanded} onChange={()=>setState(prevState => ({ ...prevState, themesExpanded: !state.themesExpanded}))}
							elevation={0} variant="outlined" className={classes.formExpansionPanel}>
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