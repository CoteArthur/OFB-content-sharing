import Menu from './ui/Menu'
import { Grid, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Table, withStyles, createStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import NavBar from './ui/NavBar';
import './scss/Home.scss';
import CustomCard from './ui/CustomCard';
import DialogContenu from './ui/Dialog/DialogContenu';
import DialogForm from './ui/Dialog/DialogForm';
import axios from 'axios';

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
	dialogType: string;
}

export type FiltersType = {
	orderBy?: string;
	desc?: boolean;
	search?: string;
	sites?: string;
}

const Home: React.FunctionComponent = (): JSX.Element =>
{
	const [state, setState] = useState<HomeState> ({
		selectedTable: 'undefined',
		filters: {orderBy: 'date', desc: true, search: undefined, sites: undefined},
		dataArray: [],
		isTable: false,
		selectedRow: undefined,
		dialogType: 'undefined',
	});

	useEffect(() => { 
			axios.post('http://35.214.28.194:25565/api/actualite',
			{headers: { 'Content-Type': 'application/json' }} )
			.then(r =>
				setState((prevState)=>({ 
					...prevState,
					selectedTable: 'actualite',
					dataArray: r.data,
				}))
			);
	}, [setState]);

	const fetchContent = async (childData: string, filters?: FiltersType) => {
		console.log(filters);
		if(!filters){
			setState((prevState: any)=>({ 
				...prevState,
				filters: {orderBy: 'date', desc: true, search: undefined, sites: undefined},
			}));
		}
		
		let boolTable: boolean = childData !== 'actualite';
		axios.post(`http://35.214.28.194:25565/api/${childData}`, filters,
		{headers: { 'Content-Type': 'application/json' }} )
		.then(r =>
			setState((prevState)=>({ 
				...prevState,
				selectedTable: childData,
				dataArray: r.data,
				isTable: boolTable,
			}))
		).catch(error =>{
			console.log(error);
			setState((prevState)=>({ 
				...prevState,
				selectedTable: childData,
				dataArray: [],
				isTable: boolTable,
			}));
		});
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

	const menuFilters = (search: string, sites: string): void => {
		let filters = {
			...state.filters,
			search,
			sites
		};
		setState((prevState: any)=>({ 
			...prevState,
			filters: filters
		}));
		fetchContent(state.selectedTable, filters);
	}
	
	const formatDate = (timestamp: any): String => {
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

	const [open, setOpen] = React.useState(false);

	const handleOpenRow = (row: any, strType: string) => {
		setState((prevState)=>({
			...prevState,
			selectedRow: row,
			dialogType: strType,
		}))
		setOpen(true);
	};

	const handleOpenForm = (strType: string) => {
		//TODO check if user is logged in
		setState((prevState)=>({
			...prevState,
			dialogType: strType,
		}))
		setOpen(true);
	};
	
	const handleClose = () => {
		setState((prevState)=>({
			...prevState,
			selectedRow: undefined,
			dialogType: "undefined",
		}))
		setOpen(false);
	};
	
	return (
		<>	
			<NavBar onClick={handleOpenForm}/>
			<Grid container spacing={1}>
				<Grid item xs={2}>
					<Paper elevation={3}>
						<Menu fetchContent={fetchContent} menuFilters={menuFilters}/>
					</Paper>
				</Grid>
				<Grid item xs={10}>
					<TableContainer component={Paper} style={{cursor: "pointer"}}>
						<Table stickyHeader aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell align="center" onClick={()=>orderBy('titre')}>
										Titre {state.filters.orderBy === 'titre' ? (state.filters.desc ? '▼' : '▲') : null}
									</TableCell>

									<TableCell align="center" onClick={()=>orderBy('date')}>
										Date {state.filters.orderBy === 'date' ? (state.filters.desc ? '▼' : '▲') : null}
									</TableCell>

									<TableCell align="center" onClick={()=>orderBy('userID')}>
										Auteur {state.filters.orderBy === 'userID' ? (state.filters.desc ? '▼' : '▲') : null}
									</TableCell>
									
									<TableCell align="center" onClick={()=>orderBy('site')}>
										Site {state.filters.orderBy === 'site' ? (state.filters.desc ? '▼' : '▲') : null}
									</TableCell>
								</TableRow>
							</TableHead>
							{state.isTable ? (
								<TableBody>
									{state.dataArray.map(row => (
										<StyledTableRow key={row.id} onClick={()=>handleOpenRow(row, 'pdf')}>
											<TableCell align="center">{row.titre}</TableCell>
											<TableCell align="center">{formatDate(row.date)}</TableCell>
											<TableCell align="center">{row.userID}</TableCell>
											<TableCell align="center">{row.site}</TableCell>
										</StyledTableRow>
									))}
								</TableBody>
							) : null}
						</Table>
					</TableContainer>
					{!state.isTable ? (
						<Grid container spacing={1} style={{paddingTop: 8}}>
							{state.dataArray.map(row => (
								<Grid item xs={3} key={row.id} style={{width: '250px'}}>
									<CustomCard row={row} onClick={handleOpenRow}/>
								</Grid>
							))}
						</Grid>
					) : null}
				</Grid>
			</Grid>

			{state.selectedRow ? 
				<DialogContenu open={open} row={state.selectedRow} type={state.dialogType} handleClose={handleClose}/> 
				: <DialogForm open={open} type={state.dialogType} handleClose={handleClose} />
			}
		</>
	);
}

export default Home;
