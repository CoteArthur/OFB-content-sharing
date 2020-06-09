import React, { FunctionComponent, useState } from "react"
import { Grid, Select, MenuItem, TextField, Button, FormControl, InputLabel, Typography} from "@material-ui/core";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';

import { useSelector } from 'react-redux';
import { AppState } from '../../../';

export interface ContactState
{
    type?: string,
	titre?: string,
	description?: string,
    file?: string,
    fileName?: string,
    site?: string,
    keywords?: string,
    theme?: string,
    userID?: number,
}

const AddForm: FunctionComponent = (): JSX.Element => 
{
    const userID = useSelector((state: AppState) => state.app.userID);

    const [state, setState] = useState<ContactState>({
        type: 'insertActualite',
		titre: undefined,
		description: undefined,
        file: undefined,
        fileName: undefined,
        site: '',
        keywords: undefined,
        theme: '',
        userID: undefined,
    });

    const onTypeChange = (event: any): void => 
	{
        event.persist();
        setState(prevState => ({ ...prevState, type: event.target.value as string, file: undefined}));
    }
    
    const onTitreChange = (event: any): void => 
	{
		event.persist();
        setState(prevState => ({ ...prevState, titre: event.target.value }));
    }
    
    const onDescriptionChange = (event: any): void => 
	{
		event.persist();
        setState(prevState => ({ ...prevState, description: event.target.value }));
    }
    
    const onFileChange = (event: any): void => 
	{
        event.persist();

        if(event.target.files[0] !== undefined){
            let reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (e) => {
                setState(prevState => ({ ...prevState, file: e.target?.result as string, fileName: event.target.files[0].name}));
            }
        }
    }

    const onSiteChange = (event: any): void => 
	{
        event.persist();
        setState(prevState => ({ ...prevState, site: event.target.value as string}));
    }
    
    const onKeywordsChange = (event: any): void => 
	{
        event.persist();
        setState(prevState => ({ ...prevState, keywords: event.target.value}));
    }

    const onThemeChange = (event: any): void => 
	{
        event.persist();
        setState(prevState => ({ ...prevState, theme: event.target.value as string}));
    }
    
    const sendForm = async () => {
        state.userID = userID;
        await axios.post(`http://localhost:25565/api/${state.type}`,
            state, { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        })
        .then(r => console.log(r.data))
        .catch(err => console.log(err));
    }
    
    return(
        <form onSubmit={sendForm}>
            <Grid container direction="column" justify="space-evenly" alignItems="center">
                <Select name="type" id="type" variant="outlined" 
                required fullWidth value={state.type} onChange={onTypeChange} >
                    <MenuItem value="insertActualite">Actualité</MenuItem>
                    <MenuItem value="insertCrterrain">Comptes-rendus terrain</MenuItem>
                    <MenuItem value="insertConnaissancesProduites">Connaissances produites</MenuItem>
                </Select>

                <TextField name="titre" id="titre" variant="outlined" 
                margin="normal" required fullWidth label="Titre" 
                onChange={onTitreChange} />

                <FormControl variant="outlined" fullWidth margin="normal" required>
                    <InputLabel id="labelSelectSite">Site</InputLabel>
                    <Select name="site" id="site" labelId="labelSelectSite" label="Site *"
                    value={state.site} onChange={onSiteChange}>
                        <MenuItem value="Bauges">Bauges</MenuItem>
                        <MenuItem value="Vercors">Vercors</MenuItem>
                        <MenuItem value="Chartreuse">Chartreuse</MenuItem>
                    </Select>
                    <input required style={{opacity: 0, pointerEvents: "none", height: 0}} defaultValue={state.site}/>
                </FormControl>

                {state.type === "insertActualite" ? (
                    <>
                        {state.file !== undefined ? 
                            <>
                                <img src={state.file} alt="a" style={{marginBottom: 8, maxWidth: '200px', maxHeight: '200px',  borderRadius: 5}}/>
                                <Typography variant="subtitle2" color="textSecondary" style={{marginBottom: 8, textAlign: 'center', overflowWrap: 'anywhere'}}>
                                    {state.fileName}
                                </Typography>
                            </>
                        : null}
                        <input accept="image/*" hidden 
                        id="contained-button-file" multiple type="file" onChange={onFileChange}/>
                        <label htmlFor="contained-button-file">
                            <Button variant="contained" component="span"
                            endIcon={<CloudUploadIcon/>} style={{marginTop: 8}}color="primary">
                            Image
                            </Button>
                        </label>

                        <TextField name="description" id="description" multiline rows="6"
                        variant="outlined" margin="normal" required fullWidth label="Description"
                        onChange={onDescriptionChange} />
                    </>
                ) : (
                    <>
                        {state.type === "insertCrterrain"?
                            <FormControl variant="outlined" fullWidth margin="normal" required>
                                <InputLabel id="labelSelectTheme">Thème</InputLabel>
                                <Select name="theme" id="theme" labelId="labelSelectTheme" label="Thème *"
                                value={state.theme} onChange={onThemeChange}>
                                    <MenuItem value="Climat">Climat</MenuItem>
                                    <MenuItem value="Activité humaine">Activité humaine</MenuItem>
                                    <MenuItem value="Utilisation Spatialle">Utilisation Spatialle</MenuItem>
                                    <MenuItem value="Fonctionnement démographique">Fonctionnement démographique</MenuItem>
                                    <MenuItem value="Régimes Alimentaires">Régimes Alimentaires</MenuItem>
                                    <MenuItem value="Suivi sanitaire">Suivi sanitaire</MenuItem>
                                </Select>
                                <input required style={{opacity: 0, pointerEvents: "none", height: 0}} defaultValue={state.theme}/>
                            </FormControl>
                        : null}

                        {state.file !== undefined ?
                            <>
                                <Typography variant="subtitle2" color="textSecondary" style={{marginBottom: 8, textAlign: 'center', overflowWrap: 'anywhere'}}>
                                    {state.fileName}
                                </Typography>
                            </>
                        : null}
                        <input accept="application/pdf" hidden 
                        id="contained-button-file" multiple type="file" onChange={onFileChange}/>
                        <label htmlFor="contained-button-file">
                            <Button variant="contained" component="span" endIcon={<CloudUploadIcon/>} color="primary">
                            Fichier PDF
                            </Button>
                        </label>

                        <TextField name="keywords" id="keywords" variant="outlined" 
                        margin="normal" fullWidth label="Mots clés"
                        onChange={onKeywordsChange} />
                    </>
                )}
                <Button fullWidth variant="contained"
                // type="submit"
                onClick={sendForm}
                color="primary" style={{marginTop: 8, marginBottom: 8}} endIcon={<SendIcon/>}>
                    Envoyer
                </Button>
          </Grid>
        </form>
    )
}

export default AddForm;