import { combineReducers } from 'redux';
import { factionSelectorReducer, FactionSelectorState } from './FactionSelector/FactionSelectorActions';
import { addUnitToArmyReducer, AddUnitToArmyState } from './UnitList/UnitListActions';
import { sharingPanelReducer, SharingPanelState } from './SharingPanel/SharingPanelActions';

export interface AppState {
    factionSelector: FactionSelectorState
    currentArmy: AddUnitToArmyState,
    sharing: SharingPanelState
}

export default combineReducers({
    factionSelector: factionSelectorReducer,
    currentArmy: addUnitToArmyReducer,
    sharing: sharingPanelReducer
});