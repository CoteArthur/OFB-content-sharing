import Menu from './ui/Menu/Menu';
import { Grid, TableHead, TableRow, TableCell, TableBody, Table, withStyles, createStyles, Toolbar, Snackbar, IconButton, SnackbarContent, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import NavBar from './ui/NavBar';
import './scss/Home.scss';
import CardActualite from './ui/CardActualite';
import axios from 'axios';
import {DialogUser, DialogAjout, DialogImage, DialogPdf} from './ui/Dialog/Dialogs';
import CloseIcon from '@material-ui/icons/Close';

const StyledTableRow = withStyles(() =>
	createStyles({
		root: {
			'&:nth-of-type(odd)': {
				backgroundColor: "#ebdfd3",
			},
		},
	}),
)(TableRow);

export interface HomeState {
	selectedTable: string;
	filters: FiltersType;
	selectedSite: string;
	dataArray: Array<any>;
	isTable: boolean;

	selectedRow?: any;
	dialogType?: string;
	snackbarMessage?: string;
}

export type FiltersType = {
	orderBy?: string;
	desc?: boolean;
	search?: string;
	sites?: string;
	year?: string;
	auteur?: string;
	themes?: string;
}

export const formatDate = (timestamp: any): String => {
	let date = new Date(timestamp);
	let strDate = '';

	if(date.getDate()<10)
		strDate+='0';
	strDate+=date.getDate()+'/';

	if(date.getMonth()+1<10)
		strDate+='0';
	strDate+=date.getMonth()+1+'/'+date.getFullYear();

	return strDate;
}

const Home: React.FunctionComponent = (): JSX.Element =>
{
	const [state, setState] = useState<HomeState> ({
		selectedTable: 'undefined',
		filters: {orderBy: 'date', desc: true, search: undefined, sites: undefined, year: undefined, auteur: undefined, themes: undefined},
		selectedSite: '',
		dataArray: [],
		isTable: false,
		selectedRow: undefined,
		dialogType: undefined,
		snackbarMessage: undefined
	});

	useEffect(() => {
		axios.post(`${process.env.REACT_APP_BACKEND_HOST}/api/select`, {table: 'actualite'},
		{headers: { 'Content-Type': 'application/json' }} )
		.then(r => {
			if (!r.data[0]) throw r.data;	//TODO if data is array(0) send 'empty db' notification
			setState((prevState)=>({
				...prevState,
				selectedTable: 'actualite',
				dataArray: r.data,
			}))
		}).catch(err => {
			console.log(err);
			setState((prevState)=>({
				...prevState,
				selectedTable: 'actualite',
				dataArray: [],
			}))
		});
	}, [setState]);

	const fetchContent = async (table: string, filters?: FiltersType) => {
		if(!filters){
			setState((prevState: any)=>({
				...prevState,
				filters: {orderBy: 'date', desc: true, search: undefined, sites: undefined, year: undefined, auteur: undefined, themes: undefined},
				selectedSite: ''
			}));
		}

		if(table === 'presentationsites' && !filters?.sites){
			setState((prevState)=>({
				...prevState,
				selectedTable: 'presentationsites',
				dataArray: [],
			}));
		}else{
			let boolTable: boolean = table !== 'actualite';
			axios.post(`${process.env.REACT_APP_BACKEND_HOST}/api/select`, {table: table, filters},
			{headers: { 'Content-Type': 'application/json' }} )
			.then(r => {
					if (!r.data[0]) throw r.data;
					setState((prevState)=>({
						...prevState,
						selectedTable: table,
						dataArray: r.data,
						isTable: boolTable,
					}))
			}).catch(err => {
				console.log(err);
				setState((prevState)=>({
					...prevState,
					selectedTable: table,
					dataArray: [],
					isTable: boolTable,
				}))
			});
		}
	}

	const orderBy = (orderBy: string): void => {
		let filters: FiltersType;

		if(state.filters.orderBy === orderBy){
			filters = {
				...state.filters,
				orderBy,
				desc: !state.filters.desc
			};
		}else{
			filters = {
				...state.filters,
				orderBy,
				desc: true
			};
		}

		setState((prevState: any)=>({
			...prevState,
			filters: filters
		}));
		fetchContent(state.selectedTable, filters);
	}

	const menuFilters = (search: string, sites: string, year: string, auteur: string, themes: string): void => {
		let filters = {
			...state.filters,
			search,
			sites,
			year,
			auteur,
			themes
		};
		setState((prevState: any)=>({
			...prevState,
			filters: filters
		}));
		fetchContent(state.selectedTable, filters);
		openSnackbar('Filtres envoyés');
	}

	const onSelectedSiteChange = (event: any): void => {
		event.persist();
		setState(prevState => ({ ...prevState, selectedSite: event.target.value}));
		menuFilters('', `'${event.target.value}'`, '', '', '');
	}

	const openDialog = (type: string, row?: any): void => {
		if (row) {
			setState((prevState)=>({
				...prevState,
				selectedRow: row,
				dialogType: type,
			}))
		} else {
			setState((prevState)=>({
				...prevState,
				dialogType: type,
			}));
		}
	};

	const closeDialog = (fetch?: boolean): void => {
		if(fetch) fetchContent(state.selectedTable);

		setState((prevState)=>({
			...prevState,
			selectedRow: undefined,
			dialogType: undefined,
		}))
	};

	const openSnackbar = (message: string): void => {
		setState((prevState)=>({
			...prevState,
			snackbarMessage: message
		}));
	};

	const closeSnackbar = (event: React.SyntheticEvent | React.MouseEvent, reason?: string): void => {
		if (reason !== 'clickaway')
			setState((prevState)=>({
				...prevState,
				snackbarMessage: undefined
			}));
	};

	return (
		<>
			<NavBar openDialog={openDialog}/>
			<Toolbar/>
			<Menu fetchContent={fetchContent} menuFilters={menuFilters}/>
			<main style={{marginLeft: '290px', marginRight: '19px'}}>
				{state.selectedTable === 'presentationsites' ? (
					<FormControl variant="outlined" fullWidth margin="normal">
						<InputLabel id="labelSelectSite">Site</InputLabel>
						<Select name="site" id="site" labelId="labelSelectSite" label="Site"
						value={state.selectedSite} onChange={onSelectedSiteChange}>
							<MenuItem value="Bauges">Bauges</MenuItem>
							<MenuItem value="Belledonne">Belledonne</MenuItem>
							<MenuItem value="Caroux">Caroux</MenuItem>
							<MenuItem value="Chambord">Chambord</MenuItem>
							<MenuItem value="Chateauvilain">Chateauvilain</MenuItem>
							<MenuItem value="Grand Birieux">Grand Birieux</MenuItem>
							<MenuItem value="La Petite Pierre">La Petite Pierre</MenuItem>
							<MenuItem value="Orlu">Orlu</MenuItem>
							<MenuItem value="Trois Fontaines">Trois Fontaines</MenuItem>
						</Select>
					</FormControl>
				) : null}
				<Table stickyHeader aria-label="simple table" style={{cursor: 'pointer'}}>
					<TableHead>
						<TableRow>
							<TableCell align="center" onClick={()=>orderBy('titre')}>
								Titre {state.filters.orderBy === 'titre' ? (state.filters.desc ? '▼' : '▲') : null}
							</TableCell>

							<TableCell align="center" onClick={()=>orderBy('date')}>
								Date {state.filters.orderBy === 'date' ? (state.filters.desc ? '▼' : '▲') : null}
							</TableCell>

							<TableCell align="center" onClick={()=>orderBy('users.email')}>
								Auteur {state.filters.orderBy === 'users.email' ? (state.filters.desc ? '▼' : '▲') : null}
							</TableCell>

							{state.selectedTable !== 'presentationsites' ?
								<TableCell align="center" onClick={()=>orderBy('site')}>
									Site {state.filters.orderBy === 'site' ? (state.filters.desc ? '▼' : '▲') : null}
								</TableCell>
							: null}

							{state.selectedTable === 'connaissancesproduites'
							|| state.selectedTable === 'operationsgestion'
							|| state.selectedTable === 'presentationsites' ?
								<TableCell align="center" onClick={()=>orderBy('theme')}>
									Thème {state.filters.orderBy === 'theme' ? (state.filters.desc ? '▼' : '▲') : null}
								</TableCell>
							: null}
						</TableRow>
					</TableHead>

					{state.isTable ? (
						<TableBody>
							{state.dataArray.map(row => (
								<StyledTableRow key={row.id} onClick={()=>openDialog('pdf', row)}>
									<TableCell align="center">{row.titre}</TableCell>
									<TableCell align="center">{formatDate(row.date)}</TableCell>
									<TableCell align="center">{row.email}</TableCell>
									{state.selectedTable !== 'presentationsites' ?
										<TableCell align="center">{row.site}</TableCell>
									: null}
									{state.selectedTable === 'connaissancesproduites'
									||state.selectedTable === 'operationsgestion'
									|| state.selectedTable === 'presentationsites' ?
										<TableCell align="center">{row.theme}</TableCell>
									: null}
								</StyledTableRow>
							))}
						</TableBody>
					) : null}
				</Table>

				{!state.isTable ? (
					<Grid container spacing={1} style={{paddingTop: 8}}>
						{state.dataArray.map(row => (
							<Grid item xs={3} key={row.id} style={{width: '250px'}}>
								<CardActualite row={row} openDialog={openDialog}/>
							</Grid>
						))}
					</Grid>
				) : null}
			</main>

			{(() => {
				switch (state.dialogType) {
					case 'user':
						return <DialogUser open={state.dialogType !== undefined} closeDialog={closeDialog} openSnackbar={openSnackbar}/>;
					case 'ajout':
						return <DialogAjout open={state.dialogType !== undefined} closeDialog={closeDialog} openSnackbar={openSnackbar}/>;
					case 'image':
						return <DialogImage open={state.dialogType !== undefined} closeDialog={closeDialog} row={state.selectedRow}/>;
					case 'pdf':
						return <DialogPdf open={state.dialogType !== undefined} closeDialog={closeDialog} row={state.selectedRow}/>;
					default:
						return null;
				}
			})()}

			<Snackbar autoHideDuration={3000} open={state.snackbarMessage !== undefined} onClose={closeSnackbar}>
				<SnackbarContent
					message={state.snackbarMessage}
					action={
						<IconButton size='small' onClick={closeSnackbar}>
							<CloseIcon fontSize='small' style={{color: 'white'}}/>
						</IconButton>
					}
				/>
			</Snackbar>
		</>
	);
}

export default Home;
