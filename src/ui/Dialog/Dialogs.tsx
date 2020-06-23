import React, { FunctionComponent } from "react"
import { Dialog, Fab, DialogTitle, DialogContent, Typography, DialogContentText } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../Home";
import UserForm from "./Form/UserForm";
import AddForm from "./Form/AddForm";

type DialogProps = {
    open: boolean,
    closeDialog: () => void,
    row?: any,
}

export const DialogUser: FunctionComponent<DialogProps> = (props: DialogProps): JSX.Element =>
{
    return(
        <Dialog open={props.open} onClose={props.closeDialog} fullWidth>
            <DialogTitle>
                Connexion
                <Fab size='small' style={{position: "absolute", right: 0, marginRight: "15px"}}
                color="primary" onClick={props.closeDialog}>
                    <FontAwesomeIcon icon={faTimes}/>
                </Fab>
            </DialogTitle>
            <DialogContent>
                <UserForm handleClose={props.closeDialog}/>
            </DialogContent>
        </Dialog>
    )
}

export const DialogAjout: FunctionComponent<DialogProps> = (props: DialogProps): JSX.Element =>
{
    return(
        <Dialog open={props.open} onClose={props.closeDialog} fullWidth>
            <DialogTitle>
                Ajout
                <Fab size='small' style={{position: "absolute", right: 0, marginRight: "15px"}}
                color="primary" onClick={props.closeDialog}>
                    <FontAwesomeIcon icon={faTimes}/>
                </Fab>
            </DialogTitle>
            <DialogContent>
                <AddForm/>
            </DialogContent>
        </Dialog>
    )
}

export const DialogImage: FunctionComponent<DialogProps> = (props: DialogProps): JSX.Element =>
{
    return(
        <Dialog open={props.open} onClose={props.closeDialog} maxWidth='md' fullWidth>
                <div style={{backgroundImage: `url(http://localhost:25565/files/${props.row.file})`,
                backgroundSize: "contain", backgroundPositionX: "center",
                backgroundPositionY: "center", backgroundRepeat: "no-repeat",
                backgroundColor: "black", height: "300px"}}>
                    <Fab size='small' style={{position: "absolute",right: 0, margin: "15px"}}
                    color="primary" onClick={props.closeDialog}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </Fab>
                </div>
                <DialogContent>
                    <Typography variant="h5" style={{marginBottom: 8}}>{props.row.titre}</Typography>
                    
                    <DialogContentText>
                        {props.row.description}
                    </DialogContentText>
                    
                    <Typography variant="subtitle1" color="textSecondary">
                        {formatDate(props.row.date)} - {props.row.site} - {props.row.email}
                    </Typography>
                </DialogContent>
        </Dialog>
    )
}

export const DialogPdf: FunctionComponent<DialogProps> = (props: DialogProps): JSX.Element =>
{
    return(
        <Dialog open={props.open} onClose={props.closeDialog} maxWidth='md' fullWidth>
                <DialogTitle>
                    {props.row.titre}
                    <Fab size='small' style={{position: "absolute", right: 0, marginRight: "15px"}}
                    color="primary" onClick={props.closeDialog}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </Fab>
                </DialogTitle>

                <object type="application/pdf" height='10000px'
                data={`http://localhost:25565/files/${props.row.file}`}>
                    Erreur lors du chargement du fichier
                </object>
        </Dialog>
    )
}
