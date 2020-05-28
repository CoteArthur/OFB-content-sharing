import Menu from './ui/Menu'
import { Grid, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Table, withStyles, createStyles, Container } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import NavBar from './ui/NavBar';
import './scss/Home.scss';
import CustomCard from './ui/CustomCard';
import DialogContenu from './ui/Dialog/DialogContenu';
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
		dialogType: "undefined",
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
										<StyledTableRow key={row.id} onClick={()=>handleOpenRow(row, 'pdf')}>
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
										<CustomCard row={row} onClick={handleOpenRow}/>
									</Grid>
								))}
							</Grid>
						</Container>
						) : null}
					</TableContainer>

				</Grid>
			</Grid>

			{state.selectedRow ? <DialogContenu open={open} row={state.selectedRow} type={state.dialogType} handleClose={handleClose}/> 
			: <DialogCustomForm open={open} type={state.dialogType} handleClose={handleClose} />}
		</>
	);
}

export interface IHomeState {
	selectedTable?: string;
	filter?: string;
	dataArray: Array<any>;
	isTable: boolean;
	selectedRow?: any;
	dialogType: string;
}

export default Home;
