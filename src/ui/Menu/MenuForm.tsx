import React, { FunctionComponent } from 'react';
import { SiteType } from './CustomTypes';
import { TextField, IconButton, FormControl, InputLabel, Select, MenuItem, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, makeStyles, createStyles } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import SiteList from './SiteList';

const useStyles = makeStyles(() => createStyles({
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

export interface MenuFormProps {
    search: string,
	onSearchChange: (event: any) => void,
	emptySearch: () => void,

	auteur: string,
	onAuteurChange: (event: any) => void,
	emptyAuteur: () => void,

	year: string,
	onYearChange: (event: any) => void,

	sites: SiteType,
	onSiteChange: (event: any) => void

	sitesExpanded: boolean,
	onSitesExpandedChange: () => void,
}

const yearArray = ((): number[] => {
	let yearArray: number[] = []
	let currYear = (new Date().getFullYear());
	for(let i = currYear; i >= (currYear - 10); i--){
		yearArray.push(i);
	}
	return yearArray;
})();

const MenuForm: FunctionComponent<MenuFormProps> = (props: MenuFormProps): JSX.Element =>
{
	const classes = useStyles();

	return (
		<>
			<TextField name="search" variant="outlined"
			fullWidth label="Recherche" value={props.search} helperText="Titre, Mots clés"
			onChange={props.onSearchChange}
			InputProps={{
				endAdornment:
					(props.search !== '' ? (
						<IconButton size="small" style={{marginRight: 0}}
						onClick={props.emptySearch}>
							<FontAwesomeIcon icon={faTimesCircle} size="sm"/>
						</IconButton>
					) : null)
			}}/>

			<TextField name="auteur" variant="outlined"
			fullWidth label="Auteur" value={props.auteur} helperText="Nom, Prénom"
			onChange={props.onAuteurChange} style={{marginTop: '8px'}}
			InputProps={{
				endAdornment:
					(props.auteur !== '' ? (
						<IconButton size="small"
						onClick={props.emptyAuteur}>
							<FontAwesomeIcon icon={faTimesCircle} size="sm"/>
						</IconButton>
					) : null)
			}}/>

			<FormControl variant="outlined" fullWidth style={{marginTop: '8px'}}>
				<InputLabel id="labelSelectYear">Année</InputLabel>
				<Select name="year" id="year" labelId="labelSelectYear" label="Année"
				value={props.year} onChange={props.onYearChange}>
					<MenuItem value={''}><em>Vide</em></MenuItem>
					{yearArray.map(row => (
						<MenuItem value={row} key={row}>{row}</MenuItem>
					))}
				</Select>
			</FormControl>

			<ExpansionPanel expanded={props.sitesExpanded} onChange={props.onSitesExpandedChange}
			elevation={0} variant="outlined" className={classes.formExpansionPanel}>
				<ExpansionPanelSummary expandIcon={<FontAwesomeIcon icon={faCaretDown} size="xs"/>}
				className={classes.formExpansionPanelSummary}>
					<Typography>Sites</Typography>
				</ExpansionPanelSummary>

				<ExpansionPanelDetails>
					<SiteList sites={props.sites} onSiteChange={props.onSiteChange}/>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		</>
	);
}

export default MenuForm;