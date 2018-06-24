import { combineReducers } from 'redux';
import { factionSelectorReducer, FactionSelectorState } from './FactionSelector/FactionSelectorActions';
import { addUnitToArmyReducer, AddUnitToArmyState } from './UnitList/UnitListActions';

export interface AppState {
    factionSelector: FactionSelectorState
    currentArmy: AddUnitToArmyState
}

export default combineReducers({
    factionSelector: factionSelectorReducer,
    currentArmy: addUnitToArmyReducer
});