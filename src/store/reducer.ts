import { AppActions, AppActionEnum } from './types';
import { updateObject } from '../utility';
import { ReduxAppProps } from '../App';

export let initialState: ReduxAppProps = {
	userID: 0,
    setUserId: (value: number) => null, 
};

const reducer = (state: ReduxAppProps = initialState, action: AppActions): ReduxAppProps =>
{
	switch (action.type)
	{
		case AppActionEnum.SET_USER_ID:
			return updateObject(state, {
				userID: action.value
			});
		default:
			return state;
	}
};

export default reducer;
