import Menu from './ui/Menu/Menu'
import { Grid, TableHead, TableRow, TableCell, TableBody, Table, withStyles, createStyles, Toolbar } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import NavBar from './ui/NavBar';
import './scss/Home.scss';
import CustomCard from './ui/CustomCard';
import axios from 'axios';
import {DialogUser, DialogAjout, DialogImage, DialogPdf} from './ui/Dialog/Dialogs';

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
	dataArray: Array<any>;
	isTable: boolean;
	selectedRow?: any;
	dialogType?: string;
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
		dataArray: [],
		isTable: false,
		selectedRow: undefined,
		dialogType: undefined,
	});

	useEffect(() => {
		axios.post(`http://localhost:25565/api/select`, {table: 'actualite'},
		{headers: { 'Content-Type': 'application/json' }} )
			.then(r =>
				r.data[0] ? (
					setState((prevState)=>({
						...prevState,
						selectedTable: 'actualite',
						dataArray: r.data,
					}))
				) : (
					setState((prevState)=>({
						...prevState,
						selectedTable: 'actualite',
						dataArray: [],
					}))
				)
			)
	}, [setState]);

	const fetchContent = async (table: string, filters?: FiltersType) => {
		if(!filters){
			setState((prevState: any)=>({
				...prevState,
				filters: {orderBy: 'date', desc: true, search: undefined, sites: undefined, year: undefined, auteur: undefined, themes: undefined},
			}));
		}
		
		if(table === 'presentationsites'){
			setState((prevState)=>({
				...prevState,
				selectedTable: 'presentationsites',
				dataArray: [],
			}));
		}else{
			let boolTable: boolean = table !== 'actualite';
			axios.post(`http://localhost:25565/api/select`, {table: table, filters},
			{headers: { 'Content-Type': 'application/json' }} )
			.then(r =>
				r.data[0] ? (
					setState((prevState)=>({
						...prevState,
						selectedTable: table,
						dataArray: r.data,
						isTable: boolTable,
					}))
				) : (
					setState((prevState)=>({
						...prevState,
						selectedTable: table,
						dataArray: [],
						isTable: boolTable,
					}))
				)
			);
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
	}

	const [open, setOpen] = React.useState(false);

	const openDialog = (type: string, row?: any) => {
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
		setOpen(true);
	};

	const closeDialog = () => {
		setState((prevState)=>({
			...prevState,
			selectedRow: undefined,
			dialogType: undefined,
		}))
		setOpen(false);
	};

	return (
		<>
			<NavBar openDialog={openDialog}/>
			<Toolbar/>
			<Menu fetchContent={fetchContent} menuFilters={menuFilters}/>
			<main style={{marginLeft: '290px'}}>
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
							
							<TableCell align="center" onClick={()=>orderBy('site')}>
								Site {state.filters.orderBy === 'site' ? (state.filters.desc ? '▼' : '▲') : null}
							</TableCell>

							{state.selectedTable === 'connaissancesproduites' || state.selectedTable === 'operationsgestion' ?
								<TableCell align="center" onClick={()=>orderBy('theme')}>
									Theme {state.filters.orderBy === 'theme' ? (state.filters.desc ? '▼' : '▲') : null}
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
									<TableCell align="center">{row.site}</TableCell>
									{state.selectedTable === 'connaissancesproduites' || state.selectedTable === 'operationsgestion' ?
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
								<CustomCard row={row} openDialog={openDialog}/>
							</Grid>
						))}
					</Grid>
				) : null}
			</main>

			{(() => {
				switch (state.dialogType) {
					case 'user':
						return <DialogUser open={open} closeDialog={closeDialog}/>;
					case 'ajout':
						return <DialogAjout open={open} closeDialog={closeDialog}/>;
					case 'image':
						return <DialogImage open={open} closeDialog={closeDialog} row={state.selectedRow}/>;
					case 'pdf':
						return <DialogPdf open={open} closeDialog={closeDialog} row={state.selectedRow}/>;;
					default:
						return null;
				}
			})()}
		</>
	);
}

export default Home;
