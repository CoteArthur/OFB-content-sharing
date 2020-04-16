import React, { FunctionComponent} from "react"
import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@material-ui/core";

type CardProps = {
    row: any,
    onClick: (row :any) => void
}

const CustomCard: FunctionComponent<CardProps> = (props: CardProps): JSX.Element => 
{

    const formatDate = (timestamp: string): String => {
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
        <Card onClick={()=>{props.onClick(props.row);}}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    alt=""
                    height="140"
                    image={props.row.image.split('+').join('/')}
                />
                <CardContent>
                    <Typography variant="h5" noWrap> {props.row.titre} </Typography>
                    <Typography gutterBottom  variant="subtitle2">
                        {formatDate(props.row.date)}
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