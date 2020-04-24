import { AppActions, AppActionEnum } from './types';
import { updateObject } from '../utility';
import { ReduxAppProps } from '../App';

export let initialState: ReduxAppProps = {
    isClick: false,
    toggleClick: (active: boolean) => null,
};

const reducer = (state: ReduxAppProps = initialState, action: AppActions): ReduxAppProps =>
{
	switch (action.type)
	{
		case AppActionEnum.TOGGLE_CLICK:
			return updateObject(state, {
				isClick: action.active
			});
		default:
			return state;
	}
};

export default reducer;
