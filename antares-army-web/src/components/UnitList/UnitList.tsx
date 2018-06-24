import React from 'react';
import * as Redux from 'redux'
import { connect } from 'react-redux';
import { addUnitToArmy, addOptionToArmy, removeUnitFromArmy, removeOptionFromArmy } from "./UnitListActions";
import { AnyAction } from "redux";
import Model from '../../model/Model';
import Option from '../../model/Option';
import { AppState } from '../AppReducer';

interface UnitListProps {
    unitList: Model[];
    addedUnitList: Model[];
    addUnitToArmy: (unitToAdd: Model) => void;
    addOptionToArmy: (unitToAddTo: Model, optionToAdd: Option) => void;
    removeUnitFromArmy: (unitToRemove: Model) => void;
    removeOptionFromArmy: (unitToRemoveFrom: Model, optionToRemove: Option) => void;
}

class UnitListComponent extends React.Component<UnitListProps, {}> {
    addUnitToArmy = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let selectedName = event.target.value;
        let selectedModel = this.props.unitList.find(unit => unit.name === selectedName);
        
        if(selectedModel)
            this.props.addUnitToArmy(selectedModel);
    }
    
    addOptionToUnit = (unitToAddTo: Model) => {
        return (event: React.ChangeEvent<HTMLSelectElement>) => {
            let selectedOptionName = event.target.value;
            let selectedOption = unitToAddTo.options.find(option => option.name === selectedOptionName);
            
            if(selectedOption)
                this.props.addOptionToArmy(unitToAddTo, selectedOption);          
        }
    }
    
    removeUnitFromArmy = (unitToRemove: Model) => {
        return () => {
            this.props.removeUnitFromArmy(unitToRemove);
        }        
    }
    
    removeOptionFromArmy = (unitToRemoveFrom: Model, optionToRemove: Option) => {
        return () => {
            this.props.removeOptionFromArmy(unitToRemoveFrom, optionToRemove);
        }
    }
    
    totalPoints = () => {
        return this.props.addedUnitList.reduce((modelAcc, addedModel) => {
            return modelAcc + addedModel.points + addedModel.addedOptions.reduce((optionsAcc, addedOption) => optionsAcc + addedOption.points, 0)
        }, 0)
    }
     
    render() {
        return  <table id="Models">
                    <tbody>
                    {this.props.addedUnitList.map(addedUnit => {
                        return <tr key={addedUnit.uniqueId}>
                            <td className="sortableHandle"><span className="icon-grip"></span></td>
                            <td className="name">{addedUnit.name} ({addedUnit.points})</td>
                            <td className="options">
                                <select value="caption" onChange={this.addOptionToUnit(addedUnit)}>
                                    <option value="caption" disabled>Add...</option>
                                    { addedUnit.options.map(option => <option key={option.uniqueId}>{option.name}</option>) }
                                </select>
                                { 
                                addedUnit.options.length > 0 
                                    ? <table id="Options">
                                        <tbody>
                                        {addedUnit.addedOptions.map(addedOption => {
                                            return <tr key={addedOption.uniqueId}>
                                                <td>{addedOption.name} ({addedOption.points})</td>
                                                <td>
                                                    <a href="#" className="link-icon" title="Delete option" onClick={this.removeOptionFromArmy(addedUnit, addedOption)}><span className="icon-bin"></span></a>
                                                </td>
                                            </tr>
                                        })}
                                        </tbody>
                                    </table>
                                    : null
                                }
                            </td>
                            <td>
                                <a href="#" className="link-icon" title="Delete unit" onClick={this.removeUnitFromArmy(addedUnit)}><span className="icon-bin"></span></a>
                            </td>
                        </tr>
                    })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={4}>
                                <select value="caption" onChange={this.addUnitToArmy}>
                                    <option value="caption" disabled>Add unit...</option>
                                    { this.props.unitList.map(unit => <option key={unit.uniqueId}>{unit.name}</option>) }
                                </select>
                            </td>
                        </tr>
                        {
                        this.props.addedUnitList.length > 0 
                            ? <tr>
                                <td />
                                <td>Total points:</td>
                                <td>{this.totalPoints()}</td> 
                                <td />
                            </tr>
                            : null
                        }
                    </tfoot>
                </table>;
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        unitList: state.factionSelector.unitList,
        addedUnitList: state.currentArmy.armyModels
    };
}

const mapDispatchToProps = (dispatch: Redux.Dispatch<AnyAction>) => {
    return {
        addUnitToArmy: (unitToAdd: Model) => {
            dispatch(addUnitToArmy(unitToAdd));
        },
        addOptionToArmy: (unitToAddTo: Model, optionToAdd: Option) => {
            dispatch(addOptionToArmy(unitToAddTo, optionToAdd));
        },
        removeUnitFromArmy: (unitToRemove: Model) => {
            dispatch(removeUnitFromArmy(unitToRemove));
        },
        removeOptionFromArmy: (unitToRemoveFrom: Model, optionToAdd: Option) => {
            dispatch(removeOptionFromArmy(unitToRemoveFrom, optionToAdd));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UnitListComponent);