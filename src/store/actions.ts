import { AppActionEnum, AppActions } from './types';
import { AppState } from '../index';
import { Dispatch } from 'react';

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
