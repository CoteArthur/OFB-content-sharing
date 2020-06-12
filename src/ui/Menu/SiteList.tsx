import React, { FunctionComponent } from 'react';
import { Grid, FormControlLabel, Checkbox } from '@material-ui/core';

export interface SiteListProps {
    sites: SiteType,
    onSiteChange: (event: any) => void
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

const SiteList: FunctionComponent<SiteListProps> = (props: SiteListProps): JSX.Element => 
{
	return (
		<Grid container direction="column" justify="center" alignItems="flex-start">
										<FormControlLabel 
											control={<Checkbox checked={props.sites.bauges.value} onChange={props.onSiteChange}
											name="Bauges" id="bauges" color="primary" />}
											label="Bauges"
										/>
										<FormControlLabel 
											control={<Checkbox checked={props.sites.belledonne.value} onChange={props.onSiteChange}
											name="Belledonne" id="belledonne" color="primary" />}
											label="Belledonne"
										/>
										<FormControlLabel 
											control={<Checkbox checked={props.sites.caroux.value} onChange={props.onSiteChange}
											name="Caroux" id="caroux" color="primary" />}
											label="Caroux"
										/>
										<FormControlLabel 
											control={<Checkbox checked={props.sites.chambord.value} onChange={props.onSiteChange}
											name="Chambord" id="chambord" color="primary" />}
											label="Chambord"
										/>
										<FormControlLabel 
											control={<Checkbox checked={props.sites.chateauvilain.value} onChange={props.onSiteChange}
											name="Chateauvilain" id="chateauvilain" color="primary" />}
											label="Chateauvilain"
										/>
										<FormControlLabel 
											control={<Checkbox checked={props.sites.chize.value} onChange={props.onSiteChange}
											name="Chizé" id="chize" color="primary" />}
											label="Chizé"
										/>
										<FormControlLabel 
											control={<Checkbox checked={props.sites.grandbirieux.value} onChange={props.onSiteChange}
											name="Grand Birieux" id="grandbirieux" color="primary" />}
											label="Grand Birieux"
										/>
										<FormControlLabel 
											control={<Checkbox checked={props.sites.lapetitepierre.value} onChange={props.onSiteChange}
											name="La Petite Pierre" id="lapetitepierre" color="primary" />}
											label="La Petite Pierre"
										/>
										<FormControlLabel 
											control={<Checkbox checked={props.sites.orlu.value} onChange={props.onSiteChange}
											name="Orlu" id="orlu" color="primary" />}
											label="Orlu"
										/>
										<FormControlLabel 
											control={<Checkbox checked={props.sites.troisfontaines.value} onChange={props.onSiteChange}
											name="Trois Fontaines" id="troisfontaines" color="primary" />}
											label="Trois Fontaines"
										/>
									</Grid>
	);
}

export default SiteList;