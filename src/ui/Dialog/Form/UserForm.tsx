import React, { FunctionComponent, useState, useEffect } from "react"
import { Grid, TextField, Button, DialogTitle } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../../';
import * as action from '../../../store/actions';

export interface ContactState
{
    email?: string,
    password?: string,
    
    error: boolean,
    errorString?: string,

    userEmail?: string,
}

const UserForm: FunctionComponent = (): JSX.Element => 
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
    }, [setState]);

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
    
    const sendForm = async () => 
    {
        axios.post('http://localhost:25565/api/login', state,
        {headers: { 'Content-Type': 'application/json' }})
        .then(r => r.data[0] === undefined ? setState(prevState => ({ ...prevState, error: true, errorString: 'Email ou mot de passe incorrect'}))
            : logIn(r.data[0]?.id));
    }

    const logIn = (id: number) =>
    {
        dispatch(action.setUserId(id));
        axios.post('http://localhost:25565/api/selectUserInfo', {id: id},
            {headers: { 'Content-Type': 'application/json' }})
        .then(r => setState(prevState => ({ ...prevState, userEmail: r.data[0]?.email})));
    }

    const logOut = () => 
    {
        dispatch(action.setUserId(0));
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
                // type="submit"
                onClick={sendForm}
                color="primary" style={{marginTop: 8}} endIcon={<SendIcon/>}>
                    Se connecter
                </Button>
          </Grid>
        </form>
        : <>
            <DialogTitle> Email : {state.userEmail} </DialogTitle>
            <Button fullWidth variant="contained"
            // type="submit"
            onClick={logOut}
            color="primary" style={{marginTop: 8}}>
                Se deconnecter
            </Button>
        </> }

        </>
    )
}

export default UserForm;