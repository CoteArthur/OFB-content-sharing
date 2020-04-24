import React, { FunctionComponent, useState } from "react"
import { Grid, TextField, Button, Link} from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';

export interface ContactState
{
    email?: string,
    password?: string,
    inscription: boolean,
}

const UserForm: FunctionComponent = (): JSX.Element => 
{
    const [state, setState] = useState<ContactState>({
        email: undefined,
        password: undefined,
        inscription: false,
    });

    const onEmailChange = (event: any): void => 
	{
        event.persist();
        setState(prevState => ({ ...prevState, email: event.target.value}));
    }

    const onPasswordChange = (event: any): void => 
	{
        event.persist();
        setState(prevState => ({ ...prevState, password: event.target.value}));
    }
    
    const sendForm = async () => {
        console.log(state);
        axios.post('http://localhost:25565/api/login', state,
        {headers: { 'Content-Type': 'application/json' }})
        .then(r => console.log(r.data[0]?.id));
    }
    
    return(
        <form onSubmit={sendForm}>
            <Grid container direction="column" justify="space-evenly" alignItems="center">

                <TextField name="email" id="email" type="email" label="Email"
                variant="outlined" margin="normal" required fullWidth
                onChange={onEmailChange} />

                <TextField name="password" id="password" type="password" label="Mot de passe"
                variant="outlined" margin="normal" required fullWidth
                onChange={onPasswordChange} />

                {state.inscription ?
                    <TextField name="password" id="password" type="password" label="Confirmer mot de passe"
                    variant="outlined" margin="normal" required fullWidth
                    onChange={onPasswordChange} />
                : null}

                <Grid container direction="row" justify="space-evenly" alignItems="flex-end">
                    <Link component="button" type="button" variant="button"
                    onClick={()=>{setState(prevState => ({ ...prevState, inscription: !state.inscription}));}} >
                        {state.inscription ? "Se connecter" : "S'inscrire"}
                    </Link>
                    
                    <Button variant="contained"
                    // type="submit"
                    onClick={sendForm}
                    color="primary" style={{marginTop: 8}} endIcon={<SendIcon/>}>
                        {state.inscription ? "S'inscrire" : "Se connecter"}
                    </Button>
                </Grid>

          </Grid>
        </form>
    )
}

export default UserForm;