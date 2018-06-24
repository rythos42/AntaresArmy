import { AnyAction, ActionCreator } from "redux";
import Model from '../../model/Model';
import Option from '../../model/Option';

const ACTIONTYPE_ADD_UNIT_TO_ARMY = "ADD_UNIT_TO_ARMY";
const ACTIONTYPE_ADD_OPTION_TO_ARMY = "ADD_OPTION_TO_ARMY";
const ACTIONTYPE_REMOVE_UNIT_FROM_ARMY = "REMOVE_UNIT_FROM_ARMY";
const ACTIONTYPE_REMOVE_OPTION_FROM_ARMY = "REMOVE_OPTION_FROM_ARMY";

interface AddUnitToArmyAction extends AnyAction {
    type: string;
    payload: {
        unitToAdd: Model
    };
}

interface AddOptionToArmyAction extends AnyAction {
    type: string;
    payload: {
        unitToAddTo: Model,
        optionToAdd: Option
    };
}

interface RemoveUnitFromArmyAction extends AnyAction {
    type: string;
    payload: {
        unitToRemove: Model
    }
}

interface RemoveOptionFromArmyAction extends AnyAction {
    type: string;
    payload: {
        unitToRemoveFrom: Model,
        optionToRemove: Option
    }
}

export interface AddUnitToArmyState {
    armyModels: Model[];
    nextUniqueId: number;
}

const initialState = {
    armyModels: [],
    nextUniqueId: 0
};

export const addUnitToArmy: ActionCreator<AddUnitToArmyAction> = (unitToAdd: Model) => ({ type: ACTIONTYPE_ADD_UNIT_TO_ARMY, payload: { unitToAdd: unitToAdd } });
export const addOptionToArmy: ActionCreator<AddOptionToArmyAction> = (unitToAddTo: Model, optionToAdd: Option) => ({ type: ACTIONTYPE_ADD_OPTION_TO_ARMY, payload: { unitToAddTo: unitToAddTo, optionToAdd: optionToAdd } });
export const removeUnitFromArmy: ActionCreator<RemoveUnitFromArmyAction> = (unitToRemove: Model) => ({ type: ACTIONTYPE_REMOVE_UNIT_FROM_ARMY, payload: { unitToRemove: unitToRemove } });
export const removeOptionFromArmy: ActionCreator<RemoveOptionFromArmyAction> = (unitToRemoveFrom: Model, optionToRemove: Option) => ({ type: ACTIONTYPE_REMOVE_OPTION_FROM_ARMY, payload: { unitToRemoveFrom: unitToRemoveFrom, optionToRemove: optionToRemove } });

export const addUnitToArmyReducer = (state: AddUnitToArmyState = initialState, action: AnyAction) => {
    let addToArray = (array: any[], item: Model | Option) => {
        let newArray = array.slice();
        newArray.push(item);
        return newArray;
    };
    
    let removeItemFromArray = (array: Model[] | Option[], item: Model | Option) => {
        let foundIndex = 0;
        for(let i = 0; i < array.length; i++) {
            if(array[i].uniqueId === item.uniqueId) {
                foundIndex = i;
                break;
            }                
        }
        
        return [
            ...array.slice(0, foundIndex),
            ...array.slice(foundIndex + 1)
        ];
    }
    
    switch(action.type) {
        case ACTIONTYPE_ADD_UNIT_TO_ARMY:
            let newModel = action.payload.unitToAdd;
            return { 
                ...state, 
                armyModels: addToArray(state.armyModels, new Model(
                    newModel.name, 
                    newModel.points, 
                    newModel.options.map((option: Option) => new Option(option.name, option.points, option.uniqueId)), 
                    newModel.origin, 
                    state.nextUniqueId++)) 
            };
            
        case ACTIONTYPE_ADD_OPTION_TO_ARMY:
            return { ...state, armyModels: state.armyModels.map(model => {
                if(model.uniqueId !== action.payload.unitToAddTo.uniqueId)
                    return model;
                    
                let newOption = action.payload.optionToAdd;
                return { ...model, addedOptions: addToArray(model.addedOptions, new Option(newOption.name, newOption.points, state.nextUniqueId++)) };
            })};
            
        case ACTIONTYPE_REMOVE_UNIT_FROM_ARMY:
            return { ...state, armyModels: removeItemFromArray(state.armyModels, action.payload.unitToRemove) };
            
        case ACTIONTYPE_REMOVE_OPTION_FROM_ARMY:
            return { ...state, armyModels: state.armyModels.map(model => {
                if(model.uniqueId !== action.payload.unitToRemoveFrom.uniqueId)
                    return model;
                
                return { ...model, addedOptions: removeItemFromArray(model.addedOptions, action.payload.optionToRemove) };
            })};
        
        default:
            return state;
    }
};