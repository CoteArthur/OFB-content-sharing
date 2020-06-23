import React, { FunctionComponent} from "react"
import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@material-ui/core";
import {formatDate} from "../Home";

type CardProps = {
    row: any,
    openDialog: (type: string, row?: any) => void
}

const CustomCard: FunctionComponent<CardProps> = (props: CardProps): JSX.Element =>
{
    return(
        <Card onClick={()=>{props.openDialog('image', props.row)}}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    alt=""
                    height="140"
                    image={`http://localhost:25565/files/${props.row.file}`}
                />
                <CardContent>
                    <Typography variant="h5" noWrap>{props.row.titre}</Typography>
                    <Typography gutterBottom  variant="subtitle2" noWrap>
                        {formatDate(props.row.date)} - {props.row.site} - {props.row.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p" noWrap>
                        {props.row.description.split("-").join("\n")}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default CustomCard;