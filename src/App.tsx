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
	userID: number
}

interface LinkDispatchProps
{
	toggleClick: (active: boolean) => void
	setUserId: (value: number) => void
}

export type ReduxAppProps = LinkStateProps & LinkDispatchProps;

const mapStateToProps = (state: AppState, ownProps: any): LinkStateProps => 
({
	isClick: state.app.isClick,
	userID: state.app.userID
});

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>, ownProps: any): LinkDispatchProps => 
({
	toggleClick: bindActionCreators(actions.toggleClick, dispatch),
	setUserId: bindActionCreators(actions.setUserId, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);