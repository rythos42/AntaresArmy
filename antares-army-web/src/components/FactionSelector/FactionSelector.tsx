import React from 'react';
import * as Redux from 'redux'
import { connect } from 'react-redux';
import { changeFaction } from "./FactionSelectorActions";
import { AnyAction } from "redux";

interface FactionSelectorProps {
    selectedFaction: string
    selectFaction: (newFactionName: string) => void;
}
     
class FactionSelectorComponent extends React.Component<FactionSelectorProps, {}> {
    onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.selectFaction(event.target.value)
    }
    
    render() {
        return  <select onChange={this.onSelectChange} value={this.props.selectedFaction}>
                    <option value="Concord">Concord</option>
                    <option value="Freeborn">Freeborn</option>
                    <option value="Algoryn">Algoryn</option>
                    <option value="Isorian">Isorian</option>
                    <option value="Boromite">Boromite</option>
                    <option value="Ghar Empire">Ghar Empire</option>
                    <option value="Ghar Rebel">Ghar Rebel</option>
                </select>;
    }
}

const mapStateToProps = (state: FactionSelectorProps) => {
    return {
        selectedFaction: state.selectedFaction
    };
}

const mapDispatchToProps = (dispatch: Redux.Dispatch<AnyAction>) => {
    return {
        selectFaction: (newFactionName: string) => { 
            dispatch(changeFaction(newFactionName)) 
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FactionSelectorComponent);