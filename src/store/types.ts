export enum AppActionEnum
{
    TOGGLE_CLICK = 'TOGGLE_CLICK',
    SET_USER_ID = 'SET_USER_ID'
}

export interface ToggleClick
{
    type: string,
    active?: boolean
}

export interface SetUserId
{
    type: string,
    value?: number
}

export type AppActions = ToggleClick & SetUserId;
