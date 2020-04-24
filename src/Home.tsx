import Menu from './ui/Menu'
import { Grid, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Table, withStyles, createStyles, Container } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import NavBar from './ui/NavBar';
import './scss/Home.scss';
import CustomCard from './ui/CustomCard';
import DialogActualite from './ui/Dialog/DialogActualite';
import DialogCustomForm from './ui/Dialog/DialogCustomForm';
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

const Home: React.FunctionComponent = (): JSX.Element =>
{
	const [state, setState] = useState<IHomeState> ({
		selectedTable: undefined,
		filter: undefined,
		dataArray: [],
		isTable: false,
		selectedRow: undefined,
		formType: "undefined",
	});

	useEffect(() => { 
			axios.get('http://localhost:25565/api/actualite',
			{headers: { 'Content-Type': 'application/json' }} )
			.then(r =>
				setState((prevState)=>({ 
					...prevState,
					selectedTable: 'actualite',
					dataArray: r.data,
				}))
			);
	}, [setState]);

	const handleChange = async (childData: string | undefined, filters?: any) => {
			//console.log(filters);
			let boolTable: boolean;
			childData === 'actualite' ? boolTable = false : boolTable = true;
			axios.get(`http://localhost:25565/api/${childData}`,
			{headers: { 'Content-Type': 'application/json' }} )
			.then(r =>
				setState((prevState)=>({ 
					...prevState,
					selectedTable: childData,
					filter: undefined,
					dataArray: r.data,
					isTable: boolTable,
				}))
			).catch(error =>{
				console.log(error);
				setState((prevState)=>({ 
					...prevState,
					selectedTable: childData,
					filter: undefined,
					dataArray: [],
					isTable: boolTable,
				}));
			});
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

	const handleOpenCard = (row: any) => {
		row.image = row.image.split('+').join('/');
		setState((prevState)=>({
			...prevState,
			selectedRow: row,
		}))
		setOpen(true);
	};

	const handleOpenForm = (StrType: string) => {
		//check if user is logged in
		setState((prevState)=>({
			...prevState,
			formType: StrType,
		}))
		setOpen(true);
	};
	
	const handleClose = () => {
		setState((prevState)=>({
			...prevState,
			selectedRow: undefined,
		}))
		setOpen(false);
	};

	const sortBy = async (cell: String): Promise<void> => {
		try {
			let r;
			state.filter ? r = await fetch(`http://localhost:25565/api/${state.selectedTable}/${cell}/ASC/${state.filter}`) : r = await fetch(`http://localhost:25565/api/${state.selectedTable}/${cell}/ASC`);
			let datas = await r.json();
			setState((prevState)=>({ 
				...prevState,
				dataArray: datas,
			}));
		} catch (error) {
			console.log(error);
		}
	}

	const onFilterclick = async (filter: string): Promise<void> => {
		
	}
	
	return (
		<>	
			<NavBar onClick={handleOpenForm}/>
			<Grid container spacing={1}>
				<Grid item xs={2}>
					<Paper elevation={3}>
						<Menu onMenuChange={handleChange}/>
					</Paper>
				</Grid>
				<Grid item xs={10}>
					<TableContainer component={Paper} style={{height: window.innerHeight-64, cursor: "pointer"}}>
						<Table stickyHeader aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell align="left" onClick={()=>sortBy("titre")}>Titre</TableCell>
									<TableCell align="left" onClick={()=>sortBy("date")}>Date</TableCell>
									<TableCell align="left" onClick={()=>sortBy("auteur")}>Auteur</TableCell>
									<TableCell align="left" onClick={()=>sortBy("site")}>Site</TableCell>
								</TableRow>
							</TableHead>
							{state.isTable ? (
								<TableBody>
									{state.dataArray.map(row => (
										<StyledTableRow key={row.id}>
											<TableCell align="left">{row.titre}</TableCell>
											<TableCell align="left">{formatDate(row.date)}</TableCell>
											<TableCell align="left">{row.auteur}</TableCell>
											<TableCell align="left">{row.site}</TableCell>
										</StyledTableRow>
									))}
								</TableBody>
							) : null}
						</Table>

						{ !state.isTable ? (
						<Container>
							<Grid style={{paddingTop: 8}} container spacing={1}>
								{state.dataArray.map(row => (
									<Grid item xs={3} key={row.id}>
										<CustomCard row={row} onClick={handleOpenCard}/>
									</Grid>
								))}
							</Grid>
						</Container>
						) : null}
					</TableContainer>

					{state.selectedRow ? <DialogActualite open={open} row={state.selectedRow} handleClose={handleClose}/> 
					: <DialogCustomForm open={open} type={state.formType} handleClose={handleClose} />}
					
				</Grid>
			</Grid>
		</>
	);
}

export interface IHomeState {
	selectedTable?: string;
	filter?: string;
	dataArray: Array<any>;
	isTable: boolean;
	selectedRow?: any;
	formType?: string;
}

export default Home;
