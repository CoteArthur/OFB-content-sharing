export enum AppActionEnum
{
    TOGGLE_CLICK = 'TOGGLE_CLICK'
}

export interface ToggleClick
{
    type: string,
    active?: boolean
}

export type AppActions = ToggleClick;
