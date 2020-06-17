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
        setState(prevState => ({ ...prevState, type: event.target.value as string, file: undefined, theme: ''}));
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
                    <MenuItem value="insertCrpolice">Comptes-rendus police</MenuItem>
                    <MenuItem value="insertConnaissancesproduites">Connaissances produites</MenuItem>
                    <MenuItem value="insertOperationsgestion">Opérations de gestion</MenuItem>
                </Select>

                <TextField name="titre" id="titre" variant="outlined" 
                margin="normal" required fullWidth label="Titre" 
                onChange={onTitreChange} />

                <FormControl variant="outlined" fullWidth margin="normal" required>
                    <InputLabel id="labelSelectSite">Site</InputLabel>
                    <Select name="site" id="site" labelId="labelSelectSite" label="Site *"
                    value={state.site} onChange={onSiteChange}>
                        <MenuItem value="Bauges">Bauges</MenuItem>
                        <MenuItem value="Belledonne">Belledonne</MenuItem>
                        <MenuItem value="Caroux">Caroux</MenuItem>
                        <MenuItem value="Chambord">Chambord</MenuItem>
                        <MenuItem value="Chateauvilain">Chateauvilain</MenuItem>
                        <MenuItem value="Grand Birieux">Grand Birieux</MenuItem>
                        <MenuItem value="La Petite Pierre">La Petite Pierre</MenuItem>
                        <MenuItem value="Orlu">Orlu</MenuItem>
                        <MenuItem value="Trois Fontaines">Trois Fontaines</MenuItem>
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
                        <Typography variant="subtitle2" color="textSecondary" style={{textAlign: 'center'}}>
                                Taille maximale : 500MB
                        </Typography>

                        <TextField name="description" id="description" multiline rows="6"
                        variant="outlined" margin="normal" required fullWidth label="Description"
                        onChange={onDescriptionChange} />
                    </>
                ) : (
                    <>
                        {state.type === "insertConnaissancesproduites"?
                            <FormControl variant="outlined" fullWidth margin="normal" required>
                                <InputLabel id="labelSelectTheme">Thème</InputLabel>
                                <Select name="theme" id="theme" labelId="labelSelectTheme" label="Thème *"
                                value={state.theme} onChange={onThemeChange}>
                                    <MenuItem value="Activités humaine">Activités humaines</MenuItem>
                                    <MenuItem value="Climat">Climat</MenuItem>
                                    <MenuItem value="Fonctionnement démographique">Fonctionnement démographique</MenuItem>
                                    <MenuItem value="Régimes alimentaire">Régimes alimentaire</MenuItem>
                                    <MenuItem value="Suivi sanitaire">Suivi sanitaire</MenuItem>
                                    <MenuItem value="Utilisation spatiale">Utilisation spatiale</MenuItem>
                                </Select>
                                <input required style={{opacity: 0, pointerEvents: "none", height: 0}} defaultValue={state.theme}/>
                            </FormControl>
                        : null}

                        {state.type === "insertOperationsgestion" ?
                            <FormControl variant="outlined" fullWidth margin="normal" required>
                                <InputLabel id="labelSelectTheme">Thème</InputLabel>
                                <Select name="theme" id="theme" labelId="labelSelectTheme" label="Thème *"
                                value={state.theme} onChange={onThemeChange}>
                                    <MenuItem value="Gestion agricole / pastorale">Gestion agricole / pastorale</MenuItem>
                                    <MenuItem value="Gestion forestière">Gestion forestière</MenuItem>
                                    <MenuItem value="Suivis Biodiversité">Suivis Biodiversité</MenuItem>
                                    <MenuItem value="Travaux / interventions">Travaux / interventions</MenuItem>
                                    <MenuItem value="Valorisations / Formations">Valorisations / Formations</MenuItem>
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

                        <Typography variant="subtitle2" color="textSecondary" style={{textAlign: 'center'}}>
                                Taille maximale : 500MB
                        </Typography>

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