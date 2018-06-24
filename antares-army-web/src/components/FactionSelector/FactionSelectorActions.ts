import { AnyAction, ActionCreator } from "redux";
import Model from '../../model/Model';

export const ACTIONTYPE_CHANGE_FACTION = "CHANGE_FACTION";
export const ACTIONTYPE_FACTION_UNIT_LIST_GET_SUCCEEDED = 'FACTION_UNIT_LIST_GET_SUCCEEDED';
export const ACTIONTYPE_FACTION_UNIT_LIST_GET_FAILED = 'FACTION_UNIT_LIST_GET_FAILED';

export interface ChangeFactionAction extends AnyAction {
    type: string;
    payload: {
        newFactionName: string
    };
}

export interface ReceiveFactionUnitListAction extends AnyAction {
    type: string;
    error: string;
    payload: {
        unitList: Model[]
    };
}

export interface FactionSelectorState {
    selectedFaction: string;
    unitList: Model[];
}

const initialState = {
    selectedFaction: 'Concord',
    unitList: []
};

export const changeFaction: ActionCreator<ChangeFactionAction> = (factionName: string) => ({ type: ACTIONTYPE_CHANGE_FACTION, payload: { newFactionName: factionName } });
export const receiveFactionUnitListSucceeded: ActionCreator<ReceiveFactionUnitListAction> = (unitList: Model[]) => ({ type: ACTIONTYPE_FACTION_UNIT_LIST_GET_SUCCEEDED, payload: { unitList: unitList }, error: '' });
export const receiveFactionUnitListFailed: ActionCreator<ReceiveFactionUnitListAction> = (error: string) => ({ type: ACTIONTYPE_FACTION_UNIT_LIST_GET_FAILED, payload: { unitList: [] }, error: error });

export const factionSelectorReducer = (state: FactionSelectorState = initialState, action: AnyAction) => {
    switch(action.type) {
        case ACTIONTYPE_CHANGE_FACTION:
            return { ...state, selectedFaction: action.payload.newFactionName };
        case ACTIONTYPE_FACTION_UNIT_LIST_GET_SUCCEEDED:
            return { ...state, unitList: action.payload.unitList };
        case ACTIONTYPE_FACTION_UNIT_LIST_GET_FAILED:
            console.log('Error: ' + action.error);
            return { ...state };
        default:
            return state;
    }
};