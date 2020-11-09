import React, { FunctionComponent } from "react"
import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@material-ui/core";
import { formatDate, SERVER_IP } from "../Home";

type CardActualiteProps = {
    row: any,
    openDialog: (type: string, row?: any) => void
}

const CardActualite: FunctionComponent<CardActualiteProps> = (props: CardActualiteProps): JSX.Element =>
{
    return(
        <Card onClick={()=>{props.openDialog('image', props.row)}}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    alt=""
                    height="140"
                    image={`${SERVER_IP}/files/${props.row.file}`}
                />
                <CardContent>
                    <Typography variant="h5" noWrap>{props.row.titre}</Typography>
                    <Typography gutterBottom  variant="subtitle2" noWrap>
                        {formatDate(props.row.date)} - {props.row.site} - {props.row.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p" noWrap>
                        {props.row.description.split('\n')[0]}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default CardActualite;