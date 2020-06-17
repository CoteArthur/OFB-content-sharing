import React, { FunctionComponent} from "react"
import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@material-ui/core";

type CardProps = {
    row: any,
    onClick: (row :any, strType: string) => void
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
        <Card onClick={()=>{props.onClick(props.row, 'actualite');}}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    alt=""
                    height="140"
                    image={`http://35.214.28.194:25565/files/${props.row.file}`}
                />
                <CardContent>
                    <Typography variant="h5" noWrap> {props.row.titre} </Typography>
                    <Typography gutterBottom  variant="subtitle2" noWrap>
                        {formatDate(props.row.date)} - {props.row.site}
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