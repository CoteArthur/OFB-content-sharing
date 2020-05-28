import * as express from 'express';
import * as cors from 'cors';
import HomeRoute from './routes/home';

const app = express();

app.use(cors());
app.use(express.json({ limit: '500MB' }));


const port = process.env.PORT || 25565;
app.listen(port, () => console.log(`Server listening on port: ${port}`));


new HomeRoute(app);