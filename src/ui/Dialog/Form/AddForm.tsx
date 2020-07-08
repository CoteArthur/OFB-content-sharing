import React, { FunctionComponent, useState } from "react"
import { Grid, Select, MenuItem, TextField, Button, FormControl, InputLabel, Typography} from "@material-ui/core";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';

import { useSelector } from 'react-redux';
import { AppState } from '../../../';

type AddFormProps = {
    closeDialog: () => void,
    openSnackbar: (message: string) => void,
}

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

const AddForm: FunctionComponent<AddFormProps> = (props: AddFormProps): JSX.Element =>
{
    const userID = useSelector((state: AppState) => state.app.userID);

    const [state, setState] = useState<ContactState>({
        type: 'actualite',
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
        setState(prevState => ({ ...prevState, type: event.target.value as string, file: undefined, fileName: undefined, theme: ''}));
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
    
    const sendForm = async (e: any) => {
        e.preventDefault();
        if(state.titre && state.site && state.fileName
            && (state.type === 'actualite' ? state.description : true)
            && ((() => {
                    switch (state.type) {
                        case 'presentationsites':
                        case 'connaissancesproduites':
                        case 'operationsgestion':
                            return true;
                        default:
                            return false;
                    }
                })() ? state.theme : true ))
        {
            await axios.post(`http://localhost:25565/api/insert`, {...state, userID},
                {headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'}
            })
            .then(r => {
                console.log(r.data);
                props.openSnackbar('Ajout effectué');
                props.closeDialog();
            });
        }
    }
    
    return(
        <form onSubmit={sendForm}>
            <Grid container direction="column" justify="space-evenly" alignItems="center">

                <FormControl variant="outlined" fullWidth required>
                    <InputLabel id="labelSelectType">Type</InputLabel>
                    <Select name="type" id="type" labelId="labelSelectType" label="Type *"
                    value={state.type} onChange={onTypeChange}>
                        <MenuItem value="actualite">Actualité</MenuItem>
                        <MenuItem value="presentationsites">Présentation des sites</MenuItem>
                        <MenuItem value="crterrain">Comptes-rendus terrain</MenuItem>
                        <MenuItem value="crpolice">Comptes-rendus Police</MenuItem>
                        <MenuItem value="connaissancesproduites">Connaissances produites</MenuItem>
                        <MenuItem value="operationsgestion">Opérations de gestion</MenuItem>
                    </Select>
                </FormControl>

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

                {state.type === "actualite" ? (
                    <>
                        {state.fileName !== undefined ?
                            <>
                                <img src={state.file} alt="a" style={{maxWidth: '200px', maxHeight: '200px',  borderRadius: 5}}/>
                                <Typography variant="subtitle2" color="textSecondary" style={{marginBottom: 8, textAlign: 'center', overflowWrap: 'anywhere'}}>
                                    {state.fileName}
                                </Typography>
                            </>
                        : null}
                        
                        <Button variant="contained" component="label" endIcon={<CloudUploadIcon/>} color="primary">
                            Image
                            <input type="file" accept="image/png, image/jpeg" hidden onChange={onFileChange}/>
                        </Button>
                        <input required style={{opacity: 0, pointerEvents: "none", height: 0, width: 0}} defaultValue={state.fileName}/>

                        <Typography variant="subtitle2" color="textSecondary" style={{textAlign: 'center'}}>
                                Taille maximale : 10MB
                        </Typography>

                        <TextField name="description" id="description" multiline rows="6"
                        variant="outlined" margin="normal" required fullWidth label="Description"
                        onChange={onDescriptionChange} />
                    </>
                ) : (
                    <>
                        {(() => {
                            switch (state.type) {
                                case 'presentationsites':
                                    return (
                                        <FormControl variant="outlined" fullWidth margin="normal" required>
                                            <InputLabel id="labelSelectTheme">Thème</InputLabel>
                                            <Select name="theme" id="theme" labelId="labelSelectTheme" label="Thème *"
                                            value={state.theme} onChange={onThemeChange}>
                                                <MenuItem value="Arrêté (création, réglementation)">Arrêté (création, réglementation)</MenuItem>
                                                <MenuItem value="Document de gestion">Document de gestion</MenuItem>
                                                <MenuItem value="Liens utiles">Liens utiles</MenuItem>
                                            </Select>
                                            <input required style={{opacity: 0, pointerEvents: "none", height: 0}} defaultValue={state.theme}/>
                                        </FormControl>
                                    );
                                case 'connaissancesproduites':
                                    return (
                                        <FormControl variant="outlined" fullWidth margin="normal" required>
                                            <InputLabel id="labelSelectTheme">Thème</InputLabel>
                                            <Select name="theme" id="theme" labelId="labelSelectTheme" label="Thème *"
                                            value={state.theme} onChange={onThemeChange}>
                                                <MenuItem value="Activités humaines">Activités humaines</MenuItem>
                                                <MenuItem value="Climat">Climat</MenuItem>
                                                <MenuItem value="Fonctionnement démographique">Fonctionnement démographique</MenuItem>
                                                <MenuItem value="Régimes alimentaire">Régimes alimentaire</MenuItem>
                                                <MenuItem value="Suivi sanitaire">Suivi sanitaire</MenuItem>
                                                <MenuItem value="Utilisation spatiale">Utilisation spatiale</MenuItem>
                                            </Select>
                                            <input required style={{opacity: 0, pointerEvents: "none", height: 0}} defaultValue={state.theme}/>
                                        </FormControl>
                                    );
                                case 'operationsgestion':
                                    return (
                                        <FormControl variant="outlined" fullWidth margin="normal" required>
                                            <InputLabel id="labelSelectTheme">Thème</InputLabel>
                                            <Select name="theme" id="theme" labelId="labelSelectTheme" label="Thème *"
                                            value={state.theme} onChange={onThemeChange}>
                                                <MenuItem value="Gestion agricole, pastorale">Gestion agricole, pastorale</MenuItem>
                                                <MenuItem value="Gestion forestière">Gestion forestière</MenuItem>
                                                <MenuItem value="Suivis Biodiversité">Suivis Biodiversité</MenuItem>
                                                <MenuItem value="Travaux, Interventions">Travaux, Interventions</MenuItem>
                                                <MenuItem value="Valorisations, Formations">Valorisations, Formations</MenuItem>
                                            </Select>
                                            <input required style={{opacity: 0, pointerEvents: "none", height: 0}} defaultValue={state.theme}/>
                                        </FormControl>
                                    );
                                default:
                                    return null;
                            }
                        })()}

                        {state.fileName !== undefined ?
                            <>
                                <Typography variant="subtitle2" color="textSecondary" style={{marginBottom: 8, textAlign: 'center', overflowWrap: 'anywhere'}}>
                                    {state.fileName}
                                </Typography>
                            </>
                        : null}
                        
                        <Button variant="contained" component="label" endIcon={<CloudUploadIcon/>} color="primary">
                            Fichier PDF
                            <input type="file" accept="application/pdf" hidden onChange={onFileChange}/>
                        </Button>
                        <input required style={{opacity: 0, pointerEvents: "none", height: 0, width: 0}} defaultValue={state.fileName}/>

                        <Typography variant="subtitle2" color="textSecondary" style={{textAlign: 'center'}}>
                                Taille maximale : 10MO
                        </Typography>

                        {state.type !== 'presentationsites' ?
                            <>
                                <TextField name="keywords" id="keywords" variant="outlined"
                                margin="normal" fullWidth label="Mots clés"
                                onChange={onKeywordsChange} />
                            </>
                        : null}
                    </>
                )}
                <Button fullWidth variant="contained"
                type="submit"
                color="primary" style={{marginTop: 8, marginBottom: 8}} endIcon={<SendIcon/>}>
                    Envoyer
                </Button>
          </Grid>
        </form>
    )
}

export default AddForm;