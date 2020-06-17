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
            axios.post('http://http://35.214.28.194:25565//api/selectUserInfo', {id: userID},
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
    
    const sendForm = async () => 
    {
        axios.post('http://http://35.214.28.194:25565//api/login', state,
        {headers: { 'Content-Type': 'application/json' }})
        .then(r => r.data[0] === undefined ? setState(prevState => ({ ...prevState, error: true, errorString: 'Email ou mot de passe incorrect'}))
            : logIn(r.data[0].id));
    }

    const logIn = (id: number) =>
    {
        dispatch(action.setUserId(id));
        axios.post('http://http://35.214.28.194:25565//api/selectUserInfo', {id: id},
            {headers: { 'Content-Type': 'application/json' }})
        .then(r => setState(prevState => ({ ...prevState, userEmail: r.data[0]?.email})));
    }

    const logOut = () => 
    {
        dispatch(action.setUserId(0));
        props.handleClose();
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
            <Typography variant="body1" color="textSecondary">
                Connecté en tant que: {state.userEmail}
            </Typography>
            <Button fullWidth variant="contained"
            // type="submit"
            onClick={logOut}
            color="primary" style={{marginTop: 8}} endIcon={<ExitToApp/>}>
                Se deconnecter
            </Button>
        </> }

        </>
    )
}

export default UserForm;