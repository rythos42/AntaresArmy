import { call, put, take, race } from 'redux-saga/effects';
import { 
        ACTIONTYPE_CHANGE_FACTION, 
        ChangeFactionAction, 
        changeFaction,
        receiveFactionUnitListSucceeded,
        receiveFactionUnitListFailed
    } from './FactionSelectorActions';
import { ACTIONTYPE_APPLICATION_INIT, ApplicationInitAction } from '../AppActions';
import Model from '../../model/Model';
import Option from '../../model/Option';
import axios from 'axios';

function parseArmyListXml(factionName: string, armyListXml: any) {
    let armyListDom = new DOMParser().parseFromString(armyListXml.data, 'application/xml');
    
    let safeGetInnerHtml = (domElement: Element, selector: string) => { 
        let selectedDomElement = domElement.querySelector(selector);
        return selectedDomElement !== null ? selectedDomElement.innerHTML : '';
    };
    
    let uniqueId = 0;
    
    var models = Array.from(armyListDom.getElementsByTagName('model')).map(function(modelDom: Element) {
        let name = safeGetInnerHtml(modelDom, 'name');
        let points = parseInt(safeGetInnerHtml(modelDom, 'points'), 10);
        let options =  Array.from(modelDom.querySelectorAll('options option')).map(function(optionDom: Element) {
            let optionName = safeGetInnerHtml(optionDom, 'name');
            let optionPoints = parseInt(safeGetInnerHtml(optionDom, 'points'), 10);
            return new Option(optionName, optionPoints, uniqueId++);
        });
        
        return new Model(name, points, options, factionName, uniqueId++);
    });
    
    var availableArmyOptions = [];
    availableArmyOptions.push(new Option('Block!', 5, uniqueId++));
    availableArmyOptions.push(new Option('Extra Shot', 10, uniqueId++));
    availableArmyOptions.push(new Option('Superior Shard', 15, uniqueId++));
    availableArmyOptions.push(new Option('Well Prepared', 5, uniqueId++));
    availableArmyOptions.push(new Option('Get Up!', 10, uniqueId++));
    availableArmyOptions.push(new Option('Pull Yourself Together!', 15, uniqueId++));
    availableArmyOptions.push(new Option('Marksman', 15, uniqueId++));
    models.unshift(new Model('Army Options', 0, availableArmyOptions, factionName, uniqueId++));
    
    return models;
}

function getFactionUnitListFromServer(factionName: string) {
    //axios.get('php/ArmyListService.php?action=GetArmyList&army=' + factionName)
    return axios.get('http://localhost/Antares/src/php/ArmyListService.php?action=GetArmyList&army=' + factionName)
        .then(function(xml) {
            return parseArmyListXml(factionName, xml);
        });
}

function* fetchFactionUnitList(action: ChangeFactionAction) {
    try {
        const factionUnitList = yield call(getFactionUnitListFromServer, action.payload.newFactionName);
        yield put(receiveFactionUnitListSucceeded(factionUnitList));
    } catch(e) {
        yield put(receiveFactionUnitListFailed(e.message));
    }
}

export default function*() {
    const { changeFactionResponse, initResponse } = yield race({
        changeFactionResponse: take(ACTIONTYPE_CHANGE_FACTION),
        initResponse: take(ACTIONTYPE_APPLICATION_INIT)        
    });
    
    if(changeFactionResponse)
        yield fetchFactionUnitList(changeFactionResponse);
    if(initResponse)
        yield fetchFactionUnitList(changeFaction('Concord'));
}