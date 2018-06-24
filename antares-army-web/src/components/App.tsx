import React from 'react'
import { hot } from 'react-hot-loader'
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddlware from 'redux-saga';

import AppReducer from './AppReducer';
import AppSaga from './AppSaga';
import AppHeader from './AppHeader';
import UnitList from './UnitList/UnitList';
import { applicationInit } from './AppActions';
import SharingPanel from './SharingPanel/SharingPanel';

import './../styles/styles.scss';

const sagaMiddleware = createSagaMiddlware();

const store = createStore(
    AppReducer,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(AppSaga);

store.dispatch(applicationInit());

const App = () =>
    <Provider store={store}>
        <div className="container">
            <AppHeader />
            <div className="row">
                <div className="col-12">
                    <UnitList />
                </div>                
            </div>
            <div className="row">
                <div className="col">
                    <SharingPanel />
                </div>
            </div>
        </div>
    </Provider>

export default hot(module)(App)