import React, { FunctionComponent, useEffect, useState } from "react"
import { Dialog, Fab, DialogTitle, DialogContent, DialogContentText, Typography } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';

type DialogContenuProps = {
    row: any,
    type: string,
    open: boolean,
    handleClose: () => void,
}

export interface DialogState {
    fileContent?: string;
}

const DialogContenu: FunctionComponent<DialogContenuProps> = (props: DialogContenuProps): JSX.Element => 
{

    const [state, setState] = useState<DialogState> ({
        fileContent: undefined,
    });
    
    useEffect(() => {
            axios.post('http://localhost:25565/api/getFile', {file: props.row.file},
                {headers: { 'Content-Type': 'application/json' }})
            .then(r => 
                setState((prevState)=>({ 
                    ...prevState,
                    fileContent: r.data.data,
                }))
            );
    }, [setState]);
    
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
    
    return(
        <Dialog open={props.open} onClose={props.handleClose} maxWidth='md' fullWidth>
            {props.type === 'actualite' ? <>
                <div style={{backgroundImage: `url(${state.fileContent})`, 
                backgroundSize: "contain", backgroundPositionX: "center",
                backgroundPositionY: "center", backgroundRepeat: "no-repeat",
                backgroundColor: "black", height: "300px"}}>
                    <Fab size='small' style={{position: "absolute",right: 0, margin: "15px"}}
                    color="primary" onClick={props.handleClose}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </Fab>
                </div>
                <DialogTitle>
                    {props.row.titre}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {props.row.description}
                    </DialogContentText>
                    
                    <Typography variant="subtitle2" color="textSecondary">
                        {formatDate(props.row.date)}
                    </Typography>
                </DialogContent>
            </> : <>
                <DialogTitle>
                    {props.row.titre}
                    <Fab size='small' style={{position: "absolute", right: 0, marginRight: "15px"}}
                    color="primary" onClick={props.handleClose}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </Fab>
                </DialogTitle>
                <object type="application/pdf"
                data={state.fileContent} height='10000' width=''
                />
            </>}
        </Dialog>
    )
}   

export default DialogContenu;