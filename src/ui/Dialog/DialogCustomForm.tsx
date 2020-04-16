import React, { FunctionComponent } from "react"
import { Dialog, Fab, DialogTitle, DialogContent} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import UserForm from "./Form/UserForm";
import AddForm from "./Form/AddForm";

type DialogLoginFormProps = {
    open: boolean,
    type?: string,
    handleClose?: () => void
}

const DialogLoginForm: FunctionComponent<DialogLoginFormProps> = (props: DialogLoginFormProps): JSX.Element => 
{
    return(
        <Dialog open={props.open} onClose={props.handleClose} fullWidth>
            <DialogTitle>
                {props.type}
                <Fab size='small' style={{position: "absolute", right: 0, marginRight: "15px"}}
                color="primary" onClick={props.handleClose}>
                    <FontAwesomeIcon icon={faTimes}/>
                </Fab>
            </DialogTitle>
            <DialogContent>
                {props.type === "Ajout" ? <AddForm/> : <UserForm/>}
            </DialogContent>
        </Dialog>
    )
}

export default DialogLoginForm;