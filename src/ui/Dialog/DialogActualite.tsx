import React, { FunctionComponent } from "react"
import { Dialog, Fab, DialogTitle, DialogContent, DialogContentText, Typography } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

type DialogActualiteProps = {
    row: any,
    type: string,
    open: boolean,
    handleClose: () => void
}

const DialogActualite: FunctionComponent<DialogActualiteProps> = (props: DialogActualiteProps): JSX.Element => 
{
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
                <div style={{backgroundImage: `url(${props.row.image})`, 
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
                data={props.row.file} height='10000' width=''
                />
            </>}
        </Dialog>
    )
}

export default DialogActualite;