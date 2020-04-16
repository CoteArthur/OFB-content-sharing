import { CssBaseline } from '@material-ui/core';
import React from 'react';
import Home from './Home';

const App: React.FunctionComponent = (): JSX.Element =>
{
	return (
		<>	
			<CssBaseline />
			<Home/>
		</>
	);
}
export default App;
