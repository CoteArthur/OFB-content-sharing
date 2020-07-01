import React, { FunctionComponent, useState, useEffect } from "react"
import { Grid, TextField, Button, Typography, FormControlLabel, Checkbox } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import ExitToApp from '@material-ui/icons/ExitToApp';
import axios from 'axios';

import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../../';
import * as action from '../../../store/actions';

type UserFormProps = {
    closeDialog: () => void,
    openSnackbar: (message: string) => void,
}

export interface ContactState
{
    email?: string,
    password?: string,
    admin: boolean,
    
    error: boolean,
    errorString?: string,

    userEmail?: string,
    isAdmin?: boolean
}

const UserForm: FunctionComponent<UserFormProps> = (props: UserFormProps): JSX.Element =>
{
    const dispatch = useDispatch();
	const userID = useSelector((state: AppState) => state.app.userID);

    const [state, setState] = useState<ContactState>({
        email: '',
        password: undefined,
        admin: false,

        error: false,
        errorString: undefined,

        userEmail: undefined,
        isAdmin: undefined,
    });

    useEffect(() => {
        if (userID !== 0){
            axios.post('http://35.214.28.194:25565/api/selectUserInfo', {id: userID},
            {headers: { 'Content-Type': 'application/json' }})
            .then(r => setState(prevState => ({ ...prevState, userEmail: r.data[0].email, isAdmin: r.data[0].admin})));
        }
    }, [userID, setState]);

    const onEmailChange = (event: any): void =>
	{
        event.persist();
        setState(prevState => ({ ...prevState, email: event.target.value, error: false, errorString: undefined}));
    }

    const onPasswordChange = (event: any): void =>
	{
        event.persist();
        setState(prevState => ({ ...prevState, password: event.target.value, error: false, errorString: undefined}));
    }

    const onAdminChange = (event: any): void =>
	{
        event.persist();
        setState(prevState => ({ ...prevState, admin: event.target.checked}));
    }
    
    const sendForm = async (e: any) =>
    {
        e.preventDefault();
        if(state.email && state.password){
            axios.post('http://35.214.28.194:25565/api/login', state, {headers: { 'Content-Type': 'application/json' }})
            .then(r => 
                r.data[0] ? logIn(r.data[0].id)
                : setState(prevState => ({ ...prevState, error: true, errorString: 'Email ou mot de passe incorrect'}))
            );
        }
    }

    const logIn = (id: number) =>
    {
        axios.post('http://35.214.28.194:25565/api/selectUserInfo', {id: id}, {headers: { 'Content-Type': 'application/json' }})
        .then(r => {
            dispatch(action.setUserId(id));
            props.openSnackbar('Connecté');
            setState(prevState => ({ ...prevState, userEmail: r.data[0]?.email, isAdmin: r.data[0].admin, email: ''}));
        });
    }
    
    const logOut = () =>
    {
        dispatch(action.setUserId(0));
        props.openSnackbar('Déconnecté');
        props.closeDialog();
    }
    
    const createUser = async (e: any) =>
    {
        e.preventDefault();
        if(state.email){
            axios.post(`http://35.214.28.194:25565/api/createUser`, {email: state.email, admin: state.admin}, {headers: { 'Content-Type': 'application/json' }})
            .then(r => {
                if (r.data) {
                    setState(prevState => ({ ...prevState, email: '', admin: false}));
                    props.openSnackbar('Email enregistré');
                } else {
                    setState(prevState => ({ ...prevState, error: true, errorString: 'Email déjà enregistré'}));
                }
            });
        }
    }
    return(
        <>
            {userID === 0 ?
                <form onSubmit={sendForm}>
                    <Grid container direction="column" justify="space-evenly" alignItems="center">
                        <TextField name="email" id="email" type="email" error={state.error}
                        label="Email" variant="outlined" required fullWidth
                        onChange={onEmailChange} />

                        <TextField name="password" id="password" type="password" label="Mot de passe" error={state.error} helperText={state.errorString}
                        variant="outlined" margin="normal" required fullWidth
                        onChange={onPasswordChange} />

                        <Button fullWidth variant="contained"
                        type="submit"
                        color="primary" style={{marginTop: 8}} endIcon={<SendIcon/>}>
                            Se connecter
                        </Button>
                    </Grid>
                </form>
            : <>
                <Typography variant="body1" color="textSecondary">
                    Connecté en tant que: {state.userEmail}
                </Typography>
                <Button fullWidth variant="contained" onClick={logOut}
                color="primary" style={{marginTop: 8}} endIcon={<ExitToApp/>}>
                    Se deconnecter
                </Button>

                {state.isAdmin ? <>
                        <Typography variant="h6" style={{marginTop: '32px', marginBottom: '8px'}}>Création de comptes</Typography>
                        <form onSubmit={createUser}>
                            <TextField name="email" id="email" type="email"
                            label="Email" variant="outlined" required fullWidth
                            value={state.email} onChange={onEmailChange} error={state.error} helperText={state.errorString}/>

                            <FormControlLabel label="Administrateur"
                            control={<Checkbox checked={state.admin} onChange={onAdminChange} color="primary" />}/>

                            <Button fullWidth variant="contained" type="submit"
                            color="primary" style={{marginBottom: 8}} endIcon={<SendIcon/>}>
                                Creer l'utilisateur
                            </Button>
                        </form>
                </> : null}
            </>}
        </>
    )
}

export default UserForm;