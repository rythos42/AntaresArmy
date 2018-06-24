import { AnyAction, ActionCreator } from "redux";
import Model from '../../model/Model';

export const ACTIONTYPE_SHARE_TO_FACEBOOK = "SHARE_TO_FACEBOOK";

export interface ShareToFacebookAction extends AnyAction {
    type: string;
    payload: {};
}

export interface SharingPanelState {
}

const initialState = {
};

export const shareToFacebook: ActionCreator<ShareToFacebookAction> = () => ({ type: ACTIONTYPE_SHARE_TO_FACEBOOK, payload: {} });

export const sharingPanelReducer = (state: SharingPanelState = initialState, action: AnyAction) => {
    switch(action.type) {
        case ACTIONTYPE_SHARE_TO_FACEBOOK:
            return { ...state };

        default:
            return state;
    }
};