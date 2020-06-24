export enum AppActionEnum
{
    SET_USER_ID = 'SET_USER_ID'
}

export interface SetUserId
{
    type: string,
    value?: number
}

export type AppActions = SetUserId;
