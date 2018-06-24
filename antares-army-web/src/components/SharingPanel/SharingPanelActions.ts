import { AnyAction, ActionCreator } from "redux";
import Model from '../../model/Model';

export const ACTIONTYPE_SHARE_TO_FACEBOOK = "SHARE_TO_FACEBOOK";

export interface ShareToFacebookAction extends AnyAction {
    type: string;
    payload: {
    };
}

export interface SharingPanelState {
}

const initialState = {
};

export const changeFaction: ActionCreator<ShareToFacebookAction> = (factionName: string) => ({ type: ACTIONTYPE_SHARE_TO_FACEBOOK, payload: {} });

export const factionSelectorReducer = (state: SharingPanelState = initialState, action: AnyAction) => {
    switch(action.type) {
        case ACTIONTYPE_SHARE_TO_FACEBOOK:
            return { ...state };

            default:
            return state;
    }
};