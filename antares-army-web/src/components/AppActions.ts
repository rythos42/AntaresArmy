import { AnyAction, ActionCreator } from "redux";

export const ACTIONTYPE_APPLICATION_INIT = 'APPLICATION_INIT';

export interface ApplicationInitAction extends AnyAction {
    type: string;
}

export const applicationInit: ActionCreator<ApplicationInitAction> = () => ({ type: ACTIONTYPE_APPLICATION_INIT });