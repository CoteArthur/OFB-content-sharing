import { AppActionEnum, AppActions } from './types';
import { AppState } from '../index';
import { Dispatch } from 'react';

export const toggleClick = (active: boolean) =>
{
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) =>
    {
        return dispatch({
            type: AppActionEnum.TOGGLE_CLICK,
            active
        });
    }
};
export const setUserId = (value: number) =>
{
    return (dispatch: Dispatch<AppActions>, getState: () => AppState) =>
    {
        return dispatch({
            type: AppActionEnum.SET_USER_ID,
            value
        });
    }
};
