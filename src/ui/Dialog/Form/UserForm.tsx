import React, { FunctionComponent, useState, useEffect } from "react"
import { Grid, TextField, Button, Typography } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import ExitToApp from '@material-ui/icons/ExitToApp';
import axios from 'axios';

import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../../';
import * as action from '../../../store/actions';

type UserFormProps = {
    handleClose: () => void
}

export interface ContactState
{
    email?: string,
    password?: string,
    
    error: boolean,
    errorString?: string,

    userEmail?: string,
}

const UserForm: FunctionComponent<UserFormProps> = (props: UserFormProps): JSX.Element => 
{
    const dispatch = useDispatch();
	const userID = useSelector((state: AppState) => state.app.userID);

    const [state, setState] = useState<ContactState>({
        email: undefined,
        password: undefined,

        error: false,
        errorString: undefined,

        userEmail: undefined,
    });

    useEffect(() => { 
        if (userID !== 0){
            axios.post('http://localhost:25565/api/selectUserInfo', {id: userID},
            {headers: { 'Content-Type': 'application/json' }})
            .then(r => setState(prevState => ({ ...prevState, userEmail: r.data[0].email})));
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
    
    const sendForm = async (e: any) => 
    {
        if(state.email && state.password){
            axios.post('http://localhost:25565/api/login', state,
            {headers: { 'Content-Type': 'application/json' }})
            .then(r => r.data[0] === undefined ? setState(prevState => ({ ...prevState, error: true, errorString: 'Email ou mot de passe incorrect'}))
                : logIn(r.data[0].id))
            .then(e.preventDefault());
        }
    }

    const logIn = (id: number) =>
    {
        dispatch(action.setUserId(id));
        axios.post('http://localhost:25565/api/selectUserInfo', {id: id},
            {headers: { 'Content-Type': 'application/json' }})
        .then(r => setState(prevState => ({ ...prevState, userEmail: r.data[0]?.email, email: undefined})));
    }
    
    const logOut = () => 
    {
        dispatch(action.setUserId(0));
        props.handleClose();
    }
    
    const createUser = (e: any) =>
    {
        if(state.email){
            axios.post(`http://localhost:25565/api/createUser`, {email: state.email}, {headers: { 'Content-Type': 'application/json' }})
            .then(r => r.data ? setState(prevState => ({ ...prevState, error: true, errorString: 'Email déjà enregistré'})) : null)
            .then(e.preventDefault());
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

                <Button fullWidth variant="contained" onClick={sendForm}
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
            // type="submit"
            color="primary" style={{marginTop: 8}} endIcon={<ExitToApp/>}>
                Se deconnecter
            </Button>

            {userID === 1 ?
                <form>
                    <TextField name="email" id="email" type="email" 
                    label="Email" variant="outlined" required fullWidth style={{marginTop: '32px'}}
                    onChange={onEmailChange} error={state.error} helperText={state.errorString}/>

                    <Button fullWidth variant="contained" onClick={createUser}
                    type="submit"
                    color="primary" style={{marginTop: 8, marginBottom: 8}} endIcon={<SendIcon/>}>
                        Creer l'utilisateur
                    </Button>
                </form>
            : null}
        </> }

        </>
    )
}

export default UserForm;