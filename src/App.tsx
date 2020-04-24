import { CssBaseline } from '@material-ui/core';
import React from 'react';
import Home from './Home';
import { AppState } from '.';
import { ThunkDispatch } from 'redux-thunk';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './store/actions';
import { AppActions } from './store/types';

const App: React.FunctionComponent<ReduxAppProps> = (props: ReduxAppProps): JSX.Element =>
{
	return (
		<>	
			<CssBaseline />
			<Home/>
		</>
	);
}

interface LinkStateProps
{
	isClick: boolean
}

interface LinkDispatchProps
{
	toggleClick: (active: boolean) => void
}

export type ReduxAppProps = LinkStateProps & LinkDispatchProps;

const mapStateToProps = (state: AppState, ownProps: any): LinkStateProps => 
({
	isClick: state.app.isClick
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>, ownProps: any): LinkDispatchProps => 
({
	toggleClick: bindActionCreators(actions.toggleClick, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);